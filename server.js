import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const { Pool } = pg;
const PORT = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET;
if (!SECRET) throw new Error('JWT_SECRET required');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '120kb' }));
app.use(cookieParser());
app.use('/api', rateLimit({ windowMs: 60_000, limit: 180, standardHeaders: true, legacyHeaders: false }));
app.use(express.static(path.join(__dirname, 'public')));

const clean = (v) => String(v ?? '').trim();
const emailOf = (v) => clean(v).toLowerCase();
const sessionToken = (u) => jwt.sign({ id: u.id, role: u.role }, SECRET, { expiresIn: '7d' });
const safeInt = (v, fallback) => Number.isFinite(Number(v)) ? Number(v) : fallback;

function ageFromBirthDate(date) {
  const b = new Date(date);
  const now = new Date();
  if (Number.isNaN(b.getTime())) return -1;
  let years = now.getFullYear() - b.getFullYear();
  const birthdayThisYear = new Date(now.getFullYear(), b.getMonth(), b.getDate());
  if (now < birthdayThisYear) years--;
  return years;
}

function setSession(res, user) {
  res.cookie('vowsi_session', sessionToken(user), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

function auth(req, res, next) {
  try {
    req.user = jwt.verify(req.cookies.vowsi_session, SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Sign in required' });
  }
}

async function getUser(userId) {
  const q = await pool.query(`
    SELECT id,email,display_name,birth_date,
      EXTRACT(YEAR FROM age(birth_date))::int AS age,
      country,city,languages,relationship_goal,bio,photo_url,role,
      gender,looking_for,interests,occupation,profile_completed,discovery_enabled
    FROM users WHERE id=$1
  `, [userId]);
  return q.rows[0];
}

async function ownsMatch(userId, matchId) {
  return (await pool.query(
    'SELECT 1 FROM matches WHERE id=$1 AND (user1_id=$2 OR user2_id=$2)',
    [matchId, userId]
  )).rowCount > 0;
}

async function touch(userId) {
  await pool.query('UPDATE users SET last_active_at=NOW() WHERE id=$1', [userId]).catch(() => {});
}

app.post('/api/signup', async (req, res) => {
  try {
    const { email, password, displayName, birthDate, country } = req.body;
    if (!email || !password || !displayName || !birthDate || !country) {
      return res.status(400).json({ error: 'Please complete all required fields.' });
    }
    if (ageFromBirthDate(birthDate) < 18) {
      return res.status(400).json({ error: 'VOWSI is for adults 18+ only.' });
    }
    if (String(password).length < 10) {
      return res.status(400).json({ error: 'Password must be at least 10 characters.' });
    }

    const role = emailOf(email) === emailOf(process.env.ADMIN_EMAIL) ? 'admin' : 'user';
    const hash = await bcrypt.hash(String(password), 12);
    const q = await pool.query(`
      INSERT INTO users(email,password_hash,display_name,birth_date,country,role)
      VALUES($1,$2,$3,$4,$5,$6)
      RETURNING id,email,display_name,role
    `, [emailOf(email), hash, clean(displayName), birthDate, clean(country), role]);

    const user = q.rows[0];
    setSession(res, user);
    res.status(201).json({ user, next: 'onboarding' });
  } catch (e) {
    res.status(e.code === '23505' ? 409 : 500).json({
      error: e.code === '23505' ? 'An account with this email already exists.' : 'Could not create account.'
    });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const q = await pool.query('SELECT * FROM users WHERE email=$1', [emailOf(req.body.email)]);
    const user = q.rows[0];
    if (!user || user.is_suspended || !await bcrypt.compare(String(req.body.password || ''), user.password_hash)) {
      return res.status(401).json({ error: 'Email or password is incorrect.' });
    }
    setSession(res, user);
    await touch(user.id);
    const profile = await getUser(user.id);
    res.json({ ok: true, user: profile, next: profile.profile_completed ? 'discover' : 'onboarding' });
  } catch {
    res.status(500).json({ error: 'Could not sign in.' });
  }
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('vowsi_session');
  res.json({ ok: true });
});

app.get('/api/me', auth, async (req, res) => {
  await touch(req.user.id);
  const user = await getUser(req.user.id);
  if (!user) return res.status(404).json({ error: 'Account not found.' });
  res.json(user);
});

app.put('/api/profile', auth, async (req, res) => {
  try {
    const p = req.body;
    const displayName = clean(p.displayName);
    const country = clean(p.country);
    const relationshipGoal = clean(p.relationshipGoal);
    const bio = clean(p.bio).slice(0, 800);

    if (!displayName || !country) return res.status(400).json({ error: 'Name and country are required.' });

    const complete = Boolean(displayName && country && relationshipGoal && bio);
    await pool.query(`
      UPDATE users SET
        display_name=$1,country=$2,city=$3,languages=$4,relationship_goal=$5,bio=$6,
        photo_url=$7,gender=$8,looking_for=$9,interests=$10,occupation=$11,
        profile_completed=$12,last_active_at=NOW()
      WHERE id=$13
    `, [
      displayName, country, clean(p.city), clean(p.languages), relationshipGoal, bio,
      clean(p.photoUrl), clean(p.gender), clean(p.lookingFor), clean(p.interests), clean(p.occupation),
      complete, req.user.id
    ]);
    res.json(await getUser(req.user.id));
  } catch {
    res.status(500).json({ error: 'Could not save your profile.' });
  }
});

app.put('/api/settings/discovery', auth, async (req, res) => {
  const enabled = Boolean(req.body.enabled);
  await pool.query('UPDATE users SET discovery_enabled=$1 WHERE id=$2', [enabled, req.user.id]);
  res.json({ ok: true, enabled });
});

app.get('/api/discover', auth, async (req, res) => {
  try {
    const country = clean(req.query.country);
    const goal = clean(req.query.goal);
    const minAge = Math.max(18, safeInt(req.query.minAge, 18));
    const maxAge = Math.min(99, Math.max(minAge, safeInt(req.query.maxAge, 99)));

    const q = await pool.query(`
      SELECT u.id,u.display_name,
        EXTRACT(YEAR FROM age(u.birth_date))::int AS age,
        u.country,u.city,u.languages,u.relationship_goal,u.bio,u.photo_url,
        u.gender,u.looking_for,u.interests,u.occupation
      FROM users u
      WHERE u.id<>$1
        AND NOT u.is_suspended
        AND u.discovery_enabled
        AND u.profile_completed
        AND EXTRACT(YEAR FROM age(u.birth_date))::int BETWEEN $2 AND $3
        AND ($4='' OR LOWER(u.country)=LOWER($4))
        AND ($5='' OR LOWER(u.relationship_goal)=LOWER($5))
        AND NOT EXISTS(
          SELECT 1 FROM blocks b
          WHERE (b.blocker_id=$1 AND b.blocked_id=u.id)
             OR (b.blocker_id=u.id AND b.blocked_id=$1)
        )
        AND NOT EXISTS(SELECT 1 FROM likes l WHERE l.liker_id=$1 AND l.liked_id=u.id)
        AND NOT EXISTS(SELECT 1 FROM passes p WHERE p.passer_id=$1 AND p.passed_id=u.id)
      ORDER BY u.last_active_at DESC, u.created_at DESC
      LIMIT 40
    `, [req.user.id, minAge, maxAge, country, goal]);
    res.json(q.rows);
  } catch {
    res.status(500).json({ error: 'Could not load Discover.' });
  }
});

app.post('/api/pass/:id', auth, async (req, res) => {
  const otherId = Number(req.params.id);
  if (!otherId || otherId === req.user.id) return res.status(400).json({ error: 'Invalid profile.' });
  await pool.query('INSERT INTO passes(passer_id,passed_id) VALUES($1,$2) ON CONFLICT DO NOTHING', [req.user.id, otherId]);
  res.json({ ok: true });
});

app.post('/api/like/:id', auth, async (req, res) => {
  const otherId = Number(req.params.id);
  if (!otherId || otherId === req.user.id) return res.status(400).json({ error: 'Invalid profile.' });

  const exists = await pool.query('SELECT 1 FROM users WHERE id=$1 AND NOT is_suspended', [otherId]);
  if (!exists.rowCount) return res.status(404).json({ error: 'Profile not found.' });

  await pool.query('INSERT INTO likes(liker_id,liked_id) VALUES($1,$2) ON CONFLICT DO NOTHING', [req.user.id, otherId]);
  const mutual = await pool.query('SELECT 1 FROM likes WHERE liker_id=$1 AND liked_id=$2', [otherId, req.user.id]);

  if (mutual.rowCount) {
    const user1 = Math.min(req.user.id, otherId);
    const user2 = Math.max(req.user.id, otherId);
    const match = await pool.query(`
      INSERT INTO matches(user1_id,user2_id) VALUES($1,$2)
      ON CONFLICT(user1_id,user2_id) DO UPDATE SET user1_id=EXCLUDED.user1_id
      RETURNING id
    `, [user1, user2]);
    const person = await pool.query('SELECT display_name,photo_url FROM users WHERE id=$1', [otherId]);
    return res.json({ matched: true, matchId: match.rows[0].id, person: person.rows[0] });
  }

  res.json({ matched: false });
});

app.get('/api/matches', auth, async (req, res) => {
  try {
    const q = await pool.query(`
      SELECT m.id AS match_id,u.id,u.display_name,u.country,u.city,u.photo_url,
        lm.body AS last_message,lm.created_at AS last_message_at,
        COALESCE(unread.count,0)::int AS unread_count
      FROM matches m
      JOIN users u ON u.id=CASE WHEN m.user1_id=$1 THEN m.user2_id ELSE m.user1_id END
      LEFT JOIN LATERAL (
        SELECT body,created_at FROM messages WHERE match_id=m.id ORDER BY created_at DESC LIMIT 1
      ) lm ON TRUE
      LEFT JOIN LATERAL (
        SELECT COUNT(*) FROM messages
        WHERE match_id=m.id AND sender_id<>$1 AND read_at IS NULL
      ) unread ON TRUE
      WHERE (m.user1_id=$1 OR m.user2_id=$1)
        AND NOT EXISTS(
          SELECT 1 FROM blocks b
          WHERE (b.blocker_id=$1 AND b.blocked_id=u.id)
             OR (b.blocker_id=u.id AND b.blocked_id=$1)
        )
      ORDER BY COALESCE(lm.created_at,m.created_at) DESC
    `, [req.user.id]);
    res.json(q.rows);
  } catch {
    res.status(500).json({ error: 'Could not load matches.' });
  }
});

app.get('/api/messages/:matchId', auth, async (req, res) => {
  const matchId = Number(req.params.matchId);
  if (!await ownsMatch(req.user.id, matchId)) return res.status(403).json({ error: 'Forbidden.' });

  await pool.query(
    'UPDATE messages SET read_at=NOW() WHERE match_id=$1 AND sender_id<>$2 AND read_at IS NULL',
    [matchId, req.user.id]
  );
  const q = await pool.query(`
    SELECT messages.id,messages.match_id,messages.sender_id,messages.body,messages.created_at,
      users.display_name AS sender
    FROM messages JOIN users ON users.id=messages.sender_id
    WHERE match_id=$1 ORDER BY messages.created_at
  `, [matchId]);
  res.json(q.rows);
});

app.post('/api/messages/:matchId', auth, async (req, res) => {
  const matchId = Number(req.params.matchId);
  const body = clean(req.body.body);
  if (!await ownsMatch(req.user.id, matchId)) return res.status(403).json({ error: 'Forbidden.' });
  if (!body || body.length > 2000) return res.status(400).json({ error: 'Message must be 1–2000 characters.' });

  const q = await pool.query(
    'INSERT INTO messages(match_id,sender_id,body) VALUES($1,$2,$3) RETURNING id,match_id,sender_id,body,created_at',
    [matchId, req.user.id, body]
  );
  res.status(201).json(q.rows[0]);
});

app.delete('/api/matches/:matchId', auth, async (req, res) => {
  const matchId = Number(req.params.matchId);
  if (!await ownsMatch(req.user.id, matchId)) return res.status(403).json({ error: 'Forbidden.' });
  await pool.query('DELETE FROM matches WHERE id=$1', [matchId]);
  res.json({ ok: true });
});

app.post('/api/block/:id', auth, async (req, res) => {
  const otherId = Number(req.params.id);
  if (!otherId || otherId === req.user.id) return res.status(400).json({ error: 'Invalid profile.' });
  await pool.query('INSERT INTO blocks(blocker_id,blocked_id) VALUES($1,$2) ON CONFLICT DO NOTHING', [req.user.id, otherId]);
  res.json({ ok: true });
});

app.post('/api/report/:id', auth, async (req, res) => {
  const otherId = Number(req.params.id);
  const reason = clean(req.body.reason).slice(0, 500);
  if (!otherId || otherId === req.user.id) return res.status(400).json({ error: 'Invalid profile.' });
  if (!reason) return res.status(400).json({ error: 'Please select or enter a reason.' });
  await pool.query('INSERT INTO reports(reporter_id,reported_id,reason) VALUES($1,$2,$3)', [req.user.id, otherId, reason]);
  res.json({ ok: true });
});

app.delete('/api/account', auth, async (req, res) => {
  await pool.query('DELETE FROM users WHERE id=$1', [req.user.id]);
  res.clearCookie('vowsi_session');
  res.json({ ok: true });
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

pool.query(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'))
  .then(() => app.listen(PORT, () => console.log(`VOWSI V2 running on ${PORT}`)))
  .catch((error) => {
    console.error('Database initialization failed:', error);
    process.exit(1);
  });

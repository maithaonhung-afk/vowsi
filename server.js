import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
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
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      imgSrc: ["'self'", 'data:'],
      objectSrc: ["'none'"],
      scriptSrc: ["'self'"],
      scriptSrcAttr: ["'none'"],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  },
  crossOriginResourcePolicy: { policy: 'same-origin' }
}));
app.use(express.json({ limit: '180kb' }));
app.use(cookieParser());

// Browser requests that change account data must come from this same VOWSI origin.
app.use('/api', (req, res, next) => {
  if (!['POST','PUT','PATCH','DELETE'].includes(req.method)) return next();
  const origin = req.get('origin');
  const fetchSite = req.get('sec-fetch-site');
  try {
    if (origin && new URL(origin).host !== req.get('host')) return res.status(403).json({ error: 'Request origin not allowed.' });
    if (fetchSite === 'cross-site') return res.status(403).json({ error: 'Cross-site request blocked.' });
  } catch { return res.status(403).json({ error: 'Request origin not allowed.' }); }
  next();
});

app.use('/api', rateLimit({ windowMs: 60_000, limit: 180, standardHeaders: true, legacyHeaders: false }));
app.use(express.static(path.join(__dirname, 'public')));

const authLimiter = rateLimit({ windowMs: 15 * 60_000, limit: 20, standardHeaders: true, legacyHeaders: false });
const uploadLimiter = rateLimit({ windowMs: 10 * 60_000, limit: 30, standardHeaders: true, legacyHeaders: false });
const messageLimiter = rateLimit({ windowMs: 60_000, limit: 30, standardHeaders: true, legacyHeaders: false });
const reportLimiter = rateLimit({ windowMs: 10 * 60_000, limit: 10, standardHeaders: true, legacyHeaders: false });
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    const ok = ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype);
    cb(ok ? null : new Error('Only JPG, PNG or WebP images are allowed.'), ok);
  }
});

const GENDERS = new Set(['Woman','Man']);
const LOOKING_FOR = new Set(['Women','Men','Everyone']);
const RELATIONSHIP_GOALS = new Set(['Serious relationship','Marriage','Long-term dating','Open to see where it goes']);
const clean = (v) => String(v ?? '').trim();
const emailOf = (v) => clean(v).toLowerCase();
const safeInt = (v, fallback) => Number.isFinite(Number(v)) ? Number(v) : fallback;
const sessionToken = (u) => jwt.sign({ id: u.id, role: u.role, sv: Number(u.session_version || 0) }, SECRET, { expiresIn: '7d' });

function ageFromBirthDate(date) {
  const b = new Date(date);
  const now = new Date();
  if (Number.isNaN(b.getTime())) return -1;
  let years = now.getFullYear() - b.getFullYear();
  const birthdayThisYear = new Date(now.getFullYear(), b.getMonth(), b.getDate());
  if (now < birthdayThisYear) years--;
  return years;
}

const cookieOptions = () => ({ httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
function setSession(res, user) {
  res.cookie('vowsi_session', sessionToken(user), { ...cookieOptions(), maxAge: 7 * 24 * 60 * 60 * 1000 });
}
function clearSession(res) { res.clearCookie('vowsi_session', cookieOptions()); }

async function auth(req, res, next) {
  try {
    const token = jwt.verify(req.cookies.vowsi_session, SECRET);
    const q = await pool.query('SELECT id,role,is_suspended,session_version FROM users WHERE id=$1', [token.id]);
    const user = q.rows[0];
    if (!user || user.is_suspended || Number(token.sv || 0) !== Number(user.session_version || 0)) {
      clearSession(res);
      return res.status(401).json({ error: 'Your session is no longer valid. Please sign in again.' });
    }
    req.user = { id: Number(user.id), role: user.role, sv: Number(user.session_version || 0) };
    next();
  } catch {
    clearSession(res);
    return res.status(401).json({ error: 'Sign in required.' });
  }
}

async function photoList(userId) {
  const q = await pool.query(
    'SELECT id,sort_order FROM profile_photos WHERE user_id=$1 ORDER BY sort_order,id',
    [userId]
  );
  return q.rows.map(r => ({ id: Number(r.id), url: `/api/photos/${r.id}` }));
}

async function getUser(userId) {
  const q = await pool.query(`
    SELECT id,email,display_name,birth_date,
      EXTRACT(YEAR FROM age(birth_date))::int AS age,
      country,city,languages,relationship_goal,bio,photo_url,role,
      gender,looking_for,interests,occupation,profile_completed,discovery_enabled
    FROM users WHERE id=$1
  `, [userId]);
  const user = q.rows[0];
  if (!user) return null;
  user.photos = await photoList(userId);
  return user;
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

async function hasAnyPhoto(userId) {
  const q = await pool.query(`
    SELECT EXISTS(SELECT 1 FROM profile_photos WHERE user_id=$1) AS uploaded,
           COALESCE(NULLIF(photo_url,''),'') AS legacy
    FROM users WHERE id=$1
  `, [userId]);
  return Boolean(q.rows[0]?.uploaded || q.rows[0]?.legacy);
}

app.post('/api/signup', authLimiter, async (req, res) => {
  try {
    const { email, password, displayName, birthDate, country, acceptedTerms } = req.body;
    const normalizedEmail = emailOf(email);
    const normalizedName = clean(displayName).slice(0,60);
    const normalizedCountry = clean(country).slice(0,80);
    if (!normalizedEmail || !password || !normalizedName || !birthDate || !normalizedCountry) {
      return res.status(400).json({ error: 'Please complete all required fields.' });
    }
    if (!acceptedTerms) return res.status(400).json({ error: 'Please accept the Terms and Community Guidelines.' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) || normalizedEmail.length > 254) return res.status(400).json({ error: 'Enter a valid email address.' });
    const age = ageFromBirthDate(birthDate);
    if (age < 18) return res.status(400).json({ error: 'VOWSI is for adults 18+ only.' });
    if (age > 120) return res.status(400).json({ error: 'Enter a valid date of birth.' });
    if (String(password).length < 10) return res.status(400).json({ error: 'Password must be at least 10 characters.' });

    const role = normalizedEmail === emailOf(process.env.ADMIN_EMAIL) ? 'admin' : 'user';
    const hash = await bcrypt.hash(String(password), 12);
    await pool.query(`
      INSERT INTO users(email,password_hash,display_name,birth_date,country,role,terms_accepted_at)
      VALUES($1,$2,$3,$4,$5,$6,NOW())
    `, [normalizedEmail, hash, normalizedName, birthDate, normalizedCountry, role]);

    res.status(201).json({ ok: true, email: normalizedEmail, next: 'login' });
  } catch (e) {
    res.status(e.code === '23505' ? 409 : 500).json({
      error: e.code === '23505' ? 'An account with this email already exists.' : 'Could not create account.'
    });
  }
});

app.post('/api/login', authLimiter, async (req, res) => {
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

app.post('/api/logout', async (req, res) => {
  try {
    const token = jwt.verify(req.cookies.vowsi_session, SECRET);
    await pool.query('UPDATE users SET session_version=session_version+1 WHERE id=$1', [token.id]);
  } catch {}
  clearSession(res);
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
    const current = await getUser(req.user.id);
    if (!current) return res.status(404).json({ error: 'Account not found.' });
    const p = req.body;
    const displayName = clean(p.displayName ?? current.display_name).slice(0,60);
    const country = clean(p.country ?? current.country).slice(0,80);
    const city = clean(p.city ?? current.city).slice(0,80);
    const languages = clean(p.languages ?? current.languages).slice(0, 160);
    const relationshipGoal = clean(p.relationshipGoal ?? current.relationship_goal);
    const bio = clean(p.bio ?? current.bio).slice(0, 800);
    const gender = clean(p.gender ?? current.gender);
    const lookingFor = clean(p.lookingFor ?? current.looking_for);
    const interests = clean(p.interests ?? current.interests).slice(0, 240);
    const occupation = clean(p.occupation ?? current.occupation).slice(0, 100);

    if (!displayName) return res.status(400).json({ error: 'Please add your display name.', field: 'displayName' });
    if (!country) return res.status(400).json({ error: 'Please add your country.', field: 'country' });
    if (!GENDERS.has(gender)) return res.status(400).json({ error: 'Please choose Woman or Man.', field: 'gender' });
    if (!LOOKING_FOR.has(lookingFor)) return res.status(400).json({ error: 'Please choose who you are looking for.', field: 'lookingFor' });
    if (!RELATIONSHIP_GOALS.has(relationshipGoal)) return res.status(400).json({ error: 'Please choose a valid relationship goal.', field: 'relationshipGoal' });
    if (!bio) return res.status(400).json({ error: 'Please write a short bio.', field: 'bio' });

    const hasPhoto = await hasAnyPhoto(req.user.id);
    if (!hasPhoto) return res.status(400).json({ error: 'Please add at least one photo.', field: 'photos' });

    await pool.query(`
      UPDATE users SET display_name=$1,country=$2,city=$3,languages=$4,relationship_goal=$5,bio=$6,
        gender=$7,looking_for=$8,interests=$9,occupation=$10,profile_completed=TRUE,last_active_at=NOW()
      WHERE id=$11
    `, [displayName,country,city,languages,relationshipGoal,bio,gender,lookingFor,interests,occupation,req.user.id]);

    res.json(await getUser(req.user.id));
  } catch (e) {
    console.error('Profile save error', e);
    res.status(500).json({ error: 'Could not save your profile.' });
  }
});

app.post('/api/photos', auth, uploadLimiter, (req, res, next) => {
  upload.single('photo')(req, res, err => {
    if (err) return res.status(400).json({ error: err.message || 'Could not upload photo.' });
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Choose a photo to upload.' });
    const buf = req.file.buffer;
    const detected = buf?.length >= 12 && buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF ? 'image/jpeg'
      : buf?.length >= 8 && buf.subarray(0,8).equals(Buffer.from([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A])) ? 'image/png'
      : buf?.length >= 12 && buf.subarray(0,4).toString('ascii') === 'RIFF' && buf.subarray(8,12).toString('ascii') === 'WEBP' ? 'image/webp' : '';
    if (!detected || detected !== req.file.mimetype) return res.status(400).json({ error: 'The uploaded file is not a valid JPG, PNG or WebP image.' });
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('SELECT pg_advisory_xact_lock($1)', [Number(req.user.id)]);
      const count = await client.query('SELECT COUNT(*)::int AS count FROM profile_photos WHERE user_id=$1', [req.user.id]);
      if (count.rows[0].count >= 6) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'You can add up to 6 photos.' });
      }
      const q = await client.query(`
        INSERT INTO profile_photos(user_id,image_data,mime_type,sort_order)
        VALUES($1,$2,$3,$4) RETURNING id,sort_order
      `, [req.user.id, req.file.buffer, detected, count.rows[0].count]);
      const id = q.rows[0].id;
      if (count.rows[0].count === 0) await client.query('UPDATE users SET photo_url=$1 WHERE id=$2', [`/api/photos/${id}`, req.user.id]);
      await client.query('COMMIT');
      return res.status(201).json({ id: Number(id), url: `/api/photos/${id}` });
    } catch (e) {
      await client.query('ROLLBACK').catch(()=>{});
      throw e;
    } finally { client.release(); }
  } catch (e) {
    console.error('Photo upload error', e);
    res.status(500).json({ error: 'Could not upload photo.' });
  }
});

app.get('/api/photos/:id', auth, async (req, res) => {
  const photoId = Number(req.params.id);
  if (!photoId) return res.status(404).end();
  const q = await pool.query(`
    SELECT p.image_data,p.mime_type,p.user_id,u.discovery_enabled,u.profile_completed
    FROM profile_photos p JOIN users u ON u.id=p.user_id
    WHERE p.id=$1
  `, [photoId]);
  const photo = q.rows[0];
  if (!photo) return res.status(404).end();
  if (Number(photo.user_id) !== Number(req.user.id)) {
    const blocked = await pool.query(`
      SELECT 1 FROM blocks WHERE (blocker_id=$1 AND blocked_id=$2) OR (blocker_id=$2 AND blocked_id=$1)
    `, [req.user.id, photo.user_id]);
    if (blocked.rowCount) return res.status(403).end();
    const matched = await pool.query(`
      SELECT 1 FROM matches WHERE (user1_id=$1 AND user2_id=$2) OR (user1_id=$2 AND user2_id=$1)
    `, [req.user.id, photo.user_id]);
    if (!matched.rowCount && !(photo.discovery_enabled && photo.profile_completed)) return res.status(403).end();
  }
  res.set('Content-Type', photo.mime_type);
  res.set('Cache-Control', 'private, max-age=3600');
  res.send(photo.image_data);
});

app.delete('/api/photos/:id', auth, async (req, res) => {
  const photoId = Number(req.params.id);
  const q = await pool.query('DELETE FROM profile_photos WHERE id=$1 AND user_id=$2 RETURNING id', [photoId, req.user.id]);
  if (!q.rowCount) return res.status(404).json({ error: 'Photo not found.' });
  const first = await pool.query('SELECT id FROM profile_photos WHERE user_id=$1 ORDER BY sort_order,id LIMIT 1', [req.user.id]);
  await pool.query('UPDATE users SET photo_url=$1,profile_completed=CASE WHEN $1=\'\' THEN FALSE ELSE profile_completed END WHERE id=$2', [first.rowCount ? `/api/photos/${first.rows[0].id}` : '', req.user.id]);
  res.json({ ok: true, photos: await photoList(req.user.id) });
});

app.put('/api/photos/order', auth, async (req, res) => {
  const ids = Array.isArray(req.body.ids) ? req.body.ids.map(Number).filter(Boolean).slice(0, 6) : [];
  if (!ids.length) return res.status(400).json({ error: 'No photos to reorder.' });
  const owned = await pool.query('SELECT id FROM profile_photos WHERE user_id=$1 AND id = ANY($2::bigint[])', [req.user.id, ids]);
  if (owned.rowCount !== ids.length) return res.status(400).json({ error: 'Invalid photo order.' });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (let i=0;i<ids.length;i++) await client.query('UPDATE profile_photos SET sort_order=$1 WHERE id=$2 AND user_id=$3', [i, ids[i], req.user.id]);
    await client.query('UPDATE users SET photo_url=$1 WHERE id=$2', [`/api/photos/${ids[0]}`, req.user.id]);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally { client.release(); }
  res.json({ ok: true, photos: await photoList(req.user.id) });
});

app.put('/api/settings/discovery', auth, async (req, res) => {
  const enabled = Boolean(req.body.enabled);
  await pool.query('UPDATE users SET discovery_enabled=$1 WHERE id=$2', [enabled, req.user.id]);
  res.json({ ok: true, enabled });
});

app.get('/api/discover', auth, async (req, res) => {
  try {
    const me = await getUser(req.user.id);
    if (!me?.profile_completed) return res.status(400).json({ error: 'Complete your profile before using Discover.' });
    const country = clean(req.query.country);
    const goal = clean(req.query.goal);
    const minAge = Math.max(18, safeInt(req.query.minAge, 18));
    const maxAge = Math.min(99, Math.max(minAge, safeInt(req.query.maxAge, 99)));

    const q = await pool.query(`
      SELECT u.id,u.display_name,EXTRACT(YEAR FROM age(u.birth_date))::int AS age,
        u.country,u.city,u.languages,u.relationship_goal,u.bio,
        COALESCE((SELECT '/api/photos/'||pp.id FROM profile_photos pp WHERE pp.user_id=u.id ORDER BY pp.sort_order,pp.id LIMIT 1),NULLIF(u.photo_url,'')) AS photo_url,
        u.gender,u.looking_for,u.interests,u.occupation
      FROM users u
      WHERE u.id<>$1 AND NOT u.is_suspended AND u.discovery_enabled AND u.profile_completed
        AND EXTRACT(YEAR FROM age(u.birth_date))::int BETWEEN $2 AND $3
        AND ($4='' OR LOWER(u.country)=LOWER($4))
        AND ($5='' OR LOWER(u.relationship_goal)=LOWER($5))
        AND (
          COALESCE($6,'')='' OR LOWER($6)='everyone' OR
          (LOWER($6)='women' AND LOWER(u.gender)='woman') OR
          (LOWER($6)='men' AND LOWER(u.gender)='man')
        )
        AND (
          COALESCE(u.looking_for,'')='' OR LOWER(u.looking_for)='everyone' OR
          (LOWER(u.looking_for)='women' AND LOWER($7)='woman') OR
          (LOWER(u.looking_for)='men' AND LOWER($7)='man')
        )
        AND NOT EXISTS(SELECT 1 FROM blocks b WHERE (b.blocker_id=$1 AND b.blocked_id=u.id) OR (b.blocker_id=u.id AND b.blocked_id=$1))
        AND NOT EXISTS(SELECT 1 FROM likes l WHERE l.liker_id=$1 AND l.liked_id=u.id)
        AND NOT EXISTS(SELECT 1 FROM passes p WHERE p.passer_id=$1 AND p.passed_id=u.id)
      ORDER BY u.last_active_at DESC,u.created_at DESC LIMIT 40
    `, [req.user.id,minAge,maxAge,country,goal,me.looking_for,me.gender]);
    res.json(q.rows);
  } catch (e) {
    console.error('Discover error', e);
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
  const me = await pool.query('SELECT profile_completed FROM users WHERE id=$1 AND NOT is_suspended', [req.user.id]);
  if (!me.rowCount || !me.rows[0].profile_completed) return res.status(400).json({ error: 'Complete your profile before liking people.' });
  const exists = await pool.query('SELECT 1 FROM users WHERE id=$1 AND NOT is_suspended AND profile_completed AND discovery_enabled', [otherId]);
  if (!exists.rowCount) return res.status(404).json({ error: 'Profile not found.' });
  const blocked = await pool.query('SELECT 1 FROM blocks WHERE (blocker_id=$1 AND blocked_id=$2) OR (blocker_id=$2 AND blocked_id=$1)', [req.user.id, otherId]);
  if (blocked.rowCount) return res.status(403).json({ error: 'This profile is unavailable.' });

  await pool.query('INSERT INTO likes(liker_id,liked_id) VALUES($1,$2) ON CONFLICT DO NOTHING', [req.user.id, otherId]);
  const mutual = await pool.query('SELECT 1 FROM likes WHERE liker_id=$1 AND liked_id=$2', [otherId, req.user.id]);
  if (mutual.rowCount) {
    const user1 = Math.min(req.user.id, otherId), user2 = Math.max(req.user.id, otherId);
    const match = await pool.query(`INSERT INTO matches(user1_id,user2_id) VALUES($1,$2) ON CONFLICT(user1_id,user2_id) DO UPDATE SET user1_id=EXCLUDED.user1_id RETURNING id`, [user1,user2]);
    const person = await pool.query('SELECT display_name FROM users WHERE id=$1', [otherId]);
    return res.json({ matched:true, matchId:match.rows[0].id, person:person.rows[0] });
  }
  res.json({ matched:false });
});


app.get('/api/notifications', auth, async (req, res) => {
  try {
    const q = await pool.query(`
      SELECT
        (SELECT COUNT(*)::int FROM messages msg JOIN matches m ON m.id=msg.match_id
         WHERE (m.user1_id=$1 OR m.user2_id=$1) AND msg.sender_id<>$1 AND msg.read_at IS NULL) AS unread_messages,
        (SELECT COUNT(*)::int FROM matches m
         WHERE (m.user1_id=$1 OR m.user2_id=$1)
           AND NOT EXISTS (SELECT 1 FROM match_seen ms WHERE ms.user_id=$1 AND ms.match_id=m.id)) AS new_matches
    `, [req.user.id]);
    res.json(q.rows[0]);
  } catch { res.status(500).json({ error: 'Could not load notifications.' }); }
});

app.post('/api/matches/seen', auth, async (req, res) => {
  await pool.query(`INSERT INTO match_seen(user_id,match_id)
    SELECT $1,id FROM matches WHERE user1_id=$1 OR user2_id=$1 ON CONFLICT DO NOTHING`, [req.user.id]);
  res.json({ ok:true });
});

app.put('/api/password', auth, authLimiter, async (req, res) => {
  try {
    const currentPassword=String(req.body.currentPassword||''), newPassword=String(req.body.newPassword||'');
    if (newPassword.length < 10) return res.status(400).json({error:'New password must be at least 10 characters.'});
    const q=await pool.query('SELECT password_hash FROM users WHERE id=$1',[req.user.id]);
    if (!q.rowCount || !await bcrypt.compare(currentPassword,q.rows[0].password_hash)) return res.status(400).json({error:'Current password is incorrect.'});
    const hash=await bcrypt.hash(newPassword,12);
    await pool.query('UPDATE users SET password_hash=$1,session_version=session_version+1 WHERE id=$2',[hash,req.user.id]);
    clearSession(res);
    res.json({ok:true,signedOut:true});
  } catch { res.status(500).json({error:'Could not change password.'}); }
});

app.get('/api/matches', auth, async (req, res) => {
  try {
    const q = await pool.query(`
      SELECT m.id AS match_id,u.id,u.display_name,u.country,u.city,
        COALESCE((SELECT '/api/photos/'||pp.id FROM profile_photos pp WHERE pp.user_id=u.id ORDER BY pp.sort_order,pp.id LIMIT 1),NULLIF(u.photo_url,'')) AS photo_url,
        lm.body AS last_message,lm.created_at AS last_message_at,COALESCE(unread.count,0)::int AS unread_count
      FROM matches m
      JOIN users u ON u.id=CASE WHEN m.user1_id=$1 THEN m.user2_id ELSE m.user1_id END
      LEFT JOIN LATERAL (SELECT body,created_at FROM messages WHERE match_id=m.id ORDER BY created_at DESC LIMIT 1) lm ON TRUE
      LEFT JOIN LATERAL (SELECT COUNT(*) FROM messages WHERE match_id=m.id AND sender_id<>$1 AND read_at IS NULL) unread ON TRUE
      WHERE (m.user1_id=$1 OR m.user2_id=$1)
        AND NOT EXISTS(SELECT 1 FROM blocks b WHERE (b.blocker_id=$1 AND b.blocked_id=u.id) OR (b.blocker_id=u.id AND b.blocked_id=$1))
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
  await pool.query('UPDATE messages SET read_at=NOW() WHERE match_id=$1 AND sender_id<>$2 AND read_at IS NULL', [matchId,req.user.id]);
  const q = await pool.query(`SELECT messages.id,messages.match_id,messages.sender_id,messages.body,messages.created_at,users.display_name AS sender FROM messages JOIN users ON users.id=messages.sender_id WHERE match_id=$1 ORDER BY messages.created_at`, [matchId]);
  res.json(q.rows);
});

app.post('/api/messages/:matchId', auth, messageLimiter, async (req, res) => {
  const matchId = Number(req.params.matchId), body = clean(req.body.body);
  if (!await ownsMatch(req.user.id, matchId)) return res.status(403).json({ error: 'Forbidden.' });
  if (!body || body.length > 2000) return res.status(400).json({ error: 'Message must be 1–2000 characters.' });
  const q = await pool.query('INSERT INTO messages(match_id,sender_id,body) VALUES($1,$2,$3) RETURNING id,match_id,sender_id,body,created_at', [matchId,req.user.id,body]);
  res.status(201).json(q.rows[0]);
});

app.delete('/api/matches/:matchId', auth, async (req, res) => {
  const matchId = Number(req.params.matchId);
  const q = await pool.query('SELECT user1_id,user2_id FROM matches WHERE id=$1 AND (user1_id=$2 OR user2_id=$2)', [matchId,req.user.id]);
  if (!q.rowCount) return res.status(403).json({ error: 'Forbidden.' });
  const otherId = Number(q.rows[0].user1_id) === Number(req.user.id) ? q.rows[0].user2_id : q.rows[0].user1_id;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM matches WHERE id=$1', [matchId]);
    await client.query('DELETE FROM likes WHERE (liker_id=$1 AND liked_id=$2) OR (liker_id=$2 AND liked_id=$1)', [req.user.id,otherId]);
    await client.query('INSERT INTO passes(passer_id,passed_id) VALUES($1,$2) ON CONFLICT DO NOTHING', [req.user.id,otherId]);
    await client.query('COMMIT');
  } catch (e) { await client.query('ROLLBACK'); throw e; } finally { client.release(); }
  res.json({ ok:true });
});

app.post('/api/block/:id', auth, async (req, res) => {
  const otherId = Number(req.params.id);
  if (!otherId || otherId === req.user.id) return res.status(400).json({ error: 'Invalid profile.' });
  const target = await pool.query('SELECT 1 FROM users WHERE id=$1', [otherId]);
  if (!target.rowCount) return res.status(404).json({ error: 'Profile not found.' });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('INSERT INTO blocks(blocker_id,blocked_id) VALUES($1,$2) ON CONFLICT DO NOTHING', [req.user.id,otherId]);
    await client.query('DELETE FROM matches WHERE (user1_id=$1 AND user2_id=$2) OR (user1_id=$2 AND user2_id=$1)', [req.user.id,otherId]);
    await client.query('COMMIT');
  } catch (e) { await client.query('ROLLBACK'); throw e; } finally { client.release(); }
  res.json({ ok:true });
});

app.post('/api/report/:id', auth, reportLimiter, async (req, res) => {
  const otherId = Number(req.params.id), reason = clean(req.body.reason).slice(0,500);
  if (!otherId || otherId === req.user.id) return res.status(400).json({ error: 'Invalid profile.' });
  if (!reason) return res.status(400).json({ error: 'Please select or enter a reason.' });
  const target = await pool.query('SELECT 1 FROM users WHERE id=$1', [otherId]);
  if (!target.rowCount) return res.status(404).json({ error: 'Profile not found.' });
  await pool.query('INSERT INTO reports(reporter_id,reported_id,reason) VALUES($1,$2,$3)', [req.user.id,otherId,reason]);
  res.json({ ok:true });
});

app.delete('/api/account', auth, async (req, res) => {
  await pool.query('DELETE FROM users WHERE id=$1', [req.user.id]);
  clearSession(res);
  res.json({ ok:true });
});

app.get('/health', (_req,res) => res.json({ ok:true, version:'2.4.0' }));
app.get('*', (_req,res) => res.sendFile(path.join(__dirname,'public','index.html')));

pool.query(fs.readFileSync(path.join(__dirname,'schema.sql'),'utf8'))
  .then(() => app.listen(PORT, '0.0.0.0', () => console.log(`VOWSI V2.4 running on ${PORT}`)))
  .catch(error => { console.error('Database initialization failed:', error); process.exit(1); });

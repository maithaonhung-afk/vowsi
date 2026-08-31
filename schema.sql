CREATE TABLE IF NOT EXISTS users(
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  country TEXT NOT NULL,
  city TEXT DEFAULT '',
  languages TEXT DEFAULT '',
  relationship_goal TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  photo_url TEXT DEFAULT '',
  role TEXT NOT NULL DEFAULT 'user',
  is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS gender TEXT DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS looking_for TEXT DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS interests TEXT DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS occupation TEXT DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS discovery_enabled BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE users ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS profile_photos(
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_data BYTEA NOT NULL,
  mime_type TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS likes(
  liker_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  liked_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY(liker_id,liked_id)
);

CREATE TABLE IF NOT EXISTS passes(
  passer_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  passed_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY(passer_id,passed_id)
);

CREATE TABLE IF NOT EXISTS matches(
  id BIGSERIAL PRIMARY KEY,
  user1_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  user2_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user1_id,user2_id)
);

CREATE TABLE IF NOT EXISTS messages(
  id BIGSERIAL PRIMARY KEY,
  match_id BIGINT REFERENCES matches(id) ON DELETE CASCADE,
  sender_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE messages ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS reports(
  id BIGSERIAL PRIMARY KEY,
  reporter_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  reported_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blocks(
  blocker_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  blocked_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY(blocker_id,blocked_id)
);

CREATE INDEX IF NOT EXISTS idx_users_discovery ON users(is_suspended, discovery_enabled, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profile_photos_user_sort ON profile_photos(user_id, sort_order, id);
CREATE INDEX IF NOT EXISTS idx_messages_match_created ON messages(match_id, created_at);
CREATE INDEX IF NOT EXISTS idx_likes_liked ON likes(liked_id, created_at DESC);


CREATE TABLE IF NOT EXISTS match_seen(
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  match_id BIGINT REFERENCES matches(id) ON DELETE CASCADE,
  seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY(user_id,match_id)
);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages(match_id, sender_id, read_at);
CREATE INDEX IF NOT EXISTS idx_match_seen_user ON match_seen(user_id, match_id);

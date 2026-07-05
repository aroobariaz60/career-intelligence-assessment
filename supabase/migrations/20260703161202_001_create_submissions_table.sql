/*
# Create submissions table for Career Intelligence Assessment

1. New Tables
- `submissions`: Stores all quiz submissions from students
  - `id` (uuid, primary key)
  - `full_name` (text, not null) - Student's full name
  - `email` (text, not null) - Student's email address
  - `answers` (jsonb, not null) - All question responses as key-value pairs
  - `body_score` (integer) - Body Smart category score
  - `picture_score` (integer) - Picture Smart category score
  - `word_score` (integer) - Word Smart category score
  - `logic_score` (integer) - Logic/Math Smart category score
  - `music_score` (integer) - Music Smart category score
  - `people_score` (integer) - People Smart category score
  - `highest_intelligence` (text) - The category with highest score
  - `recommended_careers` (jsonb) - Array of recommended careers
  - `feedback_easy` (text) - Feedback: was quiz easy to understand
  - `feedback_interesting` (text) - Feedback: was quiz interesting
  - `created_at` (timestamptz) - Submission timestamp

2. Security
- Enable RLS on `submissions`.
- Students can only INSERT their own submission (anon allowed).
- Admin can view all submissions (admin role or service key required).
- Students cannot read other students' data.
*/

CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  answers jsonb NOT NULL DEFAULT '{}',
  body_score integer NOT NULL DEFAULT 0,
  picture_score integer NOT NULL DEFAULT 0,
  word_score integer NOT NULL DEFAULT 0,
  logic_score integer NOT NULL DEFAULT 0,
  music_score integer NOT NULL DEFAULT 0,
  people_score integer NOT NULL DEFAULT 0,
  highest_intelligence text,
  recommended_careers jsonb DEFAULT '[]',
  feedback_easy text,
  feedback_interesting text,
  created_at timestamptz DEFAULT now()
);

-- Create index for faster searching/filtering
CREATE INDEX IF NOT EXISTS idx_submissions_email ON submissions(email);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_highest_intelligence ON submissions(highest_intelligence);

-- Enable RLS
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Allow students to insert their own submission (anon can insert)
DROP POLICY IF EXISTS "anon_insert_submissions" ON submissions;
CREATE POLICY "anon_insert_submissions" ON submissions FOR INSERT
TO anon, authenticated WITH CHECK (true);

-- Students cannot read submissions - only admin via service role can
-- No SELECT policy for anon/authenticated - they cannot read any rows
-- Admin access is via service_role key which bypasses RLS

-- Create admin_users table for admin authentication
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Only service role can access admin_users
DROP POLICY IF EXISTS "service_role_admin_users" ON admin_users;
CREATE POLICY "service_role_admin_users" ON admin_users FOR ALL
TO service_role USING (true) WITH CHECK (true);

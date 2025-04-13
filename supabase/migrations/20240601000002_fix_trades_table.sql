-- Create a new users table if it doesn't exist yet
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create trades table if it doesn't exist
CREATE TABLE IF NOT EXISTS trades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('buy', 'sell')),
  entry_price DECIMAL(18, 2) NOT NULL,
  exit_price DECIMAL(18, 2),
  position_size DECIMAL(18, 4) NOT NULL,
  pnl DECIMAL(18, 2),
  pnl_percentage DECIMAL(8, 2),
  status TEXT NOT NULL CHECK (status IN ('open', 'closed')),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  duration TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable row level security
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own trades
DROP POLICY IF EXISTS "Users can only see their own trades" ON trades;
CREATE POLICY "Users can only see their own trades"
ON trades FOR SELECT
USING (user_id = auth.uid());

-- Create policy to allow users to insert their own trades
DROP POLICY IF EXISTS "Users can insert their own trades" ON trades;
CREATE POLICY "Users can insert their own trades"
ON trades FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Create policy to allow users to update their own trades
DROP POLICY IF EXISTS "Users can update their own trades" ON trades;
CREATE POLICY "Users can update their own trades"
ON trades FOR UPDATE
USING (user_id = auth.uid());

-- Create policy to allow users to delete their own trades
DROP POLICY IF EXISTS "Users can delete their own trades" ON trades;
CREATE POLICY "Users can delete their own trades"
ON trades FOR DELETE
USING (user_id = auth.uid());

-- Enable realtime for both tables
alter publication supabase_realtime add table trades;
alter publication supabase_realtime add table users;

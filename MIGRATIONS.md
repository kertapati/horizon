# Database Migrations

Run these SQL statements in the Supabase SQL Editor to update your database schema.

## Migration: Add Gastronomy Module + Country Column

Run this SQL to add the gastronomy module fields and country column to your `bucket_list_items` table:

```sql
-- Add country column if it doesn't exist
ALTER TABLE bucket_list_items ADD COLUMN IF NOT EXISTS country TEXT;

-- Add gastronomy module columns if they don't exist
ALTER TABLE bucket_list_items ADD COLUMN IF NOT EXISTS gastronomy_type TEXT CHECK (gastronomy_type IN ('restaurant', 'dish', NULL));
ALTER TABLE bucket_list_items ADD COLUMN IF NOT EXISTS cuisine TEXT;
ALTER TABLE bucket_list_items ADD COLUMN IF NOT EXISTS neighborhood TEXT;
ALTER TABLE bucket_list_items ADD COLUMN IF NOT EXISTS price_level TEXT CHECK (price_level IN ('$', '$$', '$$$', '$$$$', NULL));
ALTER TABLE bucket_list_items ADD COLUMN IF NOT EXISTS difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'complex', NULL));
ALTER TABLE bucket_list_items ADD COLUMN IF NOT EXISTS notes TEXT;
```

## Migration: Add Year Notes Table

Run this SQL to create the `year_notes` table for the Yearly Manifesto feature:

```sql
-- Create year_notes table
CREATE TABLE IF NOT EXISTS year_notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  year INTEGER NOT NULL,
  content TEXT DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  -- Ensure one note per user per year
  UNIQUE(user_id, year)
);

-- Enable Row Level Security
ALTER TABLE year_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own notes
CREATE POLICY "Users can view own year notes"
  ON year_notes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own year notes"
  ON year_notes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own year notes"
  ON year_notes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own year notes"
  ON year_notes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_year_notes_updated_at
  BEFORE UPDATE ON year_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## How to Run

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the sidebar
3. Copy and paste the SQL above
4. Click "Run" to execute

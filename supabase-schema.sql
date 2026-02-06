-- Horizon: Life Architecture App Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Enable Row Level Security on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies: All authenticated users can read all profiles (shared between couple)
CREATE POLICY "Authenticated users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Bucket List Items Table
CREATE TABLE IF NOT EXISTS bucket_list_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  categories TEXT[] DEFAULT '{}',
  location_type TEXT CHECK (location_type IN ('sydney', 'australia', 'international', NULL)),
  specific_location TEXT,
  region TEXT,
  country TEXT,
  is_physical BOOLEAN DEFAULT false,
  actionability TEXT CHECK (actionability IN ('can_do_now', 'needs_planning', 'needs_saving', 'needs_milestone', NULL)),
  target_year INTEGER,
  target_timeframe TEXT CHECK (target_timeframe IN ('this_year', 'next_few_years', 'someday', 'ongoing', NULL)),
  seasonality TEXT[] DEFAULT '{}',
  season_notes TEXT,
  status TEXT DEFAULT 'idea' CHECK (status IN ('idea', 'planned', 'in_progress', 'completed')),
  completed_date DATE,
  completion_notes TEXT,
  ownership TEXT DEFAULT 'couples' CHECK (ownership IN ('couples', 'peter', 'wife')),
  added_by UUID REFERENCES auth.users ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  is_priority BOOLEAN DEFAULT false,
  related_item_ids UUID[] DEFAULT '{}',
  -- Archive fields
  archived BOOLEAN DEFAULT false,
  archived_at TIMESTAMP WITH TIME ZONE,
  -- Gastronomy Module fields
  gastronomy_type TEXT CHECK (gastronomy_type IN ('restaurant', 'dish', NULL)),
  cuisine TEXT,
  neighborhood TEXT,
  price_level TEXT CHECK (price_level IN ('$', '$$', '$$$', '$$$$', NULL)),
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'complex', NULL)),
  notes TEXT
);

-- Enable Row Level Security on bucket_list_items
ALTER TABLE bucket_list_items ENABLE ROW LEVEL SECURITY;

-- Bucket List Items Policies: All authenticated users can do everything (shared between couple)
CREATE POLICY "Authenticated users can view all bucket list items"
  ON bucket_list_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert bucket list items"
  ON bucket_list_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update bucket list items"
  ON bucket_list_items FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete bucket list items"
  ON bucket_list_items FOR DELETE
  TO authenticated
  USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::TEXT, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for bucket_list_items updated_at
CREATE TRIGGER update_bucket_list_items_updated_at
  BEFORE UPDATE ON bucket_list_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user creation (creates profile automatically)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    SPLIT_PART(NEW.email, '@', 1)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Year Notes Table (for Yearly Manifesto feature)
CREATE TABLE IF NOT EXISTS year_notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  year INTEGER NOT NULL,
  content TEXT DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  -- Ensure one note per user per year
  UNIQUE(user_id, year)
);

-- Enable Row Level Security on year_notes
ALTER TABLE year_notes ENABLE ROW LEVEL SECURITY;

-- Year Notes Policies: Users can only access their own notes
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

-- Trigger for year_notes updated_at
CREATE TRIGGER update_year_notes_updated_at
  BEFORE UPDATE ON year_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Migration: Add archive fields to existing bucket_list_items table
-- Safe to re-run: uses IF NOT EXISTS / column existence checks
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bucket_list_items' AND column_name = 'archived'
  ) THEN
    ALTER TABLE bucket_list_items ADD COLUMN archived BOOLEAN DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bucket_list_items' AND column_name = 'archived_at'
  ) THEN
    ALTER TABLE bucket_list_items ADD COLUMN archived_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

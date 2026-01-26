-- Performance Indexes for Horizon App
-- Run this in Supabase SQL Editor to optimize query performance

-- =====================================================
-- BUCKET LIST ITEMS INDEXES
-- =====================================================

-- Index for filtering by status (idea, planned, in_progress, completed)
-- Used in: All views, "In Progress" and "Completed" tabs
CREATE INDEX IF NOT EXISTS idx_bucket_list_items_status
ON bucket_list_items(status);

-- Index for filtering by target_year
-- Used in: Year view, 2026 filtering
CREATE INDEX IF NOT EXISTS idx_bucket_list_items_target_year
ON bucket_list_items(target_year);

-- Index for filtering by location_type (sydney, australia, international)
-- Used in: Travel view, location filtering
CREATE INDEX IF NOT EXISTS idx_bucket_list_items_location_type
ON bucket_list_items(location_type);

-- Index for filtering by ownership (couples, peter, wife)
-- Used in: Ownership view
CREATE INDEX IF NOT EXISTS idx_bucket_list_items_ownership
ON bucket_list_items(ownership);

-- Index for filtering by is_priority (favorites)
-- Used in: All views with favorites filtering
CREATE INDEX IF NOT EXISTS idx_bucket_list_items_is_priority
ON bucket_list_items(is_priority) WHERE is_priority = true;

-- Index for gastronomy_type (restaurant, dish)
-- Used in: Restaurants and Kitchen views
CREATE INDEX IF NOT EXISTS idx_bucket_list_items_gastronomy_type
ON bucket_list_items(gastronomy_type);

-- Index for region (travel regions)
-- Used in: Travel view region filtering
CREATE INDEX IF NOT EXISTS idx_bucket_list_items_region
ON bucket_list_items(region);

-- Index for neighborhood (restaurants)
-- Used in: Restaurants view grouping
CREATE INDEX IF NOT EXISTS idx_bucket_list_items_neighborhood
ON bucket_list_items(neighborhood);

-- Index for cuisine (restaurants and kitchen)
-- Used in: Restaurants and Kitchen views
CREATE INDEX IF NOT EXISTS idx_bucket_list_items_cuisine
ON bucket_list_items(cuisine);

-- Composite index for common filter combinations
-- Status + Year (very common: "What's planned for 2026?")
CREATE INDEX IF NOT EXISTS idx_bucket_list_items_status_year
ON bucket_list_items(status, target_year);

-- Location type + Status (Travel view filtering)
CREATE INDEX IF NOT EXISTS idx_bucket_list_items_location_status
ON bucket_list_items(location_type, status);

-- Gastronomy type + Status (Restaurant/Kitchen views)
CREATE INDEX IF NOT EXISTS idx_bucket_list_items_gastronomy_status
ON bucket_list_items(gastronomy_type, status);

-- GIN index for categories array (for @> contains queries)
-- Used in: Category filtering, Life view
CREATE INDEX IF NOT EXISTS idx_bucket_list_items_categories_gin
ON bucket_list_items USING GIN(categories);

-- Index for created_at (default sort order)
CREATE INDEX IF NOT EXISTS idx_bucket_list_items_created_at
ON bucket_list_items(created_at DESC);

-- Index for updated_at (recent activity)
CREATE INDEX IF NOT EXISTS idx_bucket_list_items_updated_at
ON bucket_list_items(updated_at DESC);

-- =====================================================
-- YEAR NOTES INDEXES
-- =====================================================

-- Primary lookup: user_id + year (already has UNIQUE constraint which creates index)
-- But let's ensure fast lookups by user
CREATE INDEX IF NOT EXISTS idx_year_notes_user_id
ON year_notes(user_id);

-- =====================================================
-- PROFILES INDEXES
-- =====================================================

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email
ON profiles(email);

-- =====================================================
-- ANALYZE TABLES (update query planner statistics)
-- =====================================================

ANALYZE bucket_list_items;
ANALYZE year_notes;
ANALYZE profiles;

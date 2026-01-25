/**
 * Local Bucket List Data - Fallback when Supabase is unavailable
 *
 * This file contains a snapshot of your bucket list data.
 * It serves as a backup when:
 * - NEXT_PUBLIC_USE_SUPABASE is not set to "true"
 * - Supabase connection fails
 *
 * IMPORTANT: This file is NOT deleted during migration.
 * Keep it as a safety net until you're 100% confident in Supabase.
 *
 * To update this file with fresh data from Supabase, run:
 *   npx tsx scripts/export-local-data.ts
 */

import { BucketListItem } from '@/types/database';

// Type for the local data (same as BucketListItem but with required fields)
type LocalBucketListItem = Omit<BucketListItem, 'id' | 'created_at' | 'updated_at' | 'added_by'> & {
  id: string;
  created_at: string;
  updated_at: string;
};

/**
 * Local bucket list data
 * This is a snapshot of your data that can be used as a fallback
 */
export const localBucketListData: BucketListItem[] = [
  // ============================================================================
  // COMPLETED ITEMS
  // ============================================================================
  {
    id: 'local-1',
    title: 'Vietnam',
    description: null,
    categories: ['travel'],
    location_type: 'international',
    specific_location: 'Vietnam',
    region: 'Asia',
    country: null,
    is_physical: false,
    actionability: null,
    target_year: null,
    target_timeframe: 'someday',
    seasonality: [],
    season_notes: null,
    status: 'completed',
    completed_date: null,
    completion_notes: null,
    ownership: 'couples',
    added_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_priority: false,
    related_item_ids: [],
  },
  {
    id: 'local-2',
    title: 'Italy',
    description: null,
    categories: ['travel'],
    location_type: 'international',
    specific_location: 'Italy',
    region: 'Europe',
    country: null,
    is_physical: false,
    actionability: null,
    target_year: null,
    target_timeframe: 'someday',
    seasonality: [],
    season_notes: null,
    status: 'completed',
    completed_date: null,
    completion_notes: null,
    ownership: 'couples',
    added_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_priority: false,
    related_item_ids: [],
  },
  {
    id: 'local-3',
    title: 'Portugal',
    description: null,
    categories: ['travel'],
    location_type: 'international',
    specific_location: 'Portugal',
    region: 'Europe',
    country: null,
    is_physical: false,
    actionability: null,
    target_year: null,
    target_timeframe: 'someday',
    seasonality: [],
    season_notes: null,
    status: 'completed',
    completed_date: null,
    completion_notes: null,
    ownership: 'couples',
    added_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_priority: false,
    related_item_ids: [],
  },
  {
    id: 'local-4',
    title: 'Paris',
    description: null,
    categories: ['travel'],
    location_type: 'international',
    specific_location: 'Paris, France',
    region: 'Europe',
    country: null,
    is_physical: false,
    actionability: null,
    target_year: null,
    target_timeframe: 'someday',
    seasonality: [],
    season_notes: null,
    status: 'completed',
    completed_date: null,
    completion_notes: null,
    ownership: 'couples',
    added_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_priority: false,
    related_item_ids: [],
  },
  {
    id: 'local-5',
    title: 'Tomorrowland',
    description: null,
    categories: ['music_party', 'travel'],
    location_type: 'international',
    specific_location: 'Belgium',
    region: 'Europe',
    country: null,
    is_physical: false,
    actionability: null,
    target_year: null,
    target_timeframe: 'someday',
    seasonality: [],
    season_notes: null,
    status: 'completed',
    completed_date: null,
    completion_notes: null,
    ownership: 'couples',
    added_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_priority: false,
    related_item_ids: [],
  },
  // ============================================================================
  // PRIORITY ITEMS
  // ============================================================================
  {
    id: 'local-6',
    title: 'Inca Trail + Machu Picchu',
    description: null,
    categories: ['travel', 'adventure'],
    location_type: 'international',
    specific_location: 'Peru',
    region: 'Americas',
    country: null,
    is_physical: true,
    actionability: 'needs_planning',
    target_year: null,
    target_timeframe: 'next_few_years',
    seasonality: [],
    season_notes: 'May-January open, book 6 months in advance',
    status: 'idea',
    completed_date: null,
    completion_notes: null,
    ownership: 'couples',
    added_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_priority: true,
    related_item_ids: [],
  },
  {
    id: 'local-7',
    title: 'Northern Lights',
    description: null,
    categories: ['travel', 'adventure'],
    location_type: 'international',
    specific_location: 'Iceland or Nordics',
    region: 'Europe',
    country: null,
    is_physical: false,
    actionability: 'needs_planning',
    target_year: null,
    target_timeframe: 'someday',
    seasonality: ['winter'],
    season_notes: 'Best September-March',
    status: 'idea',
    completed_date: null,
    completion_notes: null,
    ownership: 'couples',
    added_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_priority: true,
    related_item_ids: [],
  },
  {
    id: 'local-8',
    title: 'Burning Man',
    description: null,
    categories: ['cultural_events', 'music_party', 'adventure'],
    location_type: 'international',
    specific_location: 'Nevada, USA',
    region: 'Americas',
    country: null,
    is_physical: false,
    actionability: 'needs_planning',
    target_year: null,
    target_timeframe: 'someday',
    seasonality: [],
    season_notes: 'Late August/early September',
    status: 'idea',
    completed_date: null,
    completion_notes: null,
    ownership: 'couples',
    added_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_priority: true,
    related_item_ids: [],
  },
  // ============================================================================
  // TRAVEL ITEMS
  // ============================================================================
  {
    id: 'local-9',
    title: 'Lake Como',
    description: null,
    categories: ['travel'],
    location_type: 'international',
    specific_location: 'Lake Como, Italy',
    region: 'Europe',
    country: null,
    is_physical: false,
    actionability: 'needs_planning',
    target_year: null,
    target_timeframe: 'someday',
    seasonality: [],
    season_notes: null,
    status: 'idea',
    completed_date: null,
    completion_notes: null,
    ownership: 'couples',
    added_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_priority: false,
    related_item_ids: [],
  },
  {
    id: 'local-10',
    title: 'Swiss Alps hike',
    description: null,
    categories: ['travel', 'adventure'],
    location_type: 'international',
    specific_location: 'Swiss Alps',
    region: 'Europe',
    country: null,
    is_physical: true,
    actionability: null,
    target_year: null,
    target_timeframe: 'someday',
    seasonality: [],
    season_notes: null,
    status: 'idea',
    completed_date: null,
    completion_notes: null,
    ownership: 'couples',
    added_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_priority: false,
    related_item_ids: [],
  },
];

/**
 * Export a count of items by status for debugging
 */
export function getLocalDataStats() {
  const stats = {
    total: localBucketListData.length,
    byStatus: {} as Record<string, number>,
    byCategory: {} as Record<string, number>,
    priority: 0,
  };

  localBucketListData.forEach(item => {
    // Count by status
    stats.byStatus[item.status] = (stats.byStatus[item.status] || 0) + 1;

    // Count by category
    item.categories.forEach(cat => {
      stats.byCategory[cat] = (stats.byCategory[cat] || 0) + 1;
    });

    // Count priority
    if (item.is_priority) stats.priority++;
  });

  return stats;
}

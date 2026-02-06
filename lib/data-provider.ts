/**
 * Data Provider - Safety Switch for Supabase Migration
 *
 * This module provides a "safety switch" that allows you to:
 * - Fetch data from Supabase when NEXT_PUBLIC_USE_SUPABASE=true
 * - Fall back to local data when NEXT_PUBLIC_USE_SUPABASE=false (or missing)
 *
 * This ensures your app still works locally if something goes wrong with the DB.
 */

import { createClient } from '@/lib/supabase/client';
import { BucketListItem } from '@/types/database';
import { localBucketListData } from '@/lib/local-data';

// Check if we should use Supabase
export function useSupabase(): boolean {
  return process.env.NEXT_PUBLIC_USE_SUPABASE === 'true';
}

// Data source indicator for debugging
export function getDataSource(): 'supabase' | 'local' {
  return useSupabase() ? 'supabase' : 'local';
}

/**
 * Fetch all bucket list items
 * Uses Supabase if enabled, otherwise falls back to local data
 */
export async function fetchBucketListItems(): Promise<{
  data: BucketListItem[];
  error: Error | null;
  source: 'supabase' | 'local';
}> {
  const source = getDataSource();

  if (source === 'supabase') {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('bucket_list_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[DataProvider] Supabase error, falling back to local:', error.message);
        // Fall back to local data on error
        return {
          data: localBucketListData,
          error: new Error(`Supabase error (using local fallback): ${error.message}`),
          source: 'local',
        };
      }

      console.log(`[DataProvider] Fetched ${data?.length || 0} items from Supabase`);
      return {
        data: data || [],
        error: null,
        source: 'supabase',
      };
    } catch (err) {
      console.error('[DataProvider] Exception fetching from Supabase:', err);
      // Fall back to local data on exception
      return {
        data: localBucketListData,
        error: err instanceof Error ? err : new Error('Unknown error'),
        source: 'local',
      };
    }
  }

  // Use local data
  console.log(`[DataProvider] Using local data (${localBucketListData.length} items)`);
  return {
    data: localBucketListData,
    error: null,
    source: 'local',
  };
}

/**
 * Create a new bucket list item
 * Only works when Supabase is enabled
 */
export async function createBucketListItem(
  item: Omit<BucketListItem, 'id' | 'created_at' | 'updated_at'>
): Promise<{
  data: BucketListItem | null;
  error: Error | null;
}> {
  if (!useSupabase()) {
    return {
      data: null,
      error: new Error('Cannot create items in local mode. Enable Supabase first.'),
    };
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('bucket_list_items')
    .insert([item])
    .select()
    .single();

  return {
    data: data || null,
    error: error ? new Error(error.message) : null,
  };
}

/**
 * Update a bucket list item
 * Only works when Supabase is enabled
 */
export async function updateBucketListItem(
  id: string,
  updates: Partial<BucketListItem>
): Promise<{
  data: BucketListItem | null;
  error: Error | null;
}> {
  if (!useSupabase()) {
    return {
      data: null,
      error: new Error('Cannot update items in local mode. Enable Supabase first.'),
    };
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('bucket_list_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  return {
    data: data || null,
    error: error ? new Error(error.message) : null,
  };
}

/**
 * Archive a bucket list item (soft delete)
 * Sets archived=true and archived_at=now
 */
export async function archiveBucketListItem(id: string): Promise<{
  success: boolean;
  error: Error | null;
}> {
  if (!useSupabase()) {
    return {
      success: false,
      error: new Error('Cannot archive items in local mode. Enable Supabase first.'),
    };
  }

  const supabase = createClient();
  const { error } = await supabase
    .from('bucket_list_items')
    .update({ archived: true, archived_at: new Date().toISOString() })
    .eq('id', id);

  return {
    success: !error,
    error: error ? new Error(error.message) : null,
  };
}

/**
 * Restore an archived bucket list item
 * Sets archived=false and archived_at=null
 */
export async function restoreBucketListItem(id: string): Promise<{
  success: boolean;
  error: Error | null;
}> {
  if (!useSupabase()) {
    return {
      success: false,
      error: new Error('Cannot restore items in local mode. Enable Supabase first.'),
    };
  }

  const supabase = createClient();
  const { error } = await supabase
    .from('bucket_list_items')
    .update({ archived: false, archived_at: null })
    .eq('id', id);

  return {
    success: !error,
    error: error ? new Error(error.message) : null,
  };
}

/**
 * Permanently delete a bucket list item (hard delete)
 * Only intended for use from the Archive section
 */
export async function deleteBucketListItem(id: string): Promise<{
  success: boolean;
  error: Error | null;
}> {
  if (!useSupabase()) {
    return {
      success: false,
      error: new Error('Cannot delete items in local mode. Enable Supabase first.'),
    };
  }

  const supabase = createClient();
  const { error } = await supabase
    .from('bucket_list_items')
    .delete()
    .eq('id', id);

  return {
    success: !error,
    error: error ? new Error(error.message) : null,
  };
}

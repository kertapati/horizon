'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { BucketListItem, Category, Status, LocationType, Ownership } from '@/types/database';
import Link from 'next/link';

type ViewMode = 'all' | 'category' | 'location' | 'timeframe' | 'ownership';

export function BucketList() {
  const [items, setItems] = useState<BucketListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('all');

  // Filters
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<Status | ''>('');
  const [selectedLocationType, setSelectedLocationType] = useState<LocationType | ''>('');
  const [selectedOwnership, setSelectedOwnership] = useState<Ownership | ''>('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const supabase = createClient();

    // Check authentication first
    const { data: { session } } = await supabase.auth.getSession();
    console.log('BucketList - Session:', session ? 'authenticated' : 'not authenticated');

    const { data, error } = await supabase
      .from('bucket_list_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching items:', error);
    } else {
      console.log('BucketList - Fetched items:', data?.length || 0);
      setItems(data || []);
    }
    setLoading(false);
  };

  const filteredItems = items.filter((item) => {
    if (selectedCategories.length > 0) {
      const hasCategory = selectedCategories.some((cat) => item.categories.includes(cat));
      if (!hasCategory) return false;
    }
    if (selectedStatus && item.status !== selectedStatus) return false;
    if (selectedLocationType && item.location_type !== selectedLocationType) return false;
    if (selectedOwnership && item.ownership !== selectedOwnership) return false;
    return true;
  });

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'idea':
        return 'bg-gray-100 text-gray-700';
      case 'planned':
        return 'bg-blue-100 text-blue-700';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading your horizon...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* View Mode Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-gray-200 pb-2">
        {(['all', 'category', 'location', 'timeframe', 'ownership'] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
              viewMode === mode
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as Status | '')}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">All statuses</option>
          <option value="idea">Idea</option>
          <option value="planned">Planned</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={selectedLocationType}
          onChange={(e) => setSelectedLocationType(e.target.value as LocationType | '')}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">All locations</option>
          <option value="sydney">Sydney</option>
          <option value="australia">Australia</option>
          <option value="international">International</option>
        </select>

        <select
          value={selectedOwnership}
          onChange={(e) => setSelectedOwnership(e.target.value as Ownership | '')}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">All ownership</option>
          <option value="couples">Couples</option>
          <option value="peter">Peter</option>
          <option value="wife">Wife</option>
        </select>

        {(selectedStatus || selectedLocationType || selectedOwnership) && (
          <button
            onClick={() => {
              setSelectedStatus('');
              setSelectedLocationType('');
              setSelectedOwnership('');
              setSelectedCategories([]);
            }}
            className="text-sm text-indigo-600 hover:text-indigo-700"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Items Count */}
      <div className="text-sm text-gray-600">
        {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
      </div>

      {/* Items List */}
      {filteredItems.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500">
            {items.length === 0
              ? 'No items yet. Start building your horizon!'
              : 'No items match your filters.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <Link
              key={item.id}
              href={`/items/${item.id}`}
              className="group block rounded-lg border border-gray-200 bg-white p-4 transition hover:border-indigo-500 hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-gray-900 group-hover:text-indigo-600">
                    {item.title}
                  </h3>
                  {item.is_priority && (
                    <svg
                      className="h-5 w-5 flex-shrink-0 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  )}
                </div>

                {item.description && (
                  <p className="line-clamp-2 text-sm text-gray-600">{item.description}</p>
                )}

                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status.replace(/_/g, ' ')}
                  </span>

                  {item.location_type && (
                    <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                      {item.location_type}
                    </span>
                  )}

                  {item.categories.slice(0, 2).map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex rounded-full bg-indigo-50 px-2 py-1 text-xs text-indigo-700"
                    >
                      {cat.replace(/_/g, ' ')}
                    </span>
                  ))}
                  {item.categories.length > 2 && (
                    <span className="inline-flex rounded-full bg-indigo-50 px-2 py-1 text-xs text-indigo-700">
                      +{item.categories.length - 2}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{item.ownership}</span>
                  {item.target_timeframe && (
                    <span>{item.target_timeframe.replace(/_/g, ' ')}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

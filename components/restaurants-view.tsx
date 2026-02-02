'use client';

import { useState, useCallback, useRef } from 'react';
import { BucketListItem } from '@/types/database';
import { createClient } from '@/lib/supabase/client';

interface RestaurantsViewProps {
  items: BucketListItem[];
  onItemUpdate?: (item: BucketListItem) => void;
  onRefresh?: () => void;
  onItemClick?: (item: BucketListItem) => void;
}

export interface RestaurantData {
  title: string;
  cuisine: string | null;
  neighborhood: string | null;
  price_level: '$' | '$$' | '$$$' | '$$$$' | null;
  notes: string | null;
}

// Sydney region groupings
const regionConfig: Record<string, { name: string; neighborhoods: string[] }> = {
  city: {
    name: 'City',
    neighborhoods: ['cbd', 'city', 'haymarket', 'chinatown', 'the rocks', 'circular quay', 'wynyard', 'barangaroo', 'martin place', 'town hall', 'central', 'ultimo', 'pyrmont', 'darling harbour', 'millers point', 'dawes point'],
  },
  inner_west: {
    name: 'Inner West',
    neighborhoods: ['newtown', 'enmore', 'marrickville', 'erskineville', 'stanmore', 'leichhardt', 'glebe', 'annandale', 'balmain', 'rozelle', 'lilyfield', 'haberfield', 'summer hill', 'ashfield', 'croydon', 'dulwich hill', 'lewisham', 'petersham', 'camperdown', 'forest lodge', 'tempe', 'sydenham', 'st peters'],
  },
  eastern: {
    name: 'Eastern Suburbs',
    neighborhoods: ['surry hills', 'darlinghurst', 'paddington', 'woollahra', 'double bay', 'bondi', 'bondi junction', 'bondi beach', 'bronte', 'clovelly', 'coogee', 'randwick', 'kensington', 'kingsford', 'maroubra', 'potts point', 'elizabeth bay', 'rushcutters bay', 'kings cross', 'woolloomooloo', 'redfern', 'waterloo', 'zetland', 'rosebery', 'mascot', 'eastgardens', 'moore park', 'centennial park'],
  },
  north_shore: {
    name: 'North Shore',
    neighborhoods: ['north sydney', 'kirribilli', 'milsons point', 'neutral bay', 'cremorne', 'mosman', 'crows nest', 'st leonards', 'wollstonecraft', 'waverton', 'lavender bay', 'mcmahons point', 'chatswood', 'artarmon', 'willoughby', 'lane cove', 'hunters hill', 'gladesville'],
  },
  northern: {
    name: 'Northern Suburbs',
    neighborhoods: ['manly', 'dee why', 'brookvale', 'freshwater', 'curl curl', 'narrabeen', 'mona vale', 'newport', 'avalon', 'palm beach', 'northern beaches', 'hornsby', 'gordon', 'pymble', 'turramurra', 'wahroonga', 'killara', 'lindfield', 'roseville', 'castle hill', 'parramatta', 'epping', 'eastwood', 'ryde', 'macquarie park'],
  },
  south: {
    name: 'South',
    neighborhoods: ['hurstville', 'kogarah', 'rockdale', 'sans souci', 'brighton-le-sands', 'cronulla', 'miranda', 'sutherland', 'caringbah', 'gymea', 'engadine', 'kirrawee', 'oatley', 'mortdale', 'penshurst', 'riverwood', 'bankstown'],
  },
  west: {
    name: 'West',
    neighborhoods: ['strathfield', 'burwood', 'homebush', 'rhodes', 'concord', 'five dock', 'drummoyne', 'canada bay', 'olympic park', 'lidcombe', 'auburn', 'granville', 'merrylands', 'fairfield', 'cabramatta', 'liverpool', 'campbelltown', 'penrith', 'blacktown', 'parramatta'],
  },
};

// Get region for a restaurant based on neighborhood
function getRegionForRestaurant(item: BucketListItem): string {
  const neighborhood = (item.neighborhood || item.notes || '').toLowerCase();

  for (const [regionKey, config] of Object.entries(regionConfig)) {
    if (config.neighborhoods.some(n => neighborhood.includes(n))) {
      return regionKey;
    }
  }

  return 'other';
}

type SortMode = 'alphabetical' | 'recent';

export function RestaurantsView({ items, onItemUpdate, onRefresh, onItemClick }: RestaurantsViewProps) {
  const [showCompleted, setShowCompleted] = useState(false);
  const [quickInput, setQuickInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [optimisticItems, setOptimisticItems] = useState<Record<string, Partial<BucketListItem>>>({});
  const [sortMode, setSortMode] = useState<SortMode>('alphabetical');
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter for restaurants (Food & Drink with gastronomy_type = 'restaurant' or null)
  const restaurantItems = items.filter(item =>
    item.categories.includes('food_drink') &&
    (item.gastronomy_type === 'restaurant' || item.gastronomy_type === null)
  );

  // Split by completion status
  const toVisitItems = restaurantItems.filter(item => {
    const optimistic = optimisticItems[item.id];
    const status = optimistic?.status ?? item.status;
    return status !== 'completed';
  });

  const completedItems = restaurantItems.filter(item => {
    const optimistic = optimisticItems[item.id];
    const status = optimistic?.status ?? item.status;
    return status === 'completed';
  });

  const displayedItems = showCompleted ? completedItems : toVisitItems;

  // Group items by region
  const groupedByRegion = displayedItems.reduce((acc, item) => {
    const region = getRegionForRestaurant(item);
    if (!acc[region]) {
      acc[region] = [];
    }
    acc[region].push(item);
    return acc;
  }, {} as Record<string, BucketListItem[]>);

  // Sort items within each group based on sort mode
  Object.values(groupedByRegion).forEach(items => {
    if (sortMode === 'recent') {
      // Sort by created_at descending (newest first)
      items.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      });
    } else {
      // Sort alphabetically
      items.sort((a, b) => a.title.localeCompare(b.title));
    }
  });

  // Get ordered regions (by count, descending)
  const orderedRegions = Object.entries(groupedByRegion)
    .sort((a, b) => b[1].length - a[1].length)
    .map(([region]) => region);

  // Separate favorites
  const favoriteItems = displayedItems.filter(item => {
    const optimistic = optimisticItems[item.id];
    return optimistic?.is_priority ?? item.is_priority;
  });

  // Quick add handler - just press Enter to save
  const handleQuickAdd = async () => {
    const title = quickInput.trim();
    if (!title || isAdding) return;

    setIsAdding(true);
    setQuickInput('');

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        console.error('No authenticated user');
        setIsAdding(false);
        return;
      }

      const { error } = await supabase
        .from('bucket_list_items')
        .insert({
          title,
          categories: ['food_drink'],
          status: 'idea',
          location_type: 'sydney',
          ownership: 'couples',
          added_by: user.id,
          is_physical: true,
          is_priority: false,
          gastronomy_type: 'restaurant',
        });

      if (error) {
        console.error('Error adding restaurant:', error);
      } else {
        onRefresh?.();
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsAdding(false);
      inputRef.current?.focus();
    }
  };

  // Toggle completion status
  const handleToggleComplete = useCallback(async (item: BucketListItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentStatus = optimisticItems[item.id]?.status ?? item.status;
    const newStatus = currentStatus === 'completed' ? 'idea' : 'completed';

    // Optimistic update
    setOptimisticItems(prev => ({
      ...prev,
      [item.id]: { ...prev[item.id], status: newStatus }
    }));

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('bucket_list_items')
        .update({
          status: newStatus,
          completed_date: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : null
        })
        .eq('id', item.id);

      if (error) {
        console.error('Error updating status:', error);
        // Revert
        setOptimisticItems(prev => ({
          ...prev,
          [item.id]: { ...prev[item.id], status: currentStatus }
        }));
      } else if (onItemUpdate) {
        onItemUpdate({ ...item, status: newStatus });
      }
    } catch (err) {
      console.error('Error:', err);
      setOptimisticItems(prev => ({
        ...prev,
        [item.id]: { ...prev[item.id], status: currentStatus }
      }));
    }
  }, [optimisticItems, onItemUpdate]);

  // Toggle favorite
  const handleToggleFavorite = useCallback(async (item: BucketListItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentFavorite = optimisticItems[item.id]?.is_priority ?? item.is_priority;
    const newFavorite = !currentFavorite;

    setOptimisticItems(prev => ({
      ...prev,
      [item.id]: { ...prev[item.id], is_priority: newFavorite }
    }));

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('bucket_list_items')
        .update({ is_priority: newFavorite })
        .eq('id', item.id);

      if (error) {
        console.error('Error updating favorite:', error);
        setOptimisticItems(prev => ({
          ...prev,
          [item.id]: { ...prev[item.id], is_priority: currentFavorite }
        }));
      } else if (onItemUpdate) {
        onItemUpdate({ ...item, is_priority: newFavorite });
      }
    } catch (err) {
      console.error('Error:', err);
      setOptimisticItems(prev => ({
        ...prev,
        [item.id]: { ...prev[item.id], is_priority: currentFavorite }
      }));
    }
  }, [optimisticItems, onItemUpdate]);

  return (
    <div className="h-full flex flex-col">
      {/* Quick Capture Bar */}
      <div className="p-4 border-b" style={{ borderColor: 'rgba(139, 123, 114, 0.15)', background: 'var(--paper-cream)' }}>
        <div className="max-w-5xl mx-auto">
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
            style={{
              background: 'white',
              border: '2px solid rgba(139, 123, 114, 0.2)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <span className="text-xl">🍽️</span>
            <input
              ref={inputRef}
              type="text"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd()}
              placeholder="Add a spot to try..."
              disabled={isAdding}
              className="flex-1 bg-transparent outline-none text-base"
              style={{ color: 'var(--charcoal-brown)' }}
            />
            {quickInput && (
              <span className="text-xs px-2 py-1 rounded-md" style={{ background: 'rgba(139, 123, 114, 0.1)', color: 'var(--text-muted)' }}>
                ↵ Enter
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Toggle: To Visit / Been There + Sort */}
      <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(139, 123, 114, 0.1)' }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div
            className="inline-flex rounded-full p-0.5"
            style={{ background: 'rgba(139, 123, 114, 0.1)' }}
          >
            <button
              onClick={() => setShowCompleted(false)}
              className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
              style={{
                background: !showCompleted ? 'white' : 'transparent',
                color: !showCompleted ? 'var(--charcoal-brown)' : 'var(--text-muted)',
                boxShadow: !showCompleted ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              To Visit ({toVisitItems.length})
            </button>
            <button
              onClick={() => setShowCompleted(true)}
              className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
              style={{
                background: showCompleted ? 'white' : 'transparent',
                color: showCompleted ? 'var(--charcoal-brown)' : 'var(--text-muted)',
                boxShadow: showCompleted ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              ✓ Been There ({completedItems.length})
            </button>
          </div>
          <div className="flex items-center gap-3">
            {/* Sort Toggle */}
            <button
              onClick={() => setSortMode(sortMode === 'alphabetical' ? 'recent' : 'alphabetical')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:bg-stone-100"
              style={{
                background: 'rgba(139, 123, 114, 0.08)',
                color: 'var(--text-muted)',
              }}
              title={sortMode === 'alphabetical' ? 'Sorted A-Z' : 'Sorted by recently added'}
            >
              {sortMode === 'alphabetical' ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                  <span>A-Z</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Recent</span>
                </>
              )}
            </button>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {restaurantItems.length} total
            </span>
          </div>
        </div>
      </div>

      {/* Restaurant List - Chip Layout */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-5xl mx-auto">
          {displayedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="text-4xl mb-3">🍽️</span>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {showCompleted
                  ? "No restaurants visited yet"
                  : "No restaurants to visit. Add one above!"}
              </p>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 xl:columns-3 gap-6">
              {/* Favorites Section - if any */}
              {favoriteItems.length > 0 && (
                <div className="card-warm break-inside-avoid mb-6">
                  <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(139, 123, 114, 0.15)', background: 'rgba(253, 230, 138, 0.08)' }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">❤️</span>
                        <h3 className="font-serif font-bold" style={{ color: 'var(--charcoal-brown)' }}>Favorites</h3>
                      </div>
                      <span className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>{favoriteItems.length}</span>
                    </div>
                  </div>
                  <div className="px-4 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {favoriteItems.map(item => (
                        <RestaurantChip
                          key={item.id}
                          item={item}
                          optimistic={optimisticItems[item.id]}
                          onClick={onItemClick}
                          onToggleComplete={(e) => handleToggleComplete(item, e)}
                          onToggleFavorite={(e) => handleToggleFavorite(item, e)}
                          featured
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Region Sections */}
              {orderedRegions.map(regionKey => {
                const regionItems = groupedByRegion[regionKey];
                const config = regionConfig[regionKey];
                const regionName = config?.name || 'Other';

                // Filter out favorites from this section to avoid duplication
                const nonFavoriteItems = regionItems.filter(item => {
                  const optimistic = optimisticItems[item.id];
                  return !(optimistic?.is_priority ?? item.is_priority);
                });

                if (nonFavoriteItems.length === 0) return null;

                return (
                  <div key={regionKey} className="card-warm break-inside-avoid mb-6">
                    <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(139, 123, 114, 0.15)', background: 'rgba(253, 230, 138, 0.05)' }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">📍</span>
                          <h3 className="font-serif font-bold" style={{ color: 'var(--charcoal-brown)' }}>{regionName}</h3>
                        </div>
                        <span className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>{nonFavoriteItems.length}</span>
                      </div>
                    </div>
                    <div className="px-4 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {nonFavoriteItems.map(item => (
                          <RestaurantChip
                            key={item.id}
                            item={item}
                            optimistic={optimisticItems[item.id]}
                            onClick={onItemClick}
                            onToggleComplete={(e) => handleToggleComplete(item, e)}
                            onToggleFavorite={(e) => handleToggleFavorite(item, e)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Restaurant Chip Component - similar to Life view
function RestaurantChip({
  item,
  optimistic,
  onClick,
  onToggleComplete,
  onToggleFavorite,
  featured = false,
}: {
  item: BucketListItem;
  optimistic?: Partial<BucketListItem>;
  onClick?: (item: BucketListItem) => void;
  onToggleComplete: (e: React.MouseEvent) => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
  featured?: boolean;
}) {
  const isCompleted = (optimistic?.status ?? item.status) === 'completed';
  const isFavorite = optimistic?.is_priority ?? item.is_priority;
  const displayTitle = optimistic?.title ?? item.title;

  return (
    <button
      onClick={() => onClick?.(item)}
      className={`group relative px-2.5 py-1 rounded-full text-xs transition-all flex items-center gap-1.5 ${
        featured
          ? 'bg-red-50 hover:bg-red-100 border border-red-200'
          : isCompleted
          ? 'bg-green-50 hover:bg-green-100 border border-green-200'
          : 'bg-stone-100 hover:bg-stone-200 border border-stone-200'
      }`}
      style={{
        color: 'var(--charcoal-brown)',
      }}
    >
      {/* Quick complete on left click with shift */}
      <span
        onClick={onToggleComplete}
        className={`w-3.5 h-3.5 rounded-full border flex-shrink-0 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform ${
          isCompleted ? 'bg-green-500 border-green-500' : 'border-stone-300 hover:border-green-400'
        }`}
      >
        {isCompleted && (
          <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>

      <span className={isCompleted ? 'line-through opacity-60' : ''}>
        {displayTitle}
      </span>

      {/* Heart on hover */}
      <span
        onClick={onToggleFavorite}
        className={`cursor-pointer hover:scale-125 transition-transform ${
          isFavorite ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
        }`}
      >
        {isFavorite ? '❤️' : '🤍'}
      </span>
    </button>
  );
}

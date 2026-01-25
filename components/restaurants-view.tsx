'use client';

import { useState, useCallback } from 'react';
import { BucketListItem } from '@/types/database';
import { AddRestaurantModal } from './add-restaurant-modal';
import { createClient } from '@/lib/supabase/client';

interface RestaurantsViewProps {
  items: BucketListItem[];
  onItemClick: (item: BucketListItem) => void;
  onAddItem: (data: RestaurantData) => Promise<void>;
  onItemUpdate?: (item: BucketListItem) => void;
}

export interface RestaurantData {
  title: string;
  cuisine: string | null;
  neighborhood: string | null;
  price_level: '$' | '$$' | '$$$' | '$$$$' | null;
  notes: string | null;
}

// Sydney region configuration
const sydneyRegions: Record<string, { label: string; keywords: string[] }> = {
  'city': {
    label: 'CBD',
    keywords: ['cbd', 'city', 'sydney cbd', 'circular quay', 'wynyard', 'martin place', 'town hall', 'central', 'haymarket', 'chinatown', 'darling harbour', 'barangaroo', 'the rocks'],
  },
  'inner_west': {
    label: 'Inner West',
    keywords: ['inner west', 'newtown', 'enmore', 'marrickville', 'petersham', 'leichhardt', 'balmain', 'rozelle', 'annandale', 'glebe', 'camperdown', 'stanmore', 'dulwich hill', 'summer hill', 'ashfield', 'croydon', 'burwood'],
  },
  'eastern_suburbs': {
    label: 'East',
    keywords: ['eastern suburbs', 'bondi', 'coogee', 'bronte', 'tamarama', 'paddington', 'woollahra', 'double bay', 'rose bay', 'vaucluse', 'watsons bay', 'randwick', 'kensington', 'kingsford', 'maroubra', 'clovelly', 'surry hills', 'darlinghurst', 'potts point', 'kings cross', 'elizabeth bay', 'rushcutters bay', 'edgecliff', 'bellevue hill'],
  },
  'north_shore': {
    label: 'North Shore',
    keywords: ['north shore', 'north sydney', 'neutral bay', 'cremorne', 'mosman', 'chatswood', 'lane cove', 'artarmon', 'st leonards', 'crows nest', 'willoughby', 'castle cove', 'northbridge', 'cammeray', 'waverton', 'wollstonecraft', 'milsons point', 'kirribilli', 'lavender bay'],
  },
  'northern_suburbs': {
    label: 'North',
    keywords: ['northern suburbs', 'epping', 'eastwood', 'macquarie park', 'ryde', 'gladesville', 'hunters hill', 'top ryde', 'marsfield', 'north ryde', 'carlingford', 'beecroft', 'cheltenham', 'pennant hills', 'thornleigh', 'normanhurst', 'wahroonga', 'turramurra', 'pymble', 'gordon', 'killara', 'lindfield', 'roseville', 'hornsby'],
  },
  'northern_beaches': {
    label: 'Beaches',
    keywords: ['northern beaches', 'manly', 'dee why', 'brookvale', 'freshwater', 'curl curl', 'narrabeen', 'mona vale', 'newport', 'avalon', 'palm beach', 'warriewood', 'collaroy', 'cromer', 'beacon hill', 'frenchs forest', 'forestville'],
  },
  'south': {
    label: 'South',
    keywords: ['south', 'st george', 'hurstville', 'kogarah', 'rockdale', 'arncliffe', 'banksia', 'bexley', 'carlton', 'allawah', 'penshurst', 'mortdale', 'oatley', 'sans souci', 'brighton le sands', 'ramsgate', 'monterey'],
  },
  'south_west': {
    label: 'SW',
    keywords: ['south west', 'bankstown', 'canterbury', 'campsie', 'lakemba', 'punchbowl', 'belmore', 'strathfield', 'homebush', 'auburn', 'lidcombe', 'berala', 'regents park', 'yagoona', 'bass hill', 'chester hill', 'villawood', 'cabramatta', 'fairfield', 'liverpool'],
  },
  'west': {
    label: 'West',
    keywords: ['west', 'parramatta', 'westmead', 'harris park', 'granville', 'merrylands', 'guildford', 'chester hill', 'blacktown', 'seven hills', 'baulkham hills', 'castle hill', 'bella vista', 'kellyville', 'rouse hill', 'the hills'],
  },
  'other': {
    label: 'Other',
    keywords: [],
  },
};

// Cuisine color configuration for badges
const cuisineColors: Record<string, { bg: string; text: string }> = {
  'Japanese': { bg: 'rgba(239, 68, 68, 0.15)', text: '#B91C1C' },
  'Italian': { bg: 'rgba(34, 197, 94, 0.15)', text: '#15803D' },
  'Chinese': { bg: 'rgba(234, 179, 8, 0.15)', text: '#A16207' },
  'Thai': { bg: 'rgba(168, 85, 247, 0.15)', text: '#7C3AED' },
  'French': { bg: 'rgba(59, 130, 246, 0.15)', text: '#1D4ED8' },
  'Korean': { bg: 'rgba(236, 72, 153, 0.15)', text: '#BE185D' },
  'Vietnamese': { bg: 'rgba(34, 197, 94, 0.15)', text: '#15803D' },
  'Indian': { bg: 'rgba(249, 115, 22, 0.15)', text: '#C2410C' },
  'Mexican': { bg: 'rgba(239, 68, 68, 0.15)', text: '#B91C1C' },
  'Mediterranean': { bg: 'rgba(59, 130, 246, 0.15)', text: '#1D4ED8' },
  'Greek': { bg: 'rgba(59, 130, 246, 0.15)', text: '#1D4ED8' },
  'Spanish': { bg: 'rgba(249, 115, 22, 0.15)', text: '#C2410C' },
  'Middle Eastern': { bg: 'rgba(168, 85, 247, 0.15)', text: '#7C3AED' },
  'American': { bg: 'rgba(239, 68, 68, 0.15)', text: '#B91C1C' },
  'Australian Modern': { bg: 'rgba(34, 197, 94, 0.15)', text: '#15803D' },
  'Fusion': { bg: 'rgba(168, 85, 247, 0.15)', text: '#7C3AED' },
  'Seafood': { bg: 'rgba(59, 130, 246, 0.15)', text: '#1D4ED8' },
  'Steakhouse': { bg: 'rgba(139, 69, 19, 0.2)', text: '#8B4513' },
  'Vegetarian': { bg: 'rgba(34, 197, 94, 0.15)', text: '#15803D' },
  'Bakery': { bg: 'rgba(234, 179, 8, 0.15)', text: '#A16207' },
  'Cafe': { bg: 'rgba(139, 92, 42, 0.15)', text: '#78350F' },
  'Dessert': { bg: 'rgba(236, 72, 153, 0.15)', text: '#BE185D' },
  'Other': { bg: 'rgba(107, 114, 128, 0.15)', text: '#374151' },
};

function getCuisineColor(cuisine: string | null): { bg: string; text: string } {
  if (!cuisine) return cuisineColors['Other'];
  return cuisineColors[cuisine] || cuisineColors['Other'];
}

function getRegionForItem(item: BucketListItem): string {
  // First check if region is already set
  if (item.region && sydneyRegions[item.region]) {
    return item.region;
  }

  const neighborhood = (item.neighborhood || item.specific_location || '').toLowerCase();

  for (const [regionKey, regionConfig] of Object.entries(sydneyRegions)) {
    if (regionKey === 'other') continue;
    if (regionConfig.keywords.some(keyword => neighborhood.includes(keyword))) {
      return regionKey;
    }
  }

  return 'other';
}

function getRegionLabel(regionKey: string): string {
  return sydneyRegions[regionKey]?.label || 'Other';
}

export function RestaurantsView({ items, onItemClick, onAddItem, onItemUpdate }: RestaurantsViewProps) {
  const [showFavorites, setShowFavorites] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [optimisticUpdates, setOptimisticUpdates] = useState<Record<string, boolean>>({});

  // Filter for restaurants (Food & Drink category with gastronomy_type = 'restaurant' or null for legacy)
  const restaurantItems = items.filter(item =>
    item.categories.includes('food_drink') &&
    (item.gastronomy_type === 'restaurant' || item.gastronomy_type === null)
  );

  // Filter by toggle: favorites = is_priority, to visit = not priority
  const displayedItems = showFavorites
    ? restaurantItems.filter(item => {
        const isFavorite = optimisticUpdates[item.id] ?? item.is_priority;
        return isFavorite;
      })
    : restaurantItems.filter(item => item.status !== 'completed');

  // Sort alphabetically by title for a clean masonry flow
  const sortedItems = [...displayedItems].sort((a, b) => a.title.localeCompare(b.title));

  const handleAddRestaurant = async (data: RestaurantData) => {
    await onAddItem(data);
    setShowAddModal(false);
  };

  const handleToggleFavorite = useCallback(async (item: BucketListItem, e: React.MouseEvent) => {
    e.stopPropagation();

    const currentFavorite = optimisticUpdates[item.id] ?? item.is_priority;
    const newFavorite = !currentFavorite;

    // Optimistic update
    setOptimisticUpdates(prev => ({ ...prev, [item.id]: newFavorite }));

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('bucket_list_items')
        .update({ is_priority: newFavorite })
        .eq('id', item.id);

      if (error) {
        console.error('Error updating favorite:', error);
        // Revert optimistic update
        setOptimisticUpdates(prev => ({ ...prev, [item.id]: currentFavorite }));
      } else if (onItemUpdate) {
        onItemUpdate({ ...item, is_priority: newFavorite });
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setOptimisticUpdates(prev => ({ ...prev, [item.id]: currentFavorite }));
    }
  }, [optimisticUpdates, onItemUpdate]);

  return (
    <div className="space-y-4">
      {/* Header with Toggle and Add Button */}
      <div className="flex items-center justify-between">
        {/* Toggle Pills */}
        <div
          className="inline-flex rounded-full p-0.5"
          style={{
            background: 'rgba(139, 123, 114, 0.1)',
          }}
        >
          <button
            onClick={() => setShowFavorites(false)}
            className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
            style={{
              background: !showFavorites ? 'var(--paper-cream)' : 'transparent',
              color: !showFavorites ? 'var(--charcoal-brown)' : 'var(--text-muted)',
              boxShadow: !showFavorites ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            To Visit
          </button>
          <button
            onClick={() => setShowFavorites(true)}
            className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
            style={{
              background: showFavorites ? 'var(--paper-cream)' : 'transparent',
              color: showFavorites ? 'var(--charcoal-brown)' : 'var(--text-muted)',
              boxShadow: showFavorites ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            ❤️ Favorites
          </button>
        </div>

        {/* Add Restaurant Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
          style={{
            background: 'linear-gradient(135deg, #D4AF37 0%, #F59E0B 100%)',
            color: 'white',
            boxShadow: '0 2px 6px rgba(212, 175, 55, 0.3)',
          }}
        >
          <span>+</span>
          <span>Add Restaurant</span>
        </button>
      </div>

      {/* Dense Masonry Grid - No Region Headers */}
      {displayedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <span className="text-3xl mb-2">🍽️</span>
          <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            {showFavorites
              ? "No favorites yet. Click the heart on any restaurant!"
              : "No restaurants to visit. Add some using the button above!"}
          </p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-3">
          {sortedItems.map(item => (
            <CompactCard
              key={item.id}
              item={item}
              isFavorite={optimisticUpdates[item.id] ?? item.is_priority}
              onClick={() => onItemClick(item)}
              onToggleFavorite={(e) => handleToggleFavorite(item, e)}
            />
          ))}
        </div>
      )}

      {/* Add Restaurant Modal */}
      <AddRestaurantModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddRestaurant}
      />
    </div>
  );
}

function CompactCard({
  item,
  isFavorite,
  onClick,
  onToggleFavorite,
}: {
  item: BucketListItem;
  isFavorite: boolean;
  onClick: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
}) {
  const cuisineColor = getCuisineColor(item.cuisine);
  const regionKey = getRegionForItem(item);
  const regionLabel = getRegionLabel(regionKey);
  const neighborhood = item.neighborhood || item.specific_location;

  return (
    <div
      className="break-inside-avoid mb-2 cursor-pointer group"
      onClick={onClick}
    >
      <div
        className="rounded-md overflow-hidden transition-all duration-150 group-hover:shadow-md relative"
        style={{
          background: '#FDFBF7',
          border: '1px solid rgba(139, 123, 114, 0.15)',
        }}
      >
        {/* Colored top stripe */}
        <div
          className="h-0.5"
          style={{ background: cuisineColor.text }}
        />

        {/* Card Content - Compact */}
        <div className="px-2 py-1.5">
          {/* Top row: Title + Heart */}
          <div className="flex items-start justify-between gap-1">
            <h3
              className="text-sm font-semibold leading-tight flex-1"
              style={{ color: 'var(--charcoal-brown)' }}
            >
              {item.title}
            </h3>

            {/* Favorite Heart Button */}
            <button
              onClick={onToggleFavorite}
              className="flex-shrink-0 p-0.5 transition-transform hover:scale-110"
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite ? (
                <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              )}
            </button>
          </div>

          {/* Meta row: Cuisine badge + Location/Region */}
          <div className="flex items-center gap-1 mt-1 flex-wrap">
            {item.cuisine && (
              <span
                className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium"
                style={{
                  background: cuisineColor.bg,
                  color: cuisineColor.text,
                }}
              >
                {item.cuisine}
              </span>
            )}
            {item.price_level && (
              <span
                className="text-[10px] font-medium"
                style={{ color: 'var(--text-muted)' }}
              >
                {item.price_level}
              </span>
            )}
          </div>

          {/* Location line: Neighborhood • Region */}
          {(neighborhood || regionKey !== 'other') && (
            <p
              className="text-[10px] mt-1 truncate"
              style={{ color: 'var(--text-muted)' }}
            >
              {neighborhood && <span>{neighborhood}</span>}
              {neighborhood && regionKey !== 'other' && <span> · </span>}
              {regionKey !== 'other' && <span>{regionLabel}</span>}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

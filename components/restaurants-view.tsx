'use client';

import { useState } from 'react';
import { BucketListItem } from '@/types/database';

interface RestaurantsViewProps {
  items: BucketListItem[];
  onItemClick: (item: BucketListItem) => void;
}

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

export function RestaurantsView({ items, onItemClick }: RestaurantsViewProps) {
  const [showFavorites, setShowFavorites] = useState(false);

  // Filter for restaurants (Food & Drink category with gastronomy_type = 'restaurant')
  const restaurantItems = items.filter(item =>
    item.categories.includes('food_drink') &&
    item.gastronomy_type === 'restaurant'
  );

  // Filter by toggle: favorites = completed (checked), to visit = not completed
  const displayedItems = showFavorites
    ? restaurantItems.filter(item => item.status === 'completed')
    : restaurantItems.filter(item => item.status !== 'completed');

  return (
    <div className="space-y-6">
      {/* Toggle Pills */}
      <div className="flex justify-center">
        <div
          className="inline-flex rounded-full p-1"
          style={{
            background: 'rgba(139, 123, 114, 0.1)',
          }}
        >
          <button
            onClick={() => setShowFavorites(false)}
            className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
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
            className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
            style={{
              background: showFavorites ? 'var(--paper-cream)' : 'transparent',
              color: showFavorites ? 'var(--charcoal-brown)' : 'var(--text-muted)',
              boxShadow: showFavorites ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            Favorites
          </button>
        </div>
      </div>

      {/* Masonry Grid of Matchbook Cards */}
      {displayedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <span className="text-4xl mb-3">🍽️</span>
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
            {showFavorites
              ? "No favorite restaurants yet. Mark restaurants as completed to add them here!"
              : "No restaurants to visit. Add some from the + button above!"}
          </p>
        </div>
      ) : (
        <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4">
          {displayedItems.map(item => (
            <MatchbookCard
              key={item.id}
              item={item}
              onClick={() => onItemClick(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MatchbookCard({
  item,
  onClick,
}: {
  item: BucketListItem;
  onClick: () => void;
}) {
  const cuisineColor = getCuisineColor(item.cuisine);

  return (
    <div
      className="break-inside-avoid mb-4 cursor-pointer group"
      onClick={onClick}
    >
      <div
        className="rounded-lg overflow-hidden transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-0.5"
        style={{
          background: '#FDF8F0', // Cream/matchbook color
          border: '1px solid rgba(139, 123, 114, 0.2)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        }}
      >
        {/* Top decorative stripe */}
        <div
          className="h-1.5"
          style={{
            background: cuisineColor.bg,
            borderBottom: `2px solid ${cuisineColor.text}`,
          }}
        />

        {/* Card Content */}
        <div className="p-3">
          {/* Restaurant Name - Serif typography */}
          <h3
            className="font-serif text-base font-bold leading-tight mb-2"
            style={{ color: 'var(--charcoal-brown)' }}
          >
            {item.title}
          </h3>

          {/* Cuisine Badge */}
          {item.cuisine && (
            <span
              className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-2"
              style={{
                background: cuisineColor.bg,
                color: cuisineColor.text,
              }}
            >
              {item.cuisine}
            </span>
          )}

          {/* Location/Neighborhood */}
          {(item.neighborhood || item.specific_location) && (
            <p
              className="text-xs mb-2 flex items-center gap-1"
              style={{ color: 'var(--text-muted)' }}
            >
              <span>📍</span>
              <span>{item.neighborhood || item.specific_location}</span>
            </p>
          )}

          {/* Price Level */}
          {item.price_level && (
            <p
              className="text-xs font-semibold"
              style={{ color: 'var(--text-secondary)' }}
            >
              {item.price_level}
            </p>
          )}

          {/* Quick Link Icon - Opens notes/details */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.9)',
              color: 'var(--charcoal-brown)',
            }}
            title="View details & notes"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
        </div>

        {/* Bottom decorative element - matchbook style */}
        <div
          className="h-4 relative overflow-hidden"
          style={{
            background: 'linear-gradient(to bottom, rgba(139, 123, 114, 0.05), rgba(139, 123, 114, 0.1))',
          }}
        >
          {/* Matchbook strike strip pattern */}
          <div
            className="absolute bottom-0 left-2 right-2 h-1.5 rounded-t"
            style={{
              background: `repeating-linear-gradient(
                90deg,
                ${cuisineColor.text}20,
                ${cuisineColor.text}20 2px,
                transparent 2px,
                transparent 4px
              )`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

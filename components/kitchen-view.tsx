'use client';

import { BucketListItem } from '@/types/database';

interface KitchenViewProps {
  items: BucketListItem[];
  onItemClick: (item: BucketListItem) => void;
}

// Difficulty configuration
const difficultyConfig: Record<string, { emoji: string; label: string; color: string }> = {
  'easy': { emoji: '🟢', label: 'Easy', color: '#22C55E' },
  'medium': { emoji: '🟡', label: 'Medium', color: '#EAB308' },
  'complex': { emoji: '🔴', label: 'Complex', color: '#EF4444' },
};

export function KitchenView({ items, onItemClick }: KitchenViewProps) {
  // Filter for dishes (Food & Drink category with gastronomy_type = 'dish')
  const dishItems = items.filter(item =>
    item.categories.includes('food_drink') &&
    item.gastronomy_type === 'dish'
  );

  // Separate by status: to make vs made
  const toMakeItems = dishItems.filter(item => item.status !== 'completed');
  const madeItems = dishItems.filter(item => item.status === 'completed');

  return (
    <div className="space-y-8">
      {/* To Make Section */}
      <section>
        <h2
          className="font-serif text-lg font-bold mb-4 flex items-center gap-2"
          style={{ color: 'var(--charcoal-brown)' }}
        >
          <span>📋</span>
          <span>To Make</span>
          <span
            className="text-sm font-normal px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(253, 230, 138, 0.3)', color: 'var(--text-muted)' }}
          >
            {toMakeItems.length}
          </span>
        </h2>

        {toMakeItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <span className="text-3xl mb-2">👨‍🍳</span>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              No recipes on your list yet. Add some dishes to cook!
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {toMakeItems.map(item => (
              <RecipeCard
                key={item.id}
                item={item}
                onClick={() => onItemClick(item)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Made Section */}
      {madeItems.length > 0 && (
        <section>
          <h2
            className="font-serif text-lg font-bold mb-4 flex items-center gap-2"
            style={{ color: 'var(--charcoal-brown)' }}
          >
            <span>✅</span>
            <span>Made</span>
            <span
              className="text-sm font-normal px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#15803D' }}
            >
              {madeItems.length}
            </span>
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {madeItems.map(item => (
              <RecipeCard
                key={item.id}
                item={item}
                onClick={() => onItemClick(item)}
                isMade
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function RecipeCard({
  item,
  onClick,
  isMade = false,
}: {
  item: BucketListItem;
  onClick: () => void;
  isMade?: boolean;
}) {
  const difficulty = item.difficulty ? difficultyConfig[item.difficulty] : null;

  return (
    <div
      className="cursor-pointer group"
      onClick={onClick}
    >
      <div
        className="rounded-lg overflow-hidden transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-0.5 relative"
        style={{
          background: '#FFFFFF',
          border: '1px solid rgba(139, 123, 114, 0.15)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
          opacity: isMade ? 0.8 : 1,
        }}
      >
        {/* Ruled lines background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              to bottom,
              transparent,
              transparent 27px,
              rgba(59, 130, 246, 0.08) 27px,
              rgba(59, 130, 246, 0.08) 28px
            )`,
            backgroundPosition: '0 12px',
          }}
        />

        {/* Red margin line */}
        <div
          className="absolute top-0 bottom-0 left-8 w-px pointer-events-none"
          style={{
            background: 'rgba(239, 68, 68, 0.2)',
          }}
        />

        {/* Card Content */}
        <div className="relative p-4 pl-12">
          {/* Dish Name */}
          <h3
            className="text-base font-bold leading-tight mb-2"
            style={{
              color: 'var(--charcoal-brown)',
              fontFamily: "'Georgia', serif",
            }}
          >
            {item.title}
            {isMade && (
              <span className="ml-2 text-green-600">✓</span>
            )}
          </h3>

          {/* Cuisine/Style Tag */}
          {item.cuisine && (
            <p
              className="text-xs mb-2"
              style={{ color: 'var(--text-muted)' }}
            >
              {item.cuisine}
            </p>
          )}

          {/* Difficulty Tag */}
          {difficulty && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold"
              style={{
                background: `${difficulty.color}15`,
                color: difficulty.color,
              }}
            >
              <span>{difficulty.emoji}</span>
              <span>{difficulty.label}</span>
            </span>
          )}

          {/* Notes preview */}
          {item.notes && (
            <p
              className="text-xs mt-2 line-clamp-2"
              style={{
                color: 'var(--text-muted)',
                fontStyle: 'italic',
              }}
            >
              {item.notes}
            </p>
          )}

          {/* Priority indicator */}
          {item.is_priority && (
            <span
              className="absolute top-3 right-3 text-sm"
              title="Priority"
            >
              ⭐
            </span>
          )}
        </div>

        {/* Bottom punch holes decoration */}
        <div className="flex justify-center gap-8 py-2 border-t" style={{ borderColor: 'rgba(139, 123, 114, 0.1)' }}>
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: 'rgba(139, 123, 114, 0.1)' }}
          />
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: 'rgba(139, 123, 114, 0.1)' }}
          />
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: 'rgba(139, 123, 114, 0.1)' }}
          />
        </div>
      </div>
    </div>
  );
}

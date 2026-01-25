'use client';

import { useState, useCallback, useRef } from 'react';
import { BucketListItem } from '@/types/database';
import { createClient } from '@/lib/supabase/client';

interface KitchenViewProps {
  items: BucketListItem[];
  onItemUpdate?: (item: BucketListItem) => void;
  onRefresh?: () => void;
  onItemClick?: (item: BucketListItem) => void;
}

export interface DishData {
  title: string;
  cuisine: string | null;
  difficulty: 'easy' | 'medium' | 'complex' | null;
  notes: string | null;
}

// Cuisine categories for grouping
const cuisineConfig: Record<string, { name: string; keywords: string[] }> = {
  asian: {
    name: 'Asian',
    keywords: ['asian', 'chinese', 'japanese', 'korean', 'thai', 'vietnamese', 'indian', 'indonesian', 'malaysian', 'singaporean', 'filipino', 'sushi', 'ramen', 'pho', 'curry', 'dim sum', 'dumpling', 'wok', 'stir fry', 'noodle', 'rice', 'tofu', 'satay', 'pad thai', 'bibimbap', 'kimchi', 'teriyaki', 'miso', 'udon', 'soba', 'tempura'],
  },
  italian: {
    name: 'Italian',
    keywords: ['italian', 'pasta', 'pizza', 'risotto', 'lasagna', 'gnocchi', 'ravioli', 'carbonara', 'bolognese', 'pesto', 'tiramisu', 'focaccia', 'bruschetta', 'prosciutto', 'parmesan', 'mozzarella', 'osso buco', 'panna cotta'],
  },
  mexican: {
    name: 'Mexican & Latin',
    keywords: ['mexican', 'taco', 'burrito', 'enchilada', 'quesadilla', 'guacamole', 'salsa', 'chile', 'tortilla', 'carnitas', 'ceviche', 'empanada', 'latin', 'peruvian', 'brazilian', 'argentinian'],
  },
  mediterranean: {
    name: 'Mediterranean',
    keywords: ['mediterranean', 'greek', 'turkish', 'lebanese', 'middle eastern', 'hummus', 'falafel', 'kebab', 'shawarma', 'tzatziki', 'moussaka', 'baklava', 'pita', 'tahini', 'couscous', 'tagine'],
  },
  american: {
    name: 'American & BBQ',
    keywords: ['american', 'bbq', 'barbecue', 'burger', 'steak', 'ribs', 'wings', 'fried chicken', 'pulled pork', 'brisket', 'mac and cheese', 'cornbread', 'coleslaw', 'southern', 'tex-mex', 'cajun', 'creole'],
  },
  french: {
    name: 'French',
    keywords: ['french', 'croissant', 'baguette', 'quiche', 'souffle', 'crepe', 'coq au vin', 'bouillabaisse', 'ratatouille', 'bechamel', 'hollandaise', 'bearnaise', 'confit', 'cassoulet', 'tarte'],
  },
  baking: {
    name: 'Baking & Desserts',
    keywords: ['bake', 'baking', 'cake', 'cookie', 'bread', 'pastry', 'pie', 'tart', 'brownie', 'muffin', 'scone', 'sourdough', 'dessert', 'sweet', 'chocolate', 'cheesecake', 'pudding', 'custard', 'meringue'],
  },
  seafood: {
    name: 'Seafood',
    keywords: ['seafood', 'fish', 'salmon', 'tuna', 'shrimp', 'prawn', 'lobster', 'crab', 'oyster', 'mussel', 'clam', 'scallop', 'calamari', 'squid', 'octopus', 'sashimi'],
  },
  healthy: {
    name: 'Healthy & Vegetarian',
    keywords: ['healthy', 'salad', 'vegetarian', 'vegan', 'plant-based', 'grain', 'quinoa', 'smoothie', 'bowl', 'clean eating', 'low carb', 'keto', 'whole food'],
  },
};

// Get cuisine category for a dish based on title and notes
function getCuisineForDish(item: BucketListItem): string {
  const searchText = `${item.title} ${item.cuisine || ''} ${item.notes || ''}`.toLowerCase();

  for (const [cuisineKey, config] of Object.entries(cuisineConfig)) {
    if (config.keywords.some(k => searchText.includes(k))) {
      return cuisineKey;
    }
  }

  return 'other';
}

export function KitchenView({ items, onItemUpdate, onRefresh, onItemClick }: KitchenViewProps) {
  const [showCompleted, setShowCompleted] = useState(false);
  const [quickInput, setQuickInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [optimisticItems, setOptimisticItems] = useState<Record<string, Partial<BucketListItem>>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter for dishes (Food & Drink with gastronomy_type = 'dish')
  const dishItems = items.filter(item =>
    item.categories.includes('food_drink') &&
    item.gastronomy_type === 'dish'
  );

  // Split by completion status
  const toMakeItems = dishItems.filter(item => {
    const optimistic = optimisticItems[item.id];
    const status = optimistic?.status ?? item.status;
    return status !== 'completed';
  });

  const madeItems = dishItems.filter(item => {
    const optimistic = optimisticItems[item.id];
    const status = optimistic?.status ?? item.status;
    return status === 'completed';
  });

  const displayedItems = showCompleted ? madeItems : toMakeItems;

  // Group items by cuisine
  const groupedByCuisine = displayedItems.reduce((acc, item) => {
    const cuisine = getCuisineForDish(item);
    if (!acc[cuisine]) {
      acc[cuisine] = [];
    }
    acc[cuisine].push(item);
    return acc;
  }, {} as Record<string, BucketListItem[]>);

  // Sort items within each group alphabetically
  Object.values(groupedByCuisine).forEach(items => {
    items.sort((a, b) => a.title.localeCompare(b.title));
  });

  // Get ordered cuisines (by count, descending)
  const orderedCuisines = Object.entries(groupedByCuisine)
    .sort((a, b) => b[1].length - a[1].length)
    .map(([cuisine]) => cuisine);

  // Separate favorites
  const favoriteItems = displayedItems.filter(item => {
    const optimistic = optimisticItems[item.id];
    return optimistic?.is_priority ?? item.is_priority;
  });

  // Quick add handler
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
          ownership: 'couples',
          added_by: user.id,
          is_physical: false,
          is_priority: false,
          gastronomy_type: 'dish',
        });

      if (error) {
        console.error('Error adding dish:', error);
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
            <span className="text-xl">👨‍🍳</span>
            <input
              ref={inputRef}
              type="text"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd()}
              placeholder="Add a dish to cook..."
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

      {/* Toggle: To Make / Made */}
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
              To Make ({toMakeItems.length})
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
              ✓ Made ({madeItems.length})
            </button>
          </div>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {dishItems.length} total
          </span>
        </div>
      </div>

      {/* Dish List - Chip Layout */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-5xl mx-auto">
          {displayedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="text-4xl mb-3">👨‍🍳</span>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {showCompleted
                  ? "No dishes cooked yet"
                  : "No dishes to cook. Add one above!"}
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
                        <DishChip
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

              {/* Cuisine Sections */}
              {orderedCuisines.map(cuisineKey => {
                const cuisineItems = groupedByCuisine[cuisineKey];
                const config = cuisineConfig[cuisineKey];
                const cuisineName = config?.name || 'Other';

                // Filter out favorites from this section to avoid duplication
                const nonFavoriteItems = cuisineItems.filter(item => {
                  const optimistic = optimisticItems[item.id];
                  return !(optimistic?.is_priority ?? item.is_priority);
                });

                if (nonFavoriteItems.length === 0) return null;

                return (
                  <div key={cuisineKey} className="card-warm break-inside-avoid mb-6">
                    <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(139, 123, 114, 0.15)', background: 'rgba(253, 230, 138, 0.05)' }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🍳</span>
                          <h3 className="font-serif font-bold" style={{ color: 'var(--charcoal-brown)' }}>{cuisineName}</h3>
                        </div>
                        <span className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>{nonFavoriteItems.length}</span>
                      </div>
                    </div>
                    <div className="px-4 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {nonFavoriteItems.map(item => (
                          <DishChip
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

// Dish Chip Component - similar to Life view
function DishChip({
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
      {/* Quick complete checkbox */}
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

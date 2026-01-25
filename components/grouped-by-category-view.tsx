import { BucketListItem, Category } from '@/types/database';
import { categoryConfig } from '@/lib/category-config';
import { CompactListItem } from './compact-list-item';

interface GroupedByCategoryViewProps {
  items: BucketListItem[];
  onItemClick: (item: BucketListItem) => void;
  density: 'compact' | 'comfortable' | 'table';
  selectedCategory: Category | null;
  onCategorySelect: (category: Category | null) => void;
}

interface CategoryGroup {
  category: Category;
  items: BucketListItem[];
  total: number;
}

export function GroupedByCategoryView({
  items,
  onItemClick,
  density,
  selectedCategory,
  onCategorySelect
}: GroupedByCategoryViewProps) {
  // Group items by category
  const categoryGroups = new Map<Category, BucketListItem[]>();

  items.forEach(item => {
    item.categories.forEach(cat => {
      if (!categoryGroups.has(cat)) {
        categoryGroups.set(cat, []);
      }
      categoryGroups.get(cat)!.push(item);
    });
  });

  const groups: CategoryGroup[] = Array.from(categoryGroups.entries())
    .map(([category, items]) => ({
      category,
      items,
      total: items.length,
    }))
    .sort((a, b) => {
      // Travel first, then by count
      if (a.category === 'travel') return -1;
      if (b.category === 'travel') return 1;
      return b.total - a.total;
    });

  // Filter by selected category if one is selected
  const filteredGroups = selectedCategory
    ? groups.filter(g => g.category === selectedCategory)
    : groups;

  return (
    <div>
      {/* Category Filter Buttons */}
      <div className="mb-6 border-b glass-effect px-6 py-3" style={{ borderColor: 'rgba(139, 123, 114, 0.15)' }}>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategorySelect(null)}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              selectedCategory === null
                ? 'highlighter-active'
                : 'card-warm card-warm-hover'
            }`}
            style={{
              color: selectedCategory === null ? 'var(--charcoal-brown)' : 'var(--text-secondary)'
            }}
          >
            All Categories
          </button>
          {groups.map(group => {
            const config = categoryConfig[group.category];
            const isSelected = selectedCategory === group.category;
            return (
              <button
                key={group.category}
                onClick={() => onCategorySelect(group.category)}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${config.watercolorClass} ${
                  isSelected
                    ? 'ring-2 ring-offset-1'
                    : 'opacity-60 hover:opacity-100'
                }`}
                style={{
                  ...(isSelected && { boxShadow: `0 0 0 2px ${config.color.border}` })
                }}
              >
                <span>{config.icon}</span>
                <span className="hidden sm:inline">{config.displayName}</span>
                <span className="text-xs opacity-75">({group.total})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grouped Items */}
      <div className="px-6 space-y-6">
        {filteredGroups.map(group => {
          const config = categoryConfig[group.category];
          return (
            <div key={group.category} className="card-warm overflow-hidden">
              {/* Category Header */}
              <div className="px-4 py-3" style={{
                borderBottom: '1px solid rgba(139, 123, 114, 0.15)',
                background: 'rgba(253, 230, 138, 0.05)'
              }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{config.icon}</span>
                  <h3 className="font-serif font-bold" style={{ color: 'var(--charcoal-brown)' }}>
                    {config.displayName}
                  </h3>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                    {group.total} {group.total === 1 ? 'item' : 'items'}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div>
                {group.items.map(item => (
                  <CompactListItem
                    key={item.id}
                    item={item}
                    onClick={() => onItemClick(item)}
                    density={density}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {filteredGroups.length === 0 && (
          <div className="flex items-center justify-center py-12 text-gray-500">
            No items in this category
          </div>
        )}
      </div>
    </div>
  );
}

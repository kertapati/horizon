import { useState, useEffect } from 'react';
import { BucketListItem, Category } from '@/types/database';
import { categoryConfig } from '@/lib/category-config';
import { CompactListItem } from './compact-list-item';
import { groupItemsByMicroCategory, MicroGroup } from '@/lib/micro-grouping';

interface CategoryViewProps {
  items: BucketListItem[];
  onItemClick: (item: BucketListItem) => void;
  density: 'compact' | 'comfortable' | 'table';
}

interface CategoryGroup {
  category: Category;
  items: BucketListItem[];
  total: number;
}

export function CategoryView({ items, onItemClick, density }: CategoryViewProps) {
  const [expandedCategory, setExpandedCategory] = useState<Category | null>(null);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && expandedCategory !== null) {
        setExpandedCategory(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [expandedCategory]);

  // Group items by category (excluding food_drink - that's for Restaurants section only)
  const categoryGroups = new Map<Category, BucketListItem[]>();

  items.forEach(item => {
    item.categories.forEach(cat => {
      // Skip food_drink category - it should only appear in Restaurants section
      if (cat === 'food_drink') return;

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

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {groups.map(group => {
        const config = categoryConfig[group.category];
        const isExpanded = expandedCategory === group.category;

        return (
          <div key={group.category}>
            {/* Category Card - Compact */}
            <button
              onClick={() => setExpandedCategory(isExpanded ? null : group.category)}
              className="w-full card-warm card-warm-hover px-3 py-2 flex flex-col items-center gap-2 text-center transition-all"
            >
              <span className="text-3xl">{config.icon}</span>
              <h3 className="font-serif font-semibold text-sm" style={{ color: 'var(--charcoal-brown)' }}>
                {config.displayName}
              </h3>
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                {group.total} {group.total === 1 ? 'item' : 'items'}
              </span>
            </button>

            {/* Expanded Items List - Clustered Field Guide Layout */}
            {isExpanded && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.15)' }} onClick={() => setExpandedCategory(null)}>
                <div className="card-warm max-w-4xl w-full max-h-[85vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                  {/* Header */}
                  <div className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between" style={{
                    borderBottom: '1px solid rgba(139, 123, 114, 0.15)',
                    background: 'rgba(253, 230, 138, 0.05)'
                  }}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{config.icon}</span>
                      <h3 className="font-serif font-bold text-xl" style={{ color: 'var(--charcoal-brown)' }}>
                        {config.displayName}
                      </h3>
                      <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                        {group.total} {group.total === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                    <button
                      onClick={() => setExpandedCategory(null)}
                      className="p-1 rounded transition-colors"
                      style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(253, 230, 138, 0.15)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Content - Scrollable */}
                  <div className="overflow-y-auto px-6 py-4" style={{ maxHeight: 'calc(85vh - 80px)' }}>
                    <ClusteredFieldGuide
                      category={group.category}
                      items={group.items}
                      onItemClick={(item) => {
                        setExpandedCategory(null);
                        onItemClick(item);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Clustered Field Guide Component
function ClusteredFieldGuide({
  category,
  items,
  onItemClick,
}: {
  category: Category;
  items: BucketListItem[];
  onItemClick: (item: BucketListItem) => void;
}) {
  // Separate priority items
  const priorityItems = items.filter(item => item.is_priority);
  const regularItems = items.filter(item => !item.is_priority);

  // Group regular items by micro-category
  const microGroups = groupItemsByMicroCategory(regularItems, category);

  return (
    <div className="space-y-6">
      {/* Featured Section - Priority Items */}
      {priorityItems.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: '#D4AF37' }}>
              ⭐ Top Focus
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {priorityItems.map(item => (
              <ItemChip
                key={item.id}
                item={item}
                onClick={onItemClick}
                featured
              />
            ))}
          </div>
        </div>
      )}

      {/* Micro-Grouped Sections */}
      {microGroups.map((microGroup, idx) => (
        <div key={idx}>
          <div className="flex items-center gap-2 mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: '#8B7B72' }}>
              {microGroup.name}
            </h4>
            <div className="flex-1 h-px" style={{ background: 'rgba(139, 123, 114, 0.2)' }}></div>
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              {microGroup.items.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {microGroup.items.map(item => (
              <ItemChip
                key={item.id}
                item={item}
                onClick={onItemClick}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Item Chip Component
function ItemChip({
  item,
  onClick,
  featured = false,
}: {
  item: BucketListItem;
  onClick: (item: BucketListItem) => void;
  featured?: boolean;
}) {
  return (
    <button
      onClick={() => onClick(item)}
      className={`px-3 py-1.5 rounded-full text-xs transition-all ${
        featured
          ? 'bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 font-bold'
          : 'bg-stone-100 hover:bg-stone-200 border border-stone-200'
      }`}
      style={{
        color: 'var(--charcoal-brown)',
      }}
    >
      {item.title}
    </button>
  );
}

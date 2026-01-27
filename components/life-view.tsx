import { BucketListItem, Category } from '@/types/database';
import { categoryConfig } from '@/lib/category-config';
import { groupItemsByMicroCategory, MicroGroup } from '@/lib/micro-grouping';

interface LifeViewProps {
  items: BucketListItem[];
  onItemClick: (item: BucketListItem) => void;
}

interface CategoryGroup {
  category: Category;
  items: BucketListItem[];
}

// Life categories (non-travel categories, excluding food_drink which is for Restaurants section only)
const lifeCategories: Category[] = [
  'creative',
  'skills',
  'life_legacy',
  'personal_growth',
  'business_professional',
  'material',
  'social_impact',
  'health_wellness',
  'adventure',
  'cultural_events',
  'sporting_events',
  'music_party',
  'challenges'
];

export function LifeView({ items, onItemClick }: LifeViewProps) {
  // Group items by category
  const categoryGroups = new Map<Category, BucketListItem[]>();

  items.forEach(item => {
    item.categories.forEach(cat => {
      if (lifeCategories.includes(cat)) {
        if (!categoryGroups.has(cat)) {
          categoryGroups.set(cat, []);
        }
        categoryGroups.get(cat)!.push(item);
      }
    });
  });

  const groups: CategoryGroup[] = Array.from(categoryGroups.entries())
    .map(([category, items]) => ({
      category,
      items,
    }))
    .filter(group => group.items.length > 0)
    .sort((a, b) => b.items.length - a.items.length);

  return (
    <div className="space-y-6">
      {/* Masonry column layout */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
        {groups.map(group => (
          <CategoryColumn
            key={group.category}
            category={group.category}
            items={group.items}
            onItemClick={onItemClick}
          />
        ))}
      </div>

      {groups.length === 0 && (
        <div className="flex items-center justify-center py-12 text-gray-500">
          No life projects found
        </div>
      )}
    </div>
  );
}

function CategoryColumn({
  category,
  items,
  onItemClick,
}: {
  category: Category;
  items: BucketListItem[];
  onItemClick: (item: BucketListItem) => void;
}) {
  const config = categoryConfig[category];

  // Separate priority items
  const priorityItems = items.filter(item => item.is_priority);
  const regularItems = items.filter(item => !item.is_priority);

  // Group regular items by micro-category
  const microGroups = groupItemsByMicroCategory(regularItems, category);

  return (
    <div className="card-warm break-inside-avoid mb-6">
      {/* Category Header */}
      <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(139, 123, 114, 0.15)', background: 'rgba(253, 230, 138, 0.05)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{config.icon}</span>
            <h3 className="font-serif font-bold" style={{ color: 'var(--charcoal-brown)' }}>{config.displayName}</h3>
          </div>
          <span className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>{items.length}</span>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-4">
        {/* Featured Section - Priority Items */}
        {priorityItems.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#D4AF37' }}>
                ⭐ Top Focus
              </h4>
            </div>
            <div className="flex flex-wrap gap-1.5">
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
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#8B7B72' }}>
                {microGroup.name}
              </h4>
              <div className="flex-1 h-px" style={{ background: 'rgba(139, 123, 114, 0.2)' }}></div>
              <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
                {microGroup.items.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
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
      className={`px-2.5 py-1 rounded-full text-xs transition-all ${
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

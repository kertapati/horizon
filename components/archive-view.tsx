'use client';

import { useState } from 'react';
import { BucketListItem, Category } from '@/types/database';
import { categoryConfig } from '@/lib/category-config';
import { CompactListItem } from './compact-list-item';
import { ConfirmDialog } from './confirm-dialog';
import { createClient } from '@/lib/supabase/client';

interface ArchiveViewProps {
  items: BucketListItem[];
  onItemClick: (item: BucketListItem) => void;
  density: 'compact' | 'comfortable' | 'table';
  selectedCategory: Category | null;
  onCategorySelect: (category: Category | null) => void;
  onRefresh: () => void;
}

interface CategoryGroup {
  category: Category;
  items: BucketListItem[];
  total: number;
}

export function ArchiveView({
  items,
  onItemClick,
  density,
  selectedCategory,
  onCategorySelect,
  onRefresh,
}: ArchiveViewProps) {
  const [deleteTarget, setDeleteTarget] = useState<BucketListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePermanentDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('bucket_list_items')
        .delete()
        .eq('id', deleteTarget.id);
      if (error) throw error;
      onRefresh();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item. Please try again.');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

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
    .map(([category, groupItems]) => ({
      category,
      items: groupItems,
      total: groupItems.length,
    }))
    .sort((a, b) => {
      if (a.category === 'travel') return -1;
      if (b.category === 'travel') return 1;
      return b.total - a.total;
    });

  const filteredGroups = selectedCategory
    ? groups.filter(g => g.category === selectedCategory)
    : groups;

  return (
    <div>
      {/* Category Filter Buttons */}
      {groups.length > 0 && (
        <div className="mb-6 border-b glass-effect px-3 sm:px-6 py-3" style={{ borderColor: 'rgba(139, 123, 114, 0.15)' }}>
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
      )}

      {/* Grouped Items */}
      <div className="px-3 sm:px-6 space-y-4 sm:space-y-6">
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
                  <div key={item.id} className="flex items-center group/row">
                    <div className="flex-1 min-w-0">
                      <CompactListItem
                        item={item}
                        onClick={() => onItemClick(item)}
                        density={density}
                      />
                    </div>
                    {/* Trash icon for permanent delete */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(item);
                      }}
                      className="flex-shrink-0 p-2 mr-2 rounded-md text-gray-400 opacity-0 group-hover/row:opacity-100 hover:text-red-600 hover:bg-red-50 transition-all"
                      title="Delete permanently"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <span className="text-4xl mb-3">📦</span>
            <p className="text-sm font-medium">No archived items</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Items you archive will appear here
            </p>
          </div>
        )}
      </div>

      {/* Permanent Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Delete permanently?"
        message="This can't be undone."
        confirmLabel={isDeleting ? 'Deleting...' : 'Delete'}
        onConfirm={handlePermanentDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

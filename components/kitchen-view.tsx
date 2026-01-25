'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { BucketListItem } from '@/types/database';
import { createClient } from '@/lib/supabase/client';

interface KitchenViewProps {
  items: BucketListItem[];
  onItemUpdate?: (item: BucketListItem) => void;
  onRefresh?: () => void;
}

export interface DishData {
  title: string;
  cuisine: string | null;
  difficulty: 'easy' | 'medium' | 'complex' | null;
  notes: string | null;
}

export function KitchenView({ items, onItemUpdate, onRefresh }: KitchenViewProps) {
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

  // Sort alphabetically
  const sortedItems = [...displayedItems].sort((a, b) => a.title.localeCompare(b.title));

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
  const handleToggleComplete = useCallback(async (item: BucketListItem) => {
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
  const handleToggleFavorite = useCallback(async (item: BucketListItem) => {
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

  // Inline edit title
  const handleTitleUpdate = useCallback(async (item: BucketListItem, newTitle: string) => {
    if (newTitle === item.title || !newTitle.trim()) return;

    setOptimisticItems(prev => ({
      ...prev,
      [item.id]: { ...prev[item.id], title: newTitle }
    }));

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('bucket_list_items')
        .update({ title: newTitle })
        .eq('id', item.id);

      if (error) {
        console.error('Error updating title:', error);
        setOptimisticItems(prev => ({
          ...prev,
          [item.id]: { ...prev[item.id], title: item.title }
        }));
      } else if (onItemUpdate) {
        onItemUpdate({ ...item, title: newTitle });
      }
    } catch (err) {
      console.error('Error:', err);
    }
  }, [onItemUpdate]);

  // Inline edit notes
  const handleNotesUpdate = useCallback(async (item: BucketListItem, newNotes: string) => {
    if (newNotes === (item.notes || '')) return;

    setOptimisticItems(prev => ({
      ...prev,
      [item.id]: { ...prev[item.id], notes: newNotes }
    }));

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('bucket_list_items')
        .update({ notes: newNotes || null })
        .eq('id', item.id);

      if (error) {
        console.error('Error updating notes:', error);
        setOptimisticItems(prev => ({
          ...prev,
          [item.id]: { ...prev[item.id], notes: item.notes }
        }));
      } else if (onItemUpdate) {
        onItemUpdate({ ...item, notes: newNotes || null });
      }
    } catch (err) {
      console.error('Error:', err);
    }
  }, [onItemUpdate]);

  return (
    <div className="h-full flex flex-col">
      {/* Quick Capture Bar */}
      <div className="p-4 border-b" style={{ borderColor: 'rgba(139, 123, 114, 0.15)', background: 'var(--paper-cream)' }}>
        <div className="max-w-3xl mx-auto">
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
        <div className="max-w-3xl mx-auto flex items-center justify-between">
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

      {/* Dish List */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto py-2">
          {sortedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="text-4xl mb-3">👨‍🍳</span>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {showCompleted
                  ? "No dishes cooked yet"
                  : "No dishes to cook. Add one above!"}
              </p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'rgba(139, 123, 114, 0.08)' }}>
              {sortedItems.map(item => (
                <MinimalistRow
                  key={item.id}
                  item={item}
                  optimistic={optimisticItems[item.id]}
                  onToggleComplete={() => handleToggleComplete(item)}
                  onToggleFavorite={() => handleToggleFavorite(item)}
                  onTitleUpdate={(title) => handleTitleUpdate(item, title)}
                  onNotesUpdate={(notes) => handleNotesUpdate(item, notes)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MinimalistRow({
  item,
  optimistic,
  onToggleComplete,
  onToggleFavorite,
  onTitleUpdate,
  onNotesUpdate,
}: {
  item: BucketListItem;
  optimistic?: Partial<BucketListItem>;
  onToggleComplete: () => void;
  onToggleFavorite: () => void;
  onTitleUpdate: (title: string) => void;
  onNotesUpdate: (notes: string) => void;
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [showNotes, setShowNotes] = useState(false);
  const [editNotes, setEditNotes] = useState(item.notes || '');
  const titleInputRef = useRef<HTMLInputElement>(null);
  const notesInputRef = useRef<HTMLTextAreaElement>(null);

  const isCompleted = (optimistic?.status ?? item.status) === 'completed';
  const isFavorite = optimistic?.is_priority ?? item.is_priority;
  const displayTitle = optimistic?.title ?? item.title;
  const displayNotes = optimistic?.notes ?? item.notes;

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  useEffect(() => {
    if (showNotes && notesInputRef.current) {
      notesInputRef.current.focus();
    }
  }, [showNotes]);

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (editTitle.trim() && editTitle !== item.title) {
      onTitleUpdate(editTitle.trim());
    } else {
      setEditTitle(item.title);
    }
  };

  const handleNotesBlur = () => {
    if (editNotes !== (item.notes || '')) {
      onNotesUpdate(editNotes);
    }
  };

  return (
    <div className="group">
      <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/50 transition-colors">
        {/* Checkbox Circle */}
        <button
          onClick={onToggleComplete}
          className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110"
          style={{
            borderColor: isCompleted ? '#22C55E' : 'rgba(139, 123, 114, 0.3)',
            background: isCompleted ? '#22C55E' : 'transparent',
          }}
        >
          {isCompleted && (
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Title - Editable */}
        <div className="flex-1 min-w-0">
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleBlur();
                if (e.key === 'Escape') {
                  setEditTitle(item.title);
                  setIsEditingTitle(false);
                }
              }}
              className="w-full bg-transparent outline-none text-sm font-medium px-1 -ml-1 rounded"
              style={{
                color: 'var(--charcoal-brown)',
                background: 'rgba(253, 230, 138, 0.3)',
              }}
            />
          ) : (
            <span
              onClick={() => {
                setEditTitle(displayTitle);
                setIsEditingTitle(true);
              }}
              className={`text-sm font-medium cursor-text hover:bg-amber-50 px-1 -ml-1 rounded transition-colors ${
                isCompleted ? 'line-through opacity-60' : ''
              }`}
              style={{ color: 'var(--charcoal-brown)' }}
            >
              {displayTitle}
            </span>
          )}

          {/* Inline notes preview */}
          {displayNotes && !showNotes && (
            <p
              className="text-xs mt-0.5 truncate cursor-pointer hover:text-amber-700"
              style={{ color: 'var(--text-muted)' }}
              onClick={() => setShowNotes(true)}
            >
              {displayNotes}
            </p>
          )}
        </div>

        {/* Notes toggle */}
        <button
          onClick={() => setShowNotes(!showNotes)}
          className={`flex-shrink-0 p-1.5 rounded transition-all ${
            showNotes || displayNotes ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
          }`}
          title="Add notes"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            style={{ color: displayNotes ? 'var(--charcoal-brown)' : 'var(--text-muted)' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>

        {/* Heart / Favorite */}
        <button
          onClick={onToggleFavorite}
          className="flex-shrink-0 p-1.5 transition-transform hover:scale-110"
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? (
            <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-300 group-hover:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          )}
        </button>
      </div>

      {/* Expandable Notes Area */}
      {showNotes && (
        <div className="px-4 pb-3 pl-14">
          <textarea
            ref={notesInputRef}
            value={editNotes}
            onChange={(e) => setEditNotes(e.target.value)}
            onBlur={handleNotesBlur}
            placeholder="Add notes (recipe link, ingredients, tips...)"
            className="w-full text-xs p-2 rounded-lg resize-none outline-none transition-all"
            style={{
              background: 'rgba(139, 123, 114, 0.05)',
              border: '1px solid rgba(139, 123, 114, 0.15)',
              color: 'var(--charcoal-brown)',
              minHeight: '60px',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(212, 175, 55, 0.5)';
              e.target.style.background = 'white';
            }}
          />
        </div>
      )}
    </div>
  );
}

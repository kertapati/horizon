'use client';

import { BucketListItem, Category, GastronomyType, PriceLevel, Difficulty, CUISINES } from '@/types/database';
import { categoryConfig } from '@/lib/category-config';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { countryList } from '@/lib/countries';

interface DetailPanelProps {
  item: BucketListItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

export function DetailPanel({ item, isOpen, onClose, onUpdate }: DetailPanelProps) {
  const [editedItem, setEditedItem] = useState<BucketListItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [countryInput, setCountryInput] = useState('');
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);

  // Gastronomy state
  const [cuisineInput, setCuisineInput] = useState('');
  const [showCuisineSuggestions, setShowCuisineSuggestions] = useState(false);
  const [filteredCuisines, setFilteredCuisines] = useState<string[]>([]);

  // Initialize edited item when item changes
  useEffect(() => {
    if (item) {
      setEditedItem(item);
      setSelectedCategories(item.categories);
      setCountryInput(item.country || '');
      setCuisineInput(item.cuisine || '');
    }
  }, [item]);

  // Filter countries based on input
  useEffect(() => {
    if (countryInput.trim().length > 0) {
      const filtered = countryList.filter(c =>
        c.toLowerCase().includes(countryInput.toLowerCase())
      );
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries([]);
      setShowCountrySuggestions(false);
    }
  }, [countryInput]);

  // Filter cuisines based on input
  useEffect(() => {
    if (cuisineInput.trim().length > 0) {
      const filtered = CUISINES.filter(c =>
        c.toLowerCase().includes(cuisineInput.toLowerCase())
      );
      setFilteredCuisines(filtered);
    } else {
      setFilteredCuisines([...CUISINES]);
      setShowCuisineSuggestions(false);
    }
  }, [cuisineInput]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const handleSave = async () => {
    if (!editedItem) return;

    setIsSaving(true);
    try {
      const supabase = createClient();

      const updateData: Partial<BucketListItem> = {
        title: editedItem.title,
        status: editedItem.status,
        categories: selectedCategories,
        location_type: editedItem.location_type,
        country: editedItem.country,
        region: editedItem.region,
        specific_location: editedItem.specific_location,
        target_year: editedItem.target_year,
        ownership: editedItem.ownership,
        is_priority: editedItem.is_priority,
        // Gastronomy fields
        gastronomy_type: editedItem.gastronomy_type,
        cuisine: editedItem.cuisine,
        neighborhood: editedItem.neighborhood,
        price_level: editedItem.price_level,
        difficulty: editedItem.difficulty,
        notes: editedItem.notes,
      };

      // If status changed to completed, set completion date
      if (editedItem.status === 'completed' && item?.status !== 'completed') {
        updateData.completed_date = new Date().toISOString();
      }

      const { error } = await supabase
        .from('bucket_list_items')
        .update(updateData)
        .eq('id', editedItem.id);

      if (error) throw error;

      // Call onUpdate to refresh the list
      if (onUpdate) onUpdate();

      // Close the panel
      onClose();
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editedItem) return;

    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('bucket_list_items')
        .delete()
        .eq('id', editedItem.id);

      if (error) throw error;

      if (onUpdate) onUpdate();
      onClose();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item. Please try again.');
    }
  };

  const toggleCategory = (category: Category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        // Don't allow removing all categories
        if (prev.length === 1) return prev;
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  if (!editedItem || !isOpen) return null;

  const allCategories: Category[] = [
    'travel',
    'adventure',
    'cultural_events',
    'sporting_events',
    'music_party',
    'food_drink',
    'personal_growth',
    'creative',
    'skills',
    'challenges',
    'material',
    'business_professional',
    'social_impact',
    'life_legacy',
    'health_wellness'
  ];

  return (
    <>
      {/* Mobile overlay backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />

      {/* Panel - full screen on mobile, sidebar on desktop */}
      <aside className="fixed inset-0 z-50 md:relative md:inset-auto md:z-auto w-full md:w-[400px] flex-shrink-0 md:border-l border-gray-200 bg-white flex flex-col h-full">
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-gray-200 px-4 sm:px-6">
          <h2 className="text-lg font-semibold text-gray-900">Goal Details</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-700">Title</label>
              <div className="flex items-start gap-2">
                {editedItem.is_priority && <span className="text-lg mt-2">⭐</span>}
                <input
                  type="text"
                  value={editedItem.title}
                  onChange={(e) => setEditedItem({ ...editedItem, title: e.target.value })}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-lg font-medium focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  style={{ color: 'var(--charcoal-brown)' }}
                />
              </div>
            </div>

            {/* Description */}
            {editedItem.description && (
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-700">Description</label>
                <p className="text-sm text-gray-600">{editedItem.description}</p>
              </div>
            )}

            {/* Categories - Editable */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-700">Categories</label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {allCategories.map((cat) => {
                    const config = categoryConfig[cat];
                    const isSelected = selectedCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium transition-all ${
                          isSelected
                            ? 'ring-2 ring-indigo-600 ring-offset-1'
                            : 'opacity-40 hover:opacity-70'
                        }`}
                        style={{
                          backgroundColor: config.color.bg,
                          color: config.color.text,
                        }}
                      >
                        <span>{config.icon}</span>
                        <span>{config.displayName}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500">Click categories to add/remove</p>
              </div>
            </div>

            {/* Gastronomy Fields - Only show when Food & Drink is selected */}
            {selectedCategories.includes('food_drink') && (
              <div
                className="p-4 rounded-xl space-y-4"
                style={{
                  background: 'rgba(253, 230, 138, 0.15)',
                  border: '1px solid rgba(253, 230, 138, 0.4)',
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🍽️</span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--charcoal-brown)' }}>
                    Gastronomy Details
                  </span>
                </div>

                {/* Type Selection */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-700">Type</label>
                  <div className="flex gap-3">
                    <label
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                        editedItem.gastronomy_type === 'restaurant'
                          ? 'ring-2 ring-amber-500'
                          : 'hover:bg-white/50'
                      }`}
                      style={{
                        background: editedItem.gastronomy_type === 'restaurant' ? 'white' : 'rgba(255,255,255,0.3)',
                        border: '1px solid rgba(139, 123, 114, 0.2)',
                      }}
                    >
                      <input
                        type="radio"
                        name="gastronomyType"
                        value="restaurant"
                        checked={editedItem.gastronomy_type === 'restaurant'}
                        onChange={() => setEditedItem({ ...editedItem, gastronomy_type: 'restaurant' })}
                        className="sr-only"
                      />
                      <span>🍴</span>
                      <span className="text-sm font-medium" style={{ color: 'var(--charcoal-brown)' }}>Restaurant</span>
                    </label>
                    <label
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                        editedItem.gastronomy_type === 'dish'
                          ? 'ring-2 ring-amber-500'
                          : 'hover:bg-white/50'
                      }`}
                      style={{
                        background: editedItem.gastronomy_type === 'dish' ? 'white' : 'rgba(255,255,255,0.3)',
                        border: '1px solid rgba(139, 123, 114, 0.2)',
                      }}
                    >
                      <input
                        type="radio"
                        name="gastronomyType"
                        value="dish"
                        checked={editedItem.gastronomy_type === 'dish'}
                        onChange={() => setEditedItem({ ...editedItem, gastronomy_type: 'dish' })}
                        className="sr-only"
                      />
                      <span>👨‍🍳</span>
                      <span className="text-sm font-medium" style={{ color: 'var(--charcoal-brown)' }}>Dish</span>
                    </label>
                  </div>
                </div>

                {/* Cuisine */}
                <div className="relative">
                  <label className="mb-2 block text-xs font-medium text-gray-700">Cuisine/Style</label>
                  <input
                    type="text"
                    value={cuisineInput}
                    onChange={(e) => {
                      setCuisineInput(e.target.value);
                      setEditedItem({ ...editedItem, cuisine: e.target.value || null });
                    }}
                    onFocus={() => setShowCuisineSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowCuisineSuggestions(false), 150)}
                    placeholder="e.g., Japanese, Italian"
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    style={{ color: 'var(--charcoal-brown)' }}
                    autoComplete="off"
                  />
                  {showCuisineSuggestions && filteredCuisines.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-40 overflow-y-auto">
                      {filteredCuisines.slice(0, 8).map((c) => (
                        <button
                          key={c}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setCuisineInput(c);
                            setEditedItem({ ...editedItem, cuisine: c });
                            setShowCuisineSuggestions(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-amber-50 transition-colors"
                          style={{ color: 'var(--charcoal-brown)' }}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Restaurant-specific: Neighborhood */}
                {editedItem.gastronomy_type === 'restaurant' && (
                  <div>
                    <label className="mb-2 block text-xs font-medium text-gray-700">Neighborhood</label>
                    <input
                      type="text"
                      value={editedItem.neighborhood || ''}
                      onChange={(e) => setEditedItem({ ...editedItem, neighborhood: e.target.value || null })}
                      placeholder="e.g., Surry Hills, CBD"
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      style={{ color: 'var(--charcoal-brown)' }}
                    />
                  </div>
                )}

                {/* Restaurant-specific: Price Level */}
                {editedItem.gastronomy_type === 'restaurant' && (
                  <div>
                    <label className="mb-2 block text-xs font-medium text-gray-700">Price Level</label>
                    <div className="flex gap-2">
                      {(['$', '$$', '$$$', '$$$$'] as PriceLevel[]).map((price) => (
                        <button
                          key={price}
                          type="button"
                          onClick={() => setEditedItem({
                            ...editedItem,
                            price_level: editedItem.price_level === price ? null : price
                          })}
                          className={`flex-1 px-2 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                            editedItem.price_level === price
                              ? 'ring-2 ring-amber-500 bg-white'
                              : 'bg-white/50 hover:bg-white/80'
                          }`}
                          style={{
                            color: editedItem.price_level === price ? 'var(--charcoal-brown)' : 'var(--text-muted)',
                            border: '1px solid rgba(139, 123, 114, 0.2)',
                          }}
                        >
                          {price}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dish-specific: Difficulty */}
                {editedItem.gastronomy_type === 'dish' && (
                  <div>
                    <label className="mb-2 block text-xs font-medium text-gray-700">Difficulty</label>
                    <div className="flex gap-2">
                      {([
                        { value: 'easy' as Difficulty, emoji: '🟢', label: 'Easy' },
                        { value: 'medium' as Difficulty, emoji: '🟡', label: 'Medium' },
                        { value: 'complex' as Difficulty, emoji: '🔴', label: 'Complex' },
                      ]).map((d) => (
                        <button
                          key={d.value}
                          type="button"
                          onClick={() => setEditedItem({
                            ...editedItem,
                            difficulty: editedItem.difficulty === d.value ? null : d.value
                          })}
                          className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                            editedItem.difficulty === d.value
                              ? 'ring-2 ring-amber-500 bg-white'
                              : 'bg-white/50 hover:bg-white/80'
                          }`}
                          style={{
                            color: editedItem.difficulty === d.value ? 'var(--charcoal-brown)' : 'var(--text-muted)',
                            border: '1px solid rgba(139, 123, 114, 0.2)',
                          }}
                        >
                          <span>{d.emoji}</span>
                          <span>{d.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-700">Notes</label>
                  <textarea
                    value={editedItem.notes || ''}
                    onChange={(e) => setEditedItem({ ...editedItem, notes: e.target.value || null })}
                    placeholder={editedItem.gastronomy_type === 'restaurant'
                      ? "Google Maps link, notes..."
                      : "Recipe link, cooking notes..."}
                    rows={2}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm resize-none focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    style={{ color: 'var(--charcoal-brown)' }}
                  />
                </div>
              </div>
            )}

            {/* Status */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-700">Status</label>
              <select
                value={editedItem.status}
                onChange={(e) => setEditedItem({ ...editedItem, status: e.target.value as any })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="idea">Idea</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-700">Location</label>
              <div className="space-y-2">
                <select
                  value={editedItem.location_type || ''}
                  onChange={(e) => setEditedItem({ ...editedItem, location_type: e.target.value as any })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">Select location type</option>
                  <option value="sydney">Sydney</option>
                  <option value="australia">Australia</option>
                  <option value="international">International</option>
                </select>

                {/* Specific Location */}
                <input
                  type="text"
                  value={editedItem.specific_location || ''}
                  onChange={(e) => setEditedItem({ ...editedItem, specific_location: e.target.value || null })}
                  placeholder="Specific location (e.g., Mt Fuji, Santorini)"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  style={{ color: 'var(--charcoal-brown)' }}
                />

                {/* Country with autocomplete */}
                {editedItem.location_type === 'international' && (
                  <div className="relative">
                    <input
                      type="text"
                      value={countryInput}
                      onChange={(e) => {
                        setCountryInput(e.target.value);
                        setEditedItem({ ...editedItem, country: e.target.value || null });
                      }}
                      onFocus={() => {
                        if (countryInput.trim().length > 0 && filteredCountries.length > 0) {
                          setShowCountrySuggestions(true);
                        }
                      }}
                      placeholder="Country (e.g., Japan, Germany)"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      style={{ color: 'var(--charcoal-brown)' }}
                      autoComplete="off"
                    />
                    {showCountrySuggestions && filteredCountries.length > 0 && (
                      <div
                        className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto"
                        style={{
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                        }}
                      >
                        {filteredCountries.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => {
                              setCountryInput(c);
                              setEditedItem({ ...editedItem, country: c });
                              setShowCountrySuggestions(false);
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors"
                            style={{ color: 'var(--charcoal-brown)' }}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Region */}
                {editedItem.location_type === 'international' && (
                  <select
                    value={editedItem.region || ''}
                    onChange={(e) => setEditedItem({ ...editedItem, region: e.target.value as any || null })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">Select region</option>
                    <option value="Europe">🇪🇺 Europe</option>
                    <option value="Asia">🌏 Asia</option>
                    <option value="Americas">🌎 Americas</option>
                    <option value="Middle East & Africa">🌍 Middle East & Africa</option>
                    <option value="Oceania">🏝️ Oceania</option>
                  </select>
                )}
              </div>
            </div>

            {/* Year */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-700">Target Year</label>
              <select
                value={editedItem.target_year || ''}
                onChange={(e) => setEditedItem({ ...editedItem, target_year: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Unassigned</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
              </select>
            </div>

            {/* Ownership */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-700">Ownership</label>
              <select
                value={editedItem.ownership}
                onChange={(e) => setEditedItem({ ...editedItem, ownership: e.target.value as any })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="couples">👫 Couples</option>
                <option value="peter">👤 Peter</option>
                <option value="wife">👤 Xi</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editedItem.is_priority}
                  onChange={(e) => setEditedItem({ ...editedItem, is_priority: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">⭐ Priority</span>
              </label>
            </div>

            {/* Completion info */}
            {editedItem.status === 'completed' && (
              <div className="rounded-lg bg-green-50 p-4">
                <div className="text-sm font-medium text-green-900">✅ Completed</div>
                {editedItem.completed_date && (
                  <div className="mt-1 text-xs text-green-700">
                    {new Date(editedItem.completed_date).toLocaleDateString()}
                  </div>
                )}
                {editedItem.completion_notes && (
                  <div className="mt-2 text-sm text-green-800">{editedItem.completion_notes}</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex h-14 flex-shrink-0 items-center justify-between border-t border-gray-200 bg-white px-4 sm:px-6">
          <button
            onClick={handleDelete}
            className="text-sm font-medium text-red-600 hover:text-red-700"
          >
            Delete
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </aside>
    </>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/types/database';
import { categoryConfig } from '@/lib/category-config';
import { countryList } from '@/lib/countries';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: NewItemData) => void;
}

export interface NewItemData {
  title: string;
  categories: Category[];
  status: 'idea' | 'in_progress' | 'completed';
  location_type: 'sydney' | 'australia' | 'international' | null;
  specific_location: string | null;
  region: 'Europe' | 'Asia' | 'Americas' | 'Middle East & Africa' | 'Oceania' | null;
  country: string | null;
  target_year: number | null;
  ownership: 'couples' | 'peter' | 'wife';
  is_priority: boolean;
  description: string;
}

export function AddItemModal({ isOpen, onClose, onAdd }: AddItemModalProps) {
  const [title, setTitle] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(['travel']);
  const [status, setStatus] = useState<'idea' | 'in_progress' | 'completed'>('idea');
  const [locationType, setLocationType] = useState<'sydney' | 'australia' | 'international' | null>(null);
  const [specificLocation, setSpecificLocation] = useState('');
  const [region, setRegion] = useState<'Europe' | 'Asia' | 'Americas' | 'Middle East & Africa' | 'Oceania' | null>(null);
  const [country, setCountry] = useState('');
  const [targetYear, setTargetYear] = useState<number | null>(null);
  const [ownership, setOwnership] = useState<'couples' | 'peter' | 'wife'>('couples');
  const [isPriority, setIsPriority] = useState(false);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [countryInput, setCountryInput] = useState('');
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (showCountrySuggestions) {
          setShowCountrySuggestions(false);
        } else {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, showCountrySuggestions]);

  // Filter countries based on input
  useEffect(() => {
    if (countryInput.trim().length > 0) {
      const filtered = countryList.filter(c =>
        c.toLowerCase().includes(countryInput.toLowerCase())
      );
      setFilteredCountries(filtered);
      setShowCountrySuggestions(filtered.length > 0);
    } else {
      setFilteredCountries([]);
      setShowCountrySuggestions(false);
    }
  }, [countryInput]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Please enter a title for your adventure');
      return;
    }

    if (selectedCategories.length === 0) {
      alert('Please select at least one category');
      return;
    }

    setIsSubmitting(true);

    const data: NewItemData = {
      title: title.trim(),
      categories: selectedCategories,
      status,
      location_type: locationType,
      specific_location: specificLocation.trim() || null,
      region,
      country: country.trim() || null,
      target_year: targetYear,
      ownership,
      is_priority: isPriority,
      description: description.trim(),
    };

    console.log('New Adventure Data:', data);

    // Call onAdd and wait for it to complete
    await onAdd(data);

    // Show success animation
    setShowSuccess(true);
    setIsSubmitting(false);

    // Wait a bit for the success animation, then reset and close
    setTimeout(() => {
      setShowSuccess(false);
      // Reset form
      setTitle('');
      setSelectedCategories(['travel']);
      setStatus('idea');
      setLocationType(null);
      setSpecificLocation('');
      setRegion(null);
      setCountry('');
      setCountryInput('');
      setTargetYear(null);
      setOwnership('couples');
      setIsPriority(false);
      setDescription('');
      onClose();
    }, 800);
  };

  if (!isOpen) return null;

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] rounded-3xl overflow-hidden animate-scale-in"
        style={{
          background: 'var(--paper-cream)',
          boxShadow: '0 25px 50px -12px rgba(180, 100, 50, 0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b" style={{ borderColor: 'rgba(139, 123, 114, 0.15)' }}>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-serif text-3xl font-bold" style={{ color: 'var(--charcoal-brown)' }}>
                Write a new story...
              </h2>
              <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                Add a new adventure to your horizon
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(253, 230, 138, 0.15)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form - Scrollable */}
        <form onSubmit={handleSubmit} className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
          <div className="px-8 py-6 space-y-6">
            {/* Title */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Climb Mt Fuji"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-base font-medium focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                style={{ color: 'var(--charcoal-brown)' }}
                autoFocus
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-700">Description <span className="text-xs font-normal opacity-60">(optional)</span></label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add any details or thoughts..."
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm resize-none focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                style={{ color: 'var(--charcoal-brown)' }}
              />
            </div>

            {/* Categories - Multi-select */}
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
                        type="button"
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

            {/* Status */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="idea">Idea</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Location Type */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-700">Location Type</label>
              <select
                value={locationType || ''}
                onChange={(e) => setLocationType(e.target.value as any || null)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Select location type</option>
                <option value="sydney">Sydney</option>
                <option value="australia">Australia</option>
                <option value="international">International</option>
              </select>
            </div>

            {/* Specific Location */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-700">Specific Location <span className="text-xs font-normal opacity-60">(optional)</span></label>
              <input
                type="text"
                value={specificLocation}
                onChange={(e) => setSpecificLocation(e.target.value)}
                placeholder="e.g., Nurburgring, Mt Fuji, Santorini"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                style={{ color: 'var(--charcoal-brown)' }}
              />
            </div>

            {/* Region */}
            {locationType === 'international' && (
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-700">Region</label>
                <select
                  value={region || ''}
                  onChange={(e) => setRegion(e.target.value as any || null)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">Select region</option>
                  <option value="Europe">🇪🇺 Europe</option>
                  <option value="Asia">🌏 Asia</option>
                  <option value="Americas">🌎 Americas</option>
                  <option value="Middle East & Africa">🌍 Middle East & Africa</option>
                  <option value="Oceania">🏝️ Oceania</option>
                </select>
              </div>
            )}

            {/* Country */}
            {locationType === 'international' && (
              <div className="relative">
                <label className="mb-2 block text-xs font-medium text-gray-700">Country</label>
                <input
                  type="text"
                  value={countryInput}
                  onChange={(e) => {
                    setCountryInput(e.target.value);
                    setCountry(e.target.value);
                  }}
                  onFocus={() => {
                    if (countryInput.trim().length > 0 && filteredCountries.length > 0) {
                      setShowCountrySuggestions(true);
                    }
                  }}
                  placeholder="e.g., Japan, Germany, Greece"
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
                          setCountry(c);
                          setCountryInput(c);
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

            {/* Year */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-700">Target Year</label>
              <select
                value={targetYear || ''}
                onChange={(e) => setTargetYear(e.target.value ? parseInt(e.target.value) : null)}
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
                value={ownership}
                onChange={(e) => setOwnership(e.target.value as any)}
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
                  checked={isPriority}
                  onChange={(e) => setIsPriority(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">⭐ Priority</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-8 pb-6 flex items-center justify-end gap-3 border-t pt-6" style={{ borderColor: 'rgba(139, 123, 114, 0.15)' }}>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-full text-sm font-bold transition-all"
              style={{
                color: 'var(--text-secondary)',
                background: 'rgba(139, 123, 114, 0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(139, 123, 114, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(139, 123, 114, 0.1)';
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || showSuccess}
              className="px-8 py-2.5 rounded-full text-sm font-bold text-white transition-all relative overflow-hidden"
              style={{
                background: showSuccess
                  ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                  : 'linear-gradient(135deg, #D4AF37 0%, #F59E0B 100%)',
                boxShadow: showSuccess
                  ? '0 4px 12px rgba(16, 185, 129, 0.4)'
                  : '0 4px 12px rgba(212, 175, 55, 0.3)',
                transform: showSuccess ? 'scale(1.05)' : 'scale(1)',
                cursor: isSubmitting || showSuccess ? 'default' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting && !showSuccess) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(212, 175, 55, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting && !showSuccess) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.3)';
                }
              }}
            >
              {showSuccess ? (
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  Added!
                </span>
              ) : isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Adding...
                </span>
              ) : (
                '✨ Add to Horizon'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

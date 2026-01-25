'use client';

import { useState, useEffect } from 'react';
import { CUISINES, Difficulty } from '@/types/database';
import { DishData } from './kitchen-view';

interface AddDishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: DishData) => Promise<void>;
}

export function AddDishModal({ isOpen, onClose, onAdd }: AddDishModalProps) {
  const [title, setTitle] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Autocomplete state
  const [showCuisineSuggestions, setShowCuisineSuggestions] = useState(false);
  const [filteredCuisines, setFilteredCuisines] = useState<string[]>([]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Filter cuisines based on input
  useEffect(() => {
    if (cuisine.trim().length > 0) {
      const filtered = CUISINES.filter(c =>
        c.toLowerCase().includes(cuisine.toLowerCase())
      );
      setFilteredCuisines(filtered);
      setShowCuisineSuggestions(filtered.length > 0);
    } else {
      setFilteredCuisines([...CUISINES]);
      setShowCuisineSuggestions(false);
    }
  }, [cuisine]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Please enter a dish name');
      return;
    }

    setIsSubmitting(true);

    const data: DishData = {
      title: title.trim(),
      cuisine: cuisine.trim() || null,
      difficulty: difficulty,
      notes: notes.trim() || null,
    };

    await onAdd(data);

    // Show success animation
    setShowSuccess(true);
    setIsSubmitting(false);

    // Wait a bit for the success animation, then reset and close
    setTimeout(() => {
      setShowSuccess(false);
      // Reset form
      setTitle('');
      setCuisine('');
      setDifficulty(null);
      setNotes('');
      onClose();
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden animate-scale-in"
        style={{
          background: 'var(--paper-cream)',
          boxShadow: '0 25px 50px -12px rgba(180, 100, 50, 0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'rgba(139, 123, 114, 0.15)' }}>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--charcoal-brown)' }}>
                <span>👨‍🍳</span>
                <span>Add Dish</span>
              </h2>
              <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                A new recipe to try
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(253, 230, 138, 0.15)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-5">
            {/* Dish Name */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-700">Dish Name *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Beef Wellington"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base font-medium focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                style={{ color: 'var(--charcoal-brown)' }}
                autoFocus
              />
            </div>

            {/* Cuisine / Style */}
            <div className="relative">
              <label className="mb-2 block text-xs font-medium text-gray-700">Style / Cuisine</label>
              <input
                type="text"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                onFocus={() => setShowCuisineSuggestions(true)}
                onBlur={() => setTimeout(() => setShowCuisineSuggestions(false), 150)}
                placeholder="e.g., French, Italian, Thai"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                style={{ color: 'var(--charcoal-brown)' }}
                autoComplete="off"
              />
              {showCuisineSuggestions && filteredCuisines.length > 0 && (
                <div
                  className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-40 overflow-y-auto"
                  style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
                >
                  {filteredCuisines.slice(0, 8).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setCuisine(c);
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

            {/* Difficulty */}
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
                    onClick={() => setDifficulty(difficulty === d.value ? null : d.value)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      difficulty === d.value
                        ? 'ring-2 ring-amber-500 bg-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    style={{
                      color: difficulty === d.value ? 'var(--charcoal-brown)' : 'var(--text-muted)',
                    }}
                  >
                    <span>{d.emoji}</span>
                    <span>{d.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-700">
                Notes <span className="font-normal opacity-60">(recipe link, tips, etc.)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste recipe link or add cooking notes..."
                rows={2}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm resize-none focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                style={{ color: 'var(--charcoal-brown)' }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 pb-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full text-sm font-bold transition-all"
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
              className="px-6 py-2 rounded-full text-sm font-bold text-white transition-all relative overflow-hidden"
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
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                'Add Dish'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

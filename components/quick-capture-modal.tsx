'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import {
  Category,
  CATEGORIES,
  LocationType,
  Actionability,
  TargetTimeframe,
  Season,
  Ownership,
  Region,
  REGIONS,
} from '@/types/database';

interface QuickCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickCaptureModal({ isOpen, onClose }: QuickCaptureModalProps) {
  const [title, setTitle] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Optional fields
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [locationType, setLocationType] = useState<LocationType | ''>('');
  const [specificLocation, setSpecificLocation] = useState('');
  const [region, setRegion] = useState<Region | ''>('');
  const [isPhysical, setIsPhysical] = useState(false);
  const [actionability, setActionability] = useState<Actionability | ''>('');
  const [targetYear, setTargetYear] = useState('');
  const [targetTimeframe, setTargetTimeframe] = useState<TargetTimeframe | ''>('');
  const [seasonality, setSeasonality] = useState<Season[]>([]);
  const [seasonNotes, setSeasonNotes] = useState('');
  const [ownership, setOwnership] = useState<Ownership>('couples');
  const [isPriority, setIsPriority] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    const supabase = createClient();

    const { error } = await supabase.from('bucket_list_items').insert({
      title: title.trim(),
      description: description.trim() || null,
      categories: categories.length > 0 ? categories : [],
      location_type: locationType || null,
      specific_location: specificLocation.trim() || null,
      region: region || null,
      is_physical: isPhysical,
      actionability: actionability || null,
      target_year: targetYear ? parseInt(targetYear) : null,
      target_timeframe: targetTimeframe || null,
      seasonality: seasonality.length > 0 ? seasonality : [],
      season_notes: seasonNotes.trim() || null,
      ownership,
      is_priority: isPriority,
    });

    setIsSubmitting(false);

    if (error) {
      console.error('Error creating item:', error);
      return;
    }

    // Reset form
    setTitle('');
    setDescription('');
    setCategories([]);
    setLocationType('');
    setSpecificLocation('');
    setRegion('');
    setIsPhysical(false);
    setActionability('');
    setTargetYear('');
    setTargetTimeframe('');
    setSeasonality([]);
    setSeasonNotes('');
    setOwnership('couples');
    setIsPriority(false);
    setShowDetails(false);
    onClose();
    router.refresh();
  };

  const toggleCategory = (category: Category) => {
    setCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleSeason = (season: Season) => {
    setSeasonality((prev) =>
      prev.includes(season) ? prev.filter((s) => s !== season) : [...prev, season]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl rounded-t-2xl bg-white sm:rounded-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">Add to Horizon</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you want to do?"
              className="w-full text-lg border-0 border-b-2 border-gray-200 px-0 py-2 focus:border-indigo-600 focus:ring-0"
              autoFocus
              required
            />
          </div>

          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-indigo-600 hover:text-indigo-700"
          >
            {showDetails ? 'Hide details' : 'Add details'}
          </button>

          {showDetails && (
            <div className="space-y-4 pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Additional context, links, notes..."
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        categories.includes(cat)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {cat.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location Type
                  </label>
                  <select
                    value={locationType}
                    onChange={(e) => setLocationType(e.target.value as LocationType | '')}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">Not specified</option>
                    <option value="sydney">Sydney</option>
                    <option value="australia">Australia</option>
                    <option value="international">International</option>
                  </select>
                </div>

                {locationType === 'international' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Region
                    </label>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value as Region | '')}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">Not specified</option>
                      {REGIONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specific Location
                  </label>
                  <input
                    type="text"
                    value={specificLocation}
                    onChange={(e) => setSpecificLocation(e.target.value)}
                    placeholder="e.g., Lake Como, Chatswood, Peru"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Actionability
                  </label>
                  <select
                    value={actionability}
                    onChange={(e) => setActionability(e.target.value as Actionability | '')}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">Not specified</option>
                    <option value="can_do_now">Can do now</option>
                    <option value="needs_planning">Needs planning</option>
                    <option value="needs_saving">Needs saving</option>
                    <option value="needs_milestone">Needs milestone</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ownership
                  </label>
                  <select
                    value={ownership}
                    onChange={(e) => setOwnership(e.target.value as Ownership)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="couples">Couples</option>
                    <option value="peter">Peter</option>
                    <option value="wife">Wife</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Timeframe
                  </label>
                  <select
                    value={targetTimeframe}
                    onChange={(e) => setTargetTimeframe(e.target.value as TargetTimeframe | '')}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">Not specified</option>
                    <option value="this_year">This year</option>
                    <option value="next_few_years">Next few years</option>
                    <option value="someday">Someday</option>
                    <option value="ongoing">Ongoing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Year
                  </label>
                  <input
                    type="number"
                    value={targetYear}
                    onChange={(e) => setTargetYear(e.target.value)}
                    placeholder="2025"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seasonality
                </label>
                <div className="flex flex-wrap gap-2">
                  {['summer', 'winter', 'spring', 'autumn', 'specific_date', 'any'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSeason(s as Season)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        seasonality.includes(s as Season)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {s.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {seasonality.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Season Notes
                  </label>
                  <input
                    type="text"
                    value={seasonNotes}
                    onChange={(e) => setSeasonNotes(e.target.value)}
                    placeholder="e.g., Day of the Dead is November, Book 6 months in advance"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              )}

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isPhysical}
                    onChange={(e) => setIsPhysical(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">Physical activity</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isPriority}
                    onChange={(e) => setIsPriority(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">Priority</span>
                </label>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || isSubmitting}
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add to Horizon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

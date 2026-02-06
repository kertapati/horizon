'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { BucketListItem, Category, CATEGORIES, REGIONS } from '@/types/database';
import Link from 'next/link';

interface ItemDetailProps {
  item: BucketListItem;
}

export function ItemDetail({ item: initialItem }: ItemDetailProps) {
  const [item, setItem] = useState(initialItem);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const router = useRouter();

  const handleArchive = async () => {
    setIsDeleting(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('bucket_list_items')
      .update({ archived: true, archived_at: new Date().toISOString() })
      .eq('id', item.id);

    if (error) {
      console.error('Error archiving item:', error);
      setIsDeleting(false);
      return;
    }

    router.push('/');
  };

  const handleMarkComplete = async (completionNotes: string) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('bucket_list_items')
      .update({
        status: 'completed',
        completed_date: new Date().toISOString().split('T')[0],
        completion_notes: completionNotes.trim() || null,
      })
      .eq('id', item.id)
      .select()
      .single();

    if (error) {
      console.error('Error marking complete:', error);
      return;
    }

    setItem(data);
    setShowCompleteModal(false);
    router.refresh();
  };

  if (showCompleteModal) {
    return <CompleteModal onComplete={handleMarkComplete} onCancel={() => setShowCompleteModal(false)} />;
  }

  if (isEditing) {
    return <EditForm item={item} onSave={(updated) => { setItem(updated); setIsEditing(false); }} onCancel={() => setIsEditing(false)} />;
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to list
      </Link>

      {/* Item card */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="space-y-6">
          {/* Title and actions */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{item.title}</h1>
              {item.is_priority && (
                <svg className="h-6 w-6 flex-shrink-0 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={handleArchive}
                disabled={isDeleting}
                className="rounded-lg px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                Archive
              </button>
            </div>
          </div>

          {/* Status badge */}
          <div>
            <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
              item.status === 'completed' ? 'bg-green-100 text-green-700' :
              item.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
              item.status === 'planned' ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {item.status.replace(/_/g, ' ')}
            </span>
          </div>

          {/* Description */}
          {item.description && (
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-2">Description</h2>
              <p className="text-gray-900 whitespace-pre-wrap">{item.description}</p>
            </div>
          )}

          {/* Categories */}
          {item.categories.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-2">Categories</h2>
              <div className="flex flex-wrap gap-2">
                {item.categories.map((cat) => (
                  <span key={cat} className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700">
                    {cat.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Location */}
          {(item.location_type || item.specific_location) && (
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-2">Location</h2>
              <div className="space-y-1">
                {item.location_type && (
                  <p className="text-gray-900">Type: {item.location_type}</p>
                )}
                {item.specific_location && (
                  <p className="text-gray-900">Place: {item.specific_location}</p>
                )}
                {item.region && (
                  <p className="text-gray-900">Region: {item.region}</p>
                )}
              </div>
            </div>
          )}

          {/* Timing */}
          {(item.target_timeframe || item.target_year || item.seasonality.length > 0) && (
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-2">Timing</h2>
              <div className="space-y-1">
                {item.target_timeframe && (
                  <p className="text-gray-900">Timeframe: {item.target_timeframe.replace(/_/g, ' ')}</p>
                )}
                {item.target_year && (
                  <p className="text-gray-900">Target year: {item.target_year}</p>
                )}
                {item.seasonality.length > 0 && (
                  <p className="text-gray-900">Season: {item.seasonality.map(s => s.replace(/_/g, ' ')).join(', ')}</p>
                )}
                {item.season_notes && (
                  <p className="text-gray-900">Notes: {item.season_notes}</p>
                )}
              </div>
            </div>
          )}

          {/* Other details */}
          <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-6">
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-1">Ownership</h2>
              <p className="text-gray-900 capitalize">{item.ownership}</p>
            </div>
            {item.actionability && (
              <div>
                <h2 className="text-sm font-medium text-gray-500 mb-1">Actionability</h2>
                <p className="text-gray-900">{item.actionability.replace(/_/g, ' ')}</p>
              </div>
            )}
            {item.is_physical && (
              <div>
                <h2 className="text-sm font-medium text-gray-500 mb-1">Type</h2>
                <p className="text-gray-900">Physical activity</p>
              </div>
            )}
          </div>

          {/* Completion info */}
          {item.status === 'completed' && (
            <div className="rounded-lg bg-green-50 p-4 border border-green-200">
              <h2 className="text-sm font-medium text-green-900 mb-2">Completed</h2>
              {item.completed_date && (
                <p className="text-sm text-green-700 mb-2">Date: {new Date(item.completed_date).toLocaleDateString()}</p>
              )}
              {item.completion_notes && (
                <p className="text-sm text-green-700 whitespace-pre-wrap">{item.completion_notes}</p>
              )}
            </div>
          )}

          {/* Mark complete button */}
          {item.status !== 'completed' && (
            <button
              onClick={() => setShowCompleteModal(true)}
              className="w-full rounded-lg bg-green-600 px-4 py-3 text-white hover:bg-green-700"
            >
              Mark as Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function CompleteModal({ onComplete, onCancel }: { onComplete: (notes: string) => void; onCancel: () => void }) {
  const [notes, setNotes] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Mark as Complete</h2>
        <p className="text-sm text-gray-600 mb-4">Add any memories or reflections about completing this item.</p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How was it? What did you learn?"
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500"
          autoFocus
        />
        <div className="flex gap-3 mt-4">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onComplete(notes)}
            className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Complete
          </button>
        </div>
      </div>
    </div>
  );
}

function EditForm({ item, onSave, onCancel }: { item: BucketListItem; onSave: (item: BucketListItem) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState(item);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const supabase = createClient();
    const { data, error } = await supabase
      .from('bucket_list_items')
      .update({
        title: formData.title,
        description: formData.description,
        categories: formData.categories,
        location_type: formData.location_type,
        specific_location: formData.specific_location,
        region: formData.region,
        is_physical: formData.is_physical,
        actionability: formData.actionability,
        target_year: formData.target_year,
        target_timeframe: formData.target_timeframe,
        seasonality: formData.seasonality,
        season_notes: formData.season_notes,
        ownership: formData.ownership,
        is_priority: formData.is_priority,
        status: formData.status,
      })
      .eq('id', item.id)
      .select()
      .single();

    setIsSaving(false);

    if (error) {
      console.error('Error updating item:', error);
      return;
    }

    onSave(data);
  };

  const toggleCategory = (category: Category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to list
      </Link>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Edit Item</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    formData.categories.includes(cat)
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="idea">Idea</option>
                <option value="planned">Planned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ownership</label>
              <select
                value={formData.ownership}
                onChange={(e) => setFormData({ ...formData, ownership: e.target.value as any })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="couples">Couples</option>
                <option value="peter">Peter</option>
                <option value="wife">Wife</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_physical}
                onChange={(e) => setFormData({ ...formData, is_physical: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Physical activity</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_priority}
                onChange={(e) => setFormData({ ...formData, is_priority: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Priority</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </form>
  );
}

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

interface YearManifestoProps {
  year: number;
}

export function YearManifesto({ year }: YearManifestoProps) {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch note for the current year
  useEffect(() => {
    const fetchNote = async () => {
      setIsLoading(true);
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('year_notes')
          .select('content')
          .eq('user_id', user.id)
          .eq('year', year)
          .single();

        if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
          // PGRST116 = no rows returned (expected if no note exists yet)
          // 42P01 = table doesn't exist (silently ignore)
          console.error('Error fetching year note:', error.message || error);
        }

        setContent(data?.content || '');
      } catch (err) {
        // Silently ignore if table doesn't exist
        console.debug('Year notes not available:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNote();
  }, [year]);

  // Auto-save with debounce
  const saveNote = useCallback(async (newContent: string) => {
    setIsSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setIsSaving(false);
        return;
      }

      // Upsert: insert or update based on user_id + year
      const { error } = await supabase
        .from('year_notes')
        .upsert(
          {
            user_id: user.id,
            year: year,
            content: newContent,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'user_id,year',
          }
        );

      if (error && error.code !== '42P01') {
        // 42P01 = table doesn't exist, silently ignore
        console.error('Error saving year note:', error);
      } else if (!error) {
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 2000);
      }
    } catch (err) {
      // Silently ignore if table doesn't exist
      console.debug('Year notes save not available:', err);
    } finally {
      setIsSaving(false);
    }
  }, [year]);

  // Handle content change with debounced save
  const handleContentChange = (newContent: string) => {
    setContent(newContent);

    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for auto-save (1 second after last keystroke)
    saveTimeoutRef.current = setTimeout(() => {
      saveNote(newContent);
    }, 1000);
  };

  // Save on blur as well
  const handleBlur = () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveNote(content);
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current && isExpanded) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(200, textareaRef.current.scrollHeight)}px`;
    }
  }, [content, isExpanded]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const placeholderText = `What's your vision for ${year}?

Write freely about your aspirations, strategies, themes, or intentions for this year. This is your space to think big picture...

• What does success look like?
• What themes or principles guide you?
• What do you want to feel at the end of the year?`;

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: '#FDFCF8',
        boxShadow: '0 2px 8px rgba(139, 123, 114, 0.1)',
        border: '1px solid rgba(139, 123, 114, 0.15)',
      }}
    >
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 flex items-center justify-between text-left transition-colors hover:bg-white/50"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">📜</span>
          <div>
            <h3
              className="font-serif text-lg font-bold"
              style={{ color: 'var(--charcoal-brown)' }}
            >
              {year} Strategy
            </h3>
            {!isExpanded && content && (
              <p
                className="text-xs mt-0.5 line-clamp-1 max-w-md"
                style={{ color: 'var(--text-muted)' }}
              >
                {content.split('\n')[0]}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Save indicator */}
          <div className="flex items-center gap-2">
            {isSaving && (
              <span
                className="text-xs flex items-center gap-1"
                style={{ color: 'var(--text-muted)' }}
              >
                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </span>
            )}
            {showSaved && !isSaving && (
              <span
                className="text-xs flex items-center gap-1 text-green-600 animate-fade-in"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Saved
              </span>
            )}
          </div>

          {/* Expand/collapse chevron */}
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            style={{ color: 'var(--text-muted)' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expandable content */}
      {isExpanded && (
        <div className="px-5 pb-5">
          {isLoading ? (
            <div
              className="h-32 flex items-center justify-center"
              style={{ color: 'var(--text-muted)' }}
            >
              Loading...
            </div>
          ) : (
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                onBlur={handleBlur}
                placeholder={placeholderText}
                className="w-full min-h-[200px] p-4 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(139, 123, 114, 0.15)',
                  color: 'var(--charcoal-brown)',
                  fontFamily: "'Georgia', serif",
                  fontSize: '15px',
                  lineHeight: '32px',
                  // Lined paper effect
                  backgroundImage: `repeating-linear-gradient(
                    transparent,
                    transparent 31px,
                    rgba(59, 130, 246, 0.06) 31px,
                    rgba(59, 130, 246, 0.06) 32px
                  )`,
                  backgroundPosition: '0 8px',
                }}
              />

              {/* Red margin line decoration */}
              <div
                className="absolute top-0 bottom-0 left-12 w-px pointer-events-none"
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                }}
              />
            </div>
          )}

          {/* Footer hint */}
          <p
            className="mt-3 text-xs text-center"
            style={{ color: 'var(--text-muted)' }}
          >
            Auto-saves as you type
          </p>
        </div>
      )}
    </div>
  );
}

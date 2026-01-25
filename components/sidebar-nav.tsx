'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Profile } from '@/types/database';

type ViewMode = 'all' | 'category' | 'travel' | 'life' | 'year' | 'ownership' | 'restaurants' | 'kitchen' | 'in_progress' | 'completed';

interface SidebarNavProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onRegionSelect?: (region: string) => void;
  profile: Profile | null;
}

export function SidebarNav({ currentView, onViewChange, onRegionSelect, profile }: SidebarNavProps) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <aside
      className={`flex-shrink-0 border-r glass-effect transition-all duration-200 ${
        collapsed ? 'w-12' : 'w-48'
      }`}
      style={{ borderColor: 'rgba(139, 123, 114, 0.2)' }}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className={`flex h-12 items-center border-b ${collapsed ? 'justify-center px-2' : 'justify-between px-4'}`} style={{ borderColor: 'rgba(139, 123, 114, 0.15)' }}>
          {!collapsed && (
            <h1 className="text-xl font-serif" style={{ color: 'var(--charcoal-brown)' }}>Horizon</h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center p-1 rounded transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(253, 230, 138, 0.15)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <svg
              className={`h-4 w-4 transition-transform ${collapsed ? '' : 'rotate-180'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto py-4">
          <NavItem
            icon="🏠"
            label="Overview"
            active={currentView === 'all'}
            collapsed={collapsed}
            onClick={() => onViewChange('all')}
          />

          <NavItem
            icon="📁"
            label="Categories"
            active={currentView === 'category'}
            collapsed={collapsed}
            onClick={() => onViewChange('category')}
          />

          <NavItem
            icon="✈️"
            label="Travel"
            active={currentView === 'travel'}
            collapsed={collapsed}
            onClick={() => onViewChange('travel')}
          />

          <NavItem
            icon="🏡"
            label="Life"
            active={currentView === 'life'}
            collapsed={collapsed}
            onClick={() => onViewChange('life')}
          />

          <NavItem
            icon="📅"
            label="Year"
            active={currentView === 'year'}
            collapsed={collapsed}
            onClick={() => onViewChange('year')}
          />

          <NavItem
            icon="👥"
            label="Ownership"
            active={currentView === 'ownership'}
            collapsed={collapsed}
            onClick={() => onViewChange('ownership')}
          />

          <div className="my-2 border-t" style={{ borderColor: 'rgba(139, 123, 114, 0.15)' }} />

          {/* Gastronomy Module */}
          <NavItem
            icon="🍽️"
            label="Restaurants"
            active={currentView === 'restaurants'}
            collapsed={collapsed}
            onClick={() => onViewChange('restaurants')}
          />

          <NavItem
            icon="👨‍🍳"
            label="Kitchen"
            active={currentView === 'kitchen'}
            collapsed={collapsed}
            onClick={() => onViewChange('kitchen')}
          />

          <div className="my-2 border-t" style={{ borderColor: 'rgba(139, 123, 114, 0.15)' }} />

          <NavItem
            icon="🔄"
            label="In Progress"
            active={currentView === 'in_progress'}
            collapsed={collapsed}
            onClick={() => onViewChange('in_progress')}
          />

          <NavItem
            icon="✅"
            label="Completed"
            active={currentView === 'completed'}
            collapsed={collapsed}
            onClick={() => onViewChange('completed')}
          />
        </nav>

        {/* User Profile & Sign Out */}
        {!collapsed && profile && (
          <div className="border-t p-3" style={{ borderColor: 'rgba(139, 123, 114, 0.15)' }}>
            <div className="mb-2 text-xs font-semibold truncate" style={{ color: 'var(--charcoal-brown)' }}>{profile.display_name}</div>
            <button
              onClick={handleSignOut}
              className="w-full text-left text-xs rounded px-2 py-1 transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(253, 230, 138, 0.15)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
            >
              Sign out
            </button>
          </div>
        )}

        {/* Collapsed user icon */}
        {collapsed && profile && (
          <div className="border-t p-2 flex justify-center" style={{ borderColor: 'rgba(139, 123, 114, 0.15)' }}>
            <button
              onClick={handleSignOut}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded p-1"
              title={`${profile.display_name} - Sign out`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

function NavItem({
  icon,
  label,
  active,
  collapsed,
  onClick,
}: {
  icon: string;
  label: string;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-3 py-2 text-sm font-semibold transition-all rounded-r-lg ${
        collapsed ? 'justify-center' : ''
      } ${active ? 'highlighter-active' : ''}`}
      style={{
        color: active ? 'var(--charcoal-brown)' : 'var(--text-secondary)',
        marginLeft: collapsed ? '0' : '8px',
        marginRight: '8px',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'rgba(253, 230, 138, 0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'transparent';
        }
      }}
    >
      <span className="text-base">{icon}</span>
      {!collapsed && <span>{label}</span>}
    </button>
  );
}

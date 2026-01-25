'use client';

import { useState } from 'react';

type Density = 'compact' | 'comfortable' | 'table';

interface CompactHeaderProps {
  title: string;
  itemCount: number;
  totalItems: number;
  completedItems: number;
  items2026: number;
  density: Density;
  onDensityChange: (density: Density) => void;
  onSearch?: (query: string) => void;
  onAdd?: () => void;
}

export function CompactHeader({
  title,
  itemCount,
  totalItems,
  completedItems,
  items2026,
  density,
  onDensityChange,
  onSearch,
  onAdd,
}: CompactHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const completionPercentage = Math.round((completedItems / totalItems) * 100);

  return (
    <header className="flex h-14 items-center justify-between border-b glass-effect px-6" style={{ borderColor: 'rgba(139, 123, 114, 0.15)' }}>
      {/* Left: Title and count */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-serif" style={{ color: 'var(--charcoal-brown)' }}>{title}</h1>
        <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{itemCount} items</span>
      </div>

      {/* Center: Inline stats */}
      <div className="hidden md:flex items-center gap-6">
        <InlineStat value={totalItems} label="total" />
        <StatDivider />
        <InlineStat value={completedItems} label="done" highlight="green" percentage={completionPercentage} />
        <StatDivider />
        <InlineStat value={items2026} label="2026" highlight="indigo" />
      </div>

      {/* Right: Search, density toggle, add button */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden lg:block">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-64 rounded-lg py-1.5 pl-9 pr-3 text-sm font-medium transition-all"
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid rgba(139, 123, 114, 0.2)',
              color: 'var(--charcoal-brown)',
            }}
          />
          <svg
            className="absolute left-3 top-2 h-4 w-4"
            style={{ color: 'var(--text-muted)' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Density toggle */}
        <div className="hidden sm:flex items-center gap-1 rounded-md border border-gray-300 p-0.5">
          <DensityButton
            active={density === 'compact'}
            onClick={() => onDensityChange('compact')}
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            }
            title="Compact list"
          />
          <DensityButton
            active={density === 'comfortable'}
            onClick={() => onDensityChange('comfortable')}
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            }
            title="Grid view"
          />
          <DensityButton
            active={density === 'table'}
            onClick={() => onDensityChange('table')}
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            }
            title="Table view"
          />
        </div>

        {/* Add button */}
        <button
          onClick={onAdd}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          + Add
        </button>
      </div>
    </header>
  );
}

function InlineStat({
  value,
  label,
  highlight,
  percentage,
}: {
  value: number;
  label: string;
  highlight?: 'green' | 'indigo';
  percentage?: number;
}) {
  const colors = {
    green: 'text-green-700',
    indigo: 'text-indigo-700',
  };

  const textColor = highlight ? colors[highlight] : 'text-gray-900';

  return (
    <div className="flex flex-col items-center">
      <div className={`text-lg font-semibold ${textColor}`}>
        {value}
        {percentage !== undefined && (
          <span className="ml-1 text-xs font-normal text-gray-500">({percentage}%)</span>
        )}
      </div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}

function StatDivider() {
  return <div className="h-8 w-px bg-gray-200" />;
}

function DensityButton({
  active,
  onClick,
  icon,
  title,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`rounded p-1.5 transition-colors ${
        active
          ? 'bg-indigo-100 text-indigo-700'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {icon}
    </button>
  );
}

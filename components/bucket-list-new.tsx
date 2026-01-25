'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { BucketListItem, Category, Region } from '@/types/database';
import { ItemCard } from './item-card';
import {
  getCategoryStats,
  getTravelStats,
  getYearStats,
  getOwnershipStats,
  getInsights
} from '@/lib/bucket-list-stats';
import { categoryConfig, regionConfig, ownershipConfig } from '@/lib/category-config';

type ViewMode = 'all' | 'category' | 'location' | 'year' | 'ownership';

export function BucketListNew() {
  const [items, setItems] = useState<BucketListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('all');

  // View-specific state
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedContinent, setSelectedContinent] = useState<Region | 'sydney' | 'australia' | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState<'sydney' | 'australia' | 'international'>('sydney');
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(2026);
  const [selectedOwnership, setSelectedOwnership] = useState<'couples' | 'peter' | 'xi'>('couples');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const supabase = createClient();

    const { data: { session } } = await supabase.auth.getSession();
    console.log('BucketList - Session:', session ? 'authenticated' : 'not authenticated');

    const { data, error } = await supabase
      .from('bucket_list_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching items:', error);
    } else {
      console.log('BucketList - Fetched items:', data?.length || 0);
      setItems(data || []);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading your horizon...</div>
      </div>
    );
  }

  const insights = getInsights(items);
  const categoryStats = getCategoryStats(items);
  const travelStats = getTravelStats(items);
  const yearStats = getYearStats(items);
  const ownershipStats = getOwnershipStats(items);

  return (
    <div className="space-y-6">
      {/* View Mode Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-gray-200 pb-2">
        {(['all', 'category', 'location', 'year', 'ownership'] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
              viewMode === mode
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {mode === 'year' ? 'Year' : mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      {/* All/Dashboard View */}
      {viewMode === 'all' && (
        <AllView
          items={items}
          insights={insights}
          categoryStats={categoryStats}
          travelStats={travelStats}
        />
      )}

      {/* Category View */}
      {viewMode === 'category' && (
        <CategoryView
          items={items}
          categoryStats={categoryStats}
          travelStats={travelStats}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedContinent={selectedContinent}
          setSelectedContinent={setSelectedContinent}
        />
      )}

      {/* Location View */}
      {viewMode === 'location' && (
        <LocationView
          items={items}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
        />
      )}

      {/* Year View */}
      {viewMode === 'year' && (
        <YearView
          yearStats={yearStats}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />
      )}

      {/* Ownership View */}
      {viewMode === 'ownership' && (
        <OwnershipView
          ownershipStats={ownershipStats}
          selectedOwnership={selectedOwnership}
          setSelectedOwnership={setSelectedOwnership}
        />
      )}
    </div>
  );
}

// All/Dashboard View Component
function AllView({ items, insights, categoryStats, travelStats }: any) {
  return (
    <div className="space-y-8">
      {/* Hero Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Goals" value={insights.totalItems} />
        <StatCard
          label="Completed"
          value={insights.completedItems}
          subtitle={`${insights.completionPercentage}%`}
          color="green"
        />
        <StatCard label="In Progress" value={items.filter((i: BucketListItem) => i.status === 'in_progress').length} color="yellow" />
        <StatCard label="2026 Priorities" value={insights.items2026.length} color="indigo" highlight />
      </div>

      {/* Travel Section - Prominent */}
      <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-blue-900">
              ✈️ Travel & Places
            </h2>
            <p className="text-sm text-blue-700">
              {travelStats.completed} / {travelStats.total} completed
            </p>
          </div>
          <div className="h-2 w-32 overflow-hidden rounded-full bg-blue-200">
            <div
              className="h-full bg-blue-600"
              style={{ width: `${(travelStats.completed / travelStats.total) * 100}%` }}
            />
          </div>
        </div>

        {/* Continent Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
          <ContinentCard label="Sydney" icon="🏙️" count={travelStats.byRegion.sydney.length} />
          <ContinentCard label="Australia" icon="🦘" count={travelStats.byRegion.australia.length} />
          <ContinentCard label="Europe" icon="🇪🇺" count={travelStats.byRegion.europe.length} />
          <ContinentCard label="Asia" icon="🌏" count={travelStats.byRegion.asia.length} />
          <ContinentCard label="Americas" icon="🌎" count={travelStats.byRegion.americas.length} />
          <ContinentCard label="MEA" icon="🌍" count={travelStats.byRegion.middleEastAfrica.length} />
          <ContinentCard label="Oceania" icon="🏝️" count={travelStats.byRegion.oceania.length} />
        </div>
      </div>

      {/* Other Categories Grid */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Categories</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Object.entries(categoryStats)
            .filter(([key]) => key !== 'travel')
            .filter(([_, stats]: [string, any]) => stats.total > 0)
            .map(([key, stats]: [string, any]) => {
              const config = categoryConfig[key as Category];
              return (
                <CategoryCard
                  key={key}
                  icon={config.icon}
                  name={config.displayName}
                  total={stats.total}
                  completed={stats.completed}
                  color={config.color}
                />
              );
            })}
        </div>
      </div>

      {/* 2026 Priorities */}
      {insights.items2026.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">🎯 2026 Priorities</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {insights.items2026.slice(0, 6).map((item: BucketListItem) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Can Do Now in Sydney */}
      {insights.canDoNowSydney.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">🟢 Do Now in Sydney</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {insights.canDoNowSydney.slice(0, 6).map((item: BucketListItem) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Recently Completed */}
      {insights.recentlyCompleted.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">✅ Recently Completed</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {insights.recentlyCompleted.slice(0, 6).map((item: BucketListItem) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Category View Component
function CategoryView({ items, categoryStats, travelStats, selectedCategory, setSelectedCategory, selectedContinent, setSelectedContinent }: any) {
  const travelItems = items.filter((i: BucketListItem) => i.categories.includes('travel'));

  let filteredTravelItems = travelItems;
  if (selectedContinent !== 'all') {
    if (selectedContinent === 'sydney') {
      filteredTravelItems = travelStats.byRegion.sydney;
    } else if (selectedContinent === 'australia') {
      filteredTravelItems = travelStats.byRegion.australia;
    } else {
      filteredTravelItems = travelItems.filter((i: BucketListItem) => i.region === selectedContinent);
    }
  }

  return (
    <div className="space-y-8">
      {/* TRAVEL SECTION - Large and Prominent */}
      <div className="rounded-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="mb-2 text-3xl font-bold text-blue-900">✈️ Travel & Places</h2>
            <p className="text-blue-700">
              {travelStats.completed} / {travelStats.total} completed ({Math.round((travelStats.completed / travelStats.total) * 100)}%)
            </p>
          </div>
        </div>

        {/* Continent Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedContinent('all')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              selectedContinent === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-900 hover:bg-blue-100'
            }`}
          >
            All ({travelStats.total})
          </button>
          <button
            onClick={() => setSelectedContinent('sydney')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              selectedContinent === 'sydney'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-900 hover:bg-blue-100'
            }`}
          >
            🏙️ Sydney ({travelStats.byRegion.sydney.length})
          </button>
          <button
            onClick={() => setSelectedContinent('australia')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              selectedContinent === 'australia'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-900 hover:bg-blue-100'
            }`}
          >
            🦘 Australia ({travelStats.byRegion.australia.length})
          </button>
          <button
            onClick={() => setSelectedContinent('Europe')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              selectedContinent === 'Europe'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-900 hover:bg-blue-100'
            }`}
          >
            🇪🇺 Europe ({travelStats.byRegion.europe.length})
          </button>
          <button
            onClick={() => setSelectedContinent('Asia')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              selectedContinent === 'Asia'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-900 hover:bg-blue-100'
            }`}
          >
            🌏 Asia ({travelStats.byRegion.asia.length})
          </button>
          <button
            onClick={() => setSelectedContinent('Americas')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              selectedContinent === 'Americas'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-900 hover:bg-blue-100'
            }`}
          >
            🌎 Americas ({travelStats.byRegion.americas.length})
          </button>
          <button
            onClick={() => setSelectedContinent('Middle East & Africa')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              selectedContinent === 'Middle East & Africa'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-900 hover:bg-blue-100'
            }`}
          >
            🌍 MEA ({travelStats.byRegion.middleEastAfrica.length})
          </button>
          <button
            onClick={() => setSelectedContinent('Oceania')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              selectedContinent === 'Oceania'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-900 hover:bg-blue-100'
            }`}
          >
            🏝️ Oceania ({travelStats.byRegion.oceania.length})
          </button>
        </div>

        {/* Travel Items Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTravelItems.map((item: BucketListItem) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* OTHER CATEGORIES */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Other Categories</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(categoryStats)
            .filter(([key]) => key !== 'travel')
            .filter(([_, stats]: [string, any]) => stats.total > 0)
            .map(([key, stats]: [string, any]) => {
              const config = categoryConfig[key as Category];
              const isExpanded = selectedCategory === key;

              return (
                <div key={key} className="rounded-lg border border-gray-200 bg-white">
                  <button
                    onClick={() => setSelectedCategory(isExpanded ? null : key as Category)}
                    className="w-full p-4 text-left hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{config.icon}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900">{config.displayName}</h4>
                          <p className="text-sm text-gray-600">
                            {stats.completed} / {stats.total} completed
                          </p>
                        </div>
                      </div>
                      <svg
                        className={`h-5 w-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-gray-200 p-4">
                      <div className="space-y-3">
                        {stats.items.map((item: BucketListItem) => (
                          <div key={item.id} className="text-sm">
                            <a href={`/items/${item.id}`} className="text-indigo-600 hover:text-indigo-700">
                              {item.title}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

// Location View Component
function LocationView({ items, selectedLocation, setSelectedLocation, selectedRegion, setSelectedRegion }: any) {
  const sydneyItems = items.filter((i: BucketListItem) => i.location_type === 'sydney');
  const australiaItems = items.filter((i: BucketListItem) => i.location_type === 'australia');
  const internationalItems = items.filter((i: BucketListItem) => i.location_type === 'international');

  const canDoNowSydney = sydneyItems.filter((i: BucketListItem) =>
    i.actionability === 'can_do_now' && i.status !== 'completed'
  );

  let displayItems = sydneyItems;
  if (selectedLocation === 'australia') {
    displayItems = australiaItems;
  } else if (selectedLocation === 'international') {
    if (selectedRegion) {
      displayItems = internationalItems.filter((i: BucketListItem) => i.region === selectedRegion);
    } else {
      displayItems = internationalItems;
    }
  }

  return (
    <div className="space-y-6">
      {/* Location Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedLocation('sydney')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            selectedLocation === 'sydney'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          }`}
        >
          🏙️ Sydney ({sydneyItems.length})
        </button>
        <button
          onClick={() => setSelectedLocation('australia')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            selectedLocation === 'australia'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          }`}
        >
          🦘 Australia ({australiaItems.length})
        </button>
        <button
          onClick={() => {
            setSelectedLocation('international');
            setSelectedRegion(null);
          }}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            selectedLocation === 'international'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          }`}
        >
          🌏 International ({internationalItems.length})
        </button>
      </div>

      {/* Sydney - Highlight Can Do Now */}
      {selectedLocation === 'sydney' && canDoNowSydney.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold text-green-900">🟢 Can Do Now</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {canDoNowSydney.map((item: BucketListItem) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* International - Region Tabs */}
      {selectedLocation === 'international' && (
        <div className="flex flex-wrap gap-2">
          {(['Europe', 'Asia', 'Americas', 'Middle East & Africa', 'Oceania'] as Region[]).map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                selectedRegion === region
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {regionConfig[region].icon} {region} ({internationalItems.filter((i: BucketListItem) => i.region === region).length})
            </button>
          ))}
        </div>
      )}

      {/* Items Grid */}
      <div>
        <div className="mb-4 text-sm text-gray-600">{displayItems.length} items</div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayItems.map((item: BucketListItem) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Year View Component
function YearView({ yearStats, selectedYear, setSelectedYear }: any) {
  const years = [2026, 2027, 2028, null] as const;
  const displayItems = selectedYear ? yearStats[selectedYear] : yearStats.unassigned;

  return (
    <div className="space-y-6">
      {/* Year Tabs */}
      <div className="flex gap-2">
        {years.map((year) => {
          const count = year ? yearStats[year].length : yearStats.unassigned.length;
          return (
            <button
              key={year ?? 'unassigned'}
              onClick={() => setSelectedYear(year)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                selectedYear === year
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {year ?? 'Unassigned'} ({count})
            </button>
          );
        })}
      </div>

      {/* Year Content */}
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {selectedYear ? `${selectedYear} Goals` : 'Unassigned Goals'}
          </h3>
          <p className="text-sm text-gray-600">{displayItems.length} items</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayItems.map((item: BucketListItem) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Ownership View Component
function OwnershipView({ ownershipStats, selectedOwnership, setSelectedOwnership }: any) {
  const displayItems = ownershipStats[selectedOwnership];

  return (
    <div className="space-y-6">
      {/* Ownership Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedOwnership('couples')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            selectedOwnership === 'couples'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          }`}
        >
          👫 Couples ({ownershipStats.couples.length})
        </button>
        <button
          onClick={() => setSelectedOwnership('peter')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            selectedOwnership === 'peter'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          }`}
        >
          👤 Peter ({ownershipStats.peter.length})
        </button>
        <button
          onClick={() => setSelectedOwnership('xi')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            selectedOwnership === 'xi'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          }`}
        >
          👤 Xi ({ownershipStats.xi.length})
        </button>
      </div>

      {/* Items Grid */}
      <div>
        <div className="mb-4 text-sm text-gray-600">{displayItems.length} items</div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayItems.map((item: BucketListItem) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper Components
function StatCard({ label, value, subtitle, color = 'gray', highlight = false }: any) {
  const colors = {
    gray: 'bg-gray-50 text-gray-900',
    green: 'bg-green-50 text-green-900',
    yellow: 'bg-yellow-50 text-yellow-900',
    indigo: 'bg-indigo-50 text-indigo-900',
  };

  return (
    <div className={`rounded-lg p-4 ${colors[color as keyof typeof colors]} ${highlight ? 'ring-2 ring-indigo-500' : ''}`}>
      <p className="text-sm font-medium opacity-75">{label}</p>
      <p className="mt-1 text-3xl font-bold">{value}</p>
      {subtitle && <p className="mt-1 text-sm opacity-75">{subtitle}</p>}
    </div>
  );
}

function ContinentCard({ label, icon, count }: any) {
  return (
    <div className="rounded-lg bg-white p-3 text-center shadow-sm">
      <div className="text-2xl">{icon}</div>
      <div className="mt-1 text-xs font-medium text-gray-600">{label}</div>
      <div className="text-sm font-bold text-gray-900">{count}</div>
    </div>
  );
}

function CategoryCard({ icon, name, total, completed, color }: any) {
  return (
    <div
      className="rounded-lg p-4"
      style={{ backgroundColor: color.bg }}
    >
      <div className="flex items-start justify-between">
        <span className="text-2xl">{icon}</span>
        <div className="text-right">
          <p className="text-sm font-medium" style={{ color: color.text }}>{name}</p>
          <p className="text-xs" style={{ color: color.text }}>
            {completed} / {total}
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { BucketListItem, Region, Profile, Category } from '@/types/database';
import { CompactListItem } from './compact-list-item';
import { TableView } from './table-view';
import { ItemCard } from './item-card';
import { SidebarNav } from './sidebar-nav';
import { CompactHeader } from './compact-header';
import { DetailPanel } from './detail-panel';
import { TravelView } from './travel-view';
import { LifeView } from './life-view';
import { CategoryView } from './category-view';
import { AddItemModal, NewItemData } from './add-item-modal';
import { GroupedByCategoryView } from './grouped-by-category-view';
import { RestaurantsView } from './restaurants-view';
import { KitchenView } from './kitchen-view';
import {
  getTravelStats,
  getYearStats,
  getOwnershipStats,
  getInsights
} from '@/lib/bucket-list-stats';
import { categoryConfig } from '@/lib/category-config';

type ViewMode = 'all' | 'category' | 'travel' | 'life' | 'year' | 'ownership' | 'restaurants' | 'kitchen' | 'in_progress' | 'completed';
type Density = 'compact' | 'comfortable' | 'table';

export function BucketListOptimized() {
  const [items, setItems] = useState<BucketListItem[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [density, setDensity] = useState<Density>('compact');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<BucketListItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // View-specific state
  const [selectedContinent, setSelectedContinent] = useState<Region | 'sydney' | 'australia' | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState<'sydney' | 'australia' | 'international'>('sydney');
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(2026);
  const [selectedOwnership, setSelectedOwnership] = useState<'couples' | 'peter' | 'xi'>('couples');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedCategoryInProgress, setSelectedCategoryInProgress] = useState<Category | null>(null);
  const [selectedCategoryCompleted, setSelectedCategoryCompleted] = useState<Category | null>(null);

  useEffect(() => {
    fetchItems();
    fetchProfile();
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

  const fetchProfile = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(data);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading your horizon...</div>
      </div>
    );
  }

  const insights = getInsights(items);
  const travelStats = getTravelStats(items);
  const yearStats = getYearStats(items);
  const ownershipStats = getOwnershipStats(items);

  // Filter items based on view and search
  let filteredItems = items;

  // Search filter
  if (searchQuery) {
    filteredItems = filteredItems.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.specific_location?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // View-specific filters
  if (viewMode === 'completed') {
    // Completed view shows only completed items
    filteredItems = filteredItems.filter(i => i.status === 'completed');
    if (selectedCategoryCompleted) {
      filteredItems = filteredItems.filter(i => i.categories.includes(selectedCategoryCompleted));
    }
  } else if (viewMode === 'in_progress') {
    // In Progress view shows only in_progress items
    filteredItems = filteredItems.filter(i => i.status === 'in_progress');
    if (selectedCategoryInProgress) {
      filteredItems = filteredItems.filter(i => i.categories.includes(selectedCategoryInProgress));
    }
  } else {
    // All other views exclude only completed items (in_progress items should still show)
    filteredItems = filteredItems.filter(i => i.status !== 'completed');

    if (viewMode === 'all' && selectedCategory) {
      // Overview with category filter
      filteredItems = filteredItems.filter(i => i.categories.includes(selectedCategory));
    } else if (viewMode === 'travel') {
      // Travel view shows all travel items
      filteredItems = filteredItems.filter(i => i.categories.includes('travel'));
    } else if (viewMode === 'life') {
      // Life view shows all non-travel items
      filteredItems = filteredItems.filter(i => !i.categories.includes('travel'));
    } else if (viewMode === 'year') {
      filteredItems = selectedYear ? yearStats[selectedYear] : yearStats.unassigned;
    } else if (viewMode === 'ownership') {
      filteredItems = ownershipStats[selectedOwnership];
    }
  }

  const getViewTitle = () => {
    switch (viewMode) {
      case 'all': return 'Overview';
      case 'category': return 'Categories';
      case 'travel': return 'Travel & Places';
      case 'life': return 'Life & Projects';
      case 'year': return selectedYear ? `${selectedYear} Goals` : 'Unassigned';
      case 'ownership': return selectedOwnership === 'couples' ? 'Couples' : selectedOwnership === 'peter' ? 'Peter' : 'Xi';
      case 'restaurants': return 'Restaurants';
      case 'kitchen': return 'Kitchen';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return 'Horizon';
    }
  };

  const handleItemClick = (item: BucketListItem) => {
    setSelectedItem(item);
  };

  const handleAddItem = () => {
    setShowAddModal(true);
  };

  const handleAddItemSubmit = async (data: NewItemData) => {
    console.log('New item data:', data);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        console.error('No authenticated user');
        return;
      }

      const { error } = await supabase
        .from('bucket_list_items')
        .insert({
          title: data.title,
          description: data.description,
          categories: data.categories,
          status: data.status,
          location_type: data.location_type,
          specific_location: data.specific_location,
          region: data.region,
          country: data.country,
          target_year: data.target_year,
          ownership: data.ownership,
          is_priority: data.is_priority,
          added_by: user.id,
          // Default values for other fields
          is_physical: true,
          actionability: null,
          target_timeframe: null,
          seasonality: [],
          season_notes: null,
          completed_date: null,
          completion_notes: null,
          related_item_ids: [],
          // Gastronomy fields
          gastronomy_type: data.gastronomy_type,
          cuisine: data.cuisine,
          neighborhood: data.neighborhood,
          price_level: data.price_level,
          difficulty: data.difficulty,
          notes: data.notes,
        });

      if (error) {
        console.error('Error adding item:', error);
        alert('Failed to add item. Please try again.');
      } else {
        console.log('Item added successfully');
        fetchItems(); // Refresh the list
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('Failed to add item. Please try again.');
    }
  };

  const handleRegionSelect = (region: string) => {
    if (region === 'sydney' || region === 'australia') {
      setSelectedContinent(region);
    } else {
      setSelectedContinent(region as Region);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar Navigation */}
      <SidebarNav
        currentView={viewMode}
        onViewChange={setViewMode}
        onRegionSelect={handleRegionSelect}
        profile={profile}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Compact Header */}
        <CompactHeader
          title={getViewTitle()}
          itemCount={filteredItems.length}
          totalItems={items.length}
          completedItems={insights.completedItems}
          items2026={insights.items2026.length}
          density={density}
          onDensityChange={setDensity}
          onSearch={setSearchQuery}
          onAdd={handleAddItem}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50">

          {/* Category filter buttons for Overview */}
          {viewMode === 'all' && (
            <div className="border-b glass-effect px-3 sm:px-6 py-3" style={{ borderColor: 'rgba(139, 123, 114, 0.15)' }}>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    selectedCategory === null
                      ? 'highlighter-active'
                      : 'card-warm card-warm-hover'
                  }`}
                  style={{
                    color: selectedCategory === null ? 'var(--charcoal-brown)' : 'var(--text-secondary)'
                  }}
                >
                  All
                </button>
                {(Object.keys(categoryConfig) as Category[]).map((cat) => {
                  const config = categoryConfig[cat];
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${config.watercolorClass} ${
                        isSelected
                          ? 'ring-2 ring-offset-1'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                      style={{
                        ...(isSelected && { boxShadow: `0 0 0 2px ${config.color.border}` })
                      }}
                    >
                      <span>{config.icon}</span>
                      <span className="hidden sm:inline">{config.displayName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Year tabs */}
          {viewMode === 'year' && (
            <div className="border-b border-gray-200 bg-white px-3 sm:px-6 py-3">
              <div className="flex gap-2">
                <RegionTab
                  label="2026"
                  count={yearStats[2026].length}
                  active={selectedYear === 2026}
                  onClick={() => setSelectedYear(2026)}
                />
                <RegionTab
                  label="2027"
                  count={yearStats[2027].length}
                  active={selectedYear === 2027}
                  onClick={() => setSelectedYear(2027)}
                />
                <RegionTab
                  label="2028"
                  count={yearStats[2028].length}
                  active={selectedYear === 2028}
                  onClick={() => setSelectedYear(2028)}
                />
                <RegionTab
                  label="Unassigned"
                  count={yearStats.unassigned.length}
                  active={selectedYear === null}
                  onClick={() => setSelectedYear(null)}
                />
              </div>
            </div>
          )}

          {/* Ownership tabs */}
          {viewMode === 'ownership' && (
            <div className="border-b border-gray-200 bg-white px-3 sm:px-6 py-3">
              <div className="flex gap-2">
                <RegionTab
                  label="👫 Couples"
                  count={ownershipStats.couples.length}
                  active={selectedOwnership === 'couples'}
                  onClick={() => setSelectedOwnership('couples')}
                />
                <RegionTab
                  label="👤 Peter"
                  count={ownershipStats.peter.length}
                  active={selectedOwnership === 'peter'}
                  onClick={() => setSelectedOwnership('peter')}
                />
                <RegionTab
                  label="👤 Xi"
                  count={ownershipStats.xi.length}
                  active={selectedOwnership === 'xi'}
                  onClick={() => setSelectedOwnership('xi')}
                />
              </div>
            </div>
          )}

          {/* View-specific content */}
          <div className="p-3 sm:p-6">
            {viewMode === 'category' ? (
              <CategoryView
                items={filteredItems}
                onItemClick={handleItemClick}
                density={density}
              />
            ) : viewMode === 'travel' ? (
              <TravelView
                items={filteredItems}
                onItemClick={handleItemClick}
              />
            ) : viewMode === 'life' ? (
              <LifeView
                items={filteredItems}
                onItemClick={handleItemClick}
              />
            ) : viewMode === 'restaurants' ? (
              <RestaurantsView
                items={items}
                onItemClick={handleItemClick}
              />
            ) : viewMode === 'kitchen' ? (
              <KitchenView
                items={items}
                onItemClick={handleItemClick}
              />
            ) : viewMode === 'in_progress' ? (
              <GroupedByCategoryView
                items={filteredItems}
                onItemClick={handleItemClick}
                density={density}
                selectedCategory={selectedCategoryInProgress}
                onCategorySelect={setSelectedCategoryInProgress}
              />
            ) : viewMode === 'completed' ? (
              <GroupedByCategoryView
                items={filteredItems}
                onItemClick={handleItemClick}
                density={density}
                selectedCategory={selectedCategoryCompleted}
                onCategorySelect={setSelectedCategoryCompleted}
              />
            ) : filteredItems.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-gray-500">
                No items found
              </div>
            ) : density === 'table' ? (
              <TableView items={filteredItems} onItemClick={handleItemClick} />
            ) : density === 'compact' ? (
              <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
                {filteredItems.map(item => (
                  <CompactListItem
                    key={item.id}
                    item={item}
                    onClick={() => handleItemClick(item)}
                    density="compact"
                  />
                ))}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map(item => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      <DetailPanel
        item={selectedItem}
        isOpen={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
        onUpdate={fetchItems}
      />

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddItemSubmit}
      />
    </div>
  );
}

function RegionTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? 'bg-indigo-100 text-indigo-700'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label} <span className="ml-1 text-xs opacity-75">({count})</span>
    </button>
  );
}

import { BucketListItem, Category, Region } from '@/types/database';

export interface CategoryStats {
  total: number;
  completed: number;
  priority: number;
  canDoNow: number;
  items: BucketListItem[];
}

export interface TravelStats {
  total: number;
  completed: number;
  byRegion: {
    sydney: BucketListItem[];
    australia: BucketListItem[];
    europe: BucketListItem[];
    asia: BucketListItem[];
    americas: BucketListItem[];
    middleEastAfrica: BucketListItem[];
    oceania: BucketListItem[];
  };
}

export interface YearStats {
  [year: number]: BucketListItem[];
  2026: BucketListItem[];
  2027: BucketListItem[];
  2028: BucketListItem[];
  unassigned: BucketListItem[];
}

export interface OwnershipStats {
  couples: BucketListItem[];
  peter: BucketListItem[];
  xi: BucketListItem[];
}

export interface Insights {
  totalItems: number;
  completedItems: number;
  completionPercentage: number;
  priorityItems: BucketListItem[];
  items2026: BucketListItem[];
  canDoNowSydney: BucketListItem[];
  recentlyCompleted: BucketListItem[];
}

export function getCategoryStats(items: BucketListItem[]): Record<Category, CategoryStats> {
  items = items.filter(i => !i.archived);
  const stats = {} as Record<Category, CategoryStats>;

  // Initialize all categories
  const allCategories: Category[] = [
    'travel', 'adventure', 'cultural_events', 'sporting_events', 'music_party',
    'food_drink', 'personal_growth', 'creative', 'skills', 'challenges',
    'material', 'business_professional', 'social_impact', 'life_legacy', 'health_wellness'
  ];

  for (const category of allCategories) {
    stats[category] = { total: 0, completed: 0, priority: 0, canDoNow: 0, items: [] };
  }

  // Count items per category
  for (const item of items) {
    for (const category of item.categories) {
      if (!stats[category]) continue;

      stats[category].total++;
      stats[category].items.push(item);

      if (item.status === 'completed') stats[category].completed++;
      if (item.is_priority) stats[category].priority++;
      if (item.actionability === 'can_do_now') stats[category].canDoNow++;
    }
  }

  return stats;
}

export function getTravelStats(items: BucketListItem[]): TravelStats {
  const travelItems = items.filter(i => !i.archived && i.categories.includes('travel'));

  return {
    total: travelItems.length,
    completed: travelItems.filter(i => i.status === 'completed').length,
    byRegion: {
      sydney: travelItems.filter(i => i.location_type === 'sydney'),
      australia: travelItems.filter(i => i.location_type === 'australia' && !i.region),
      europe: travelItems.filter(i => i.region === 'Europe'),
      asia: travelItems.filter(i => i.region === 'Asia'),
      americas: travelItems.filter(i => i.region === 'Americas'),
      middleEastAfrica: travelItems.filter(i => i.region === 'Middle East & Africa'),
      oceania: travelItems.filter(i => i.region === 'Oceania'),
    },
  };
}

export function getYearStats(items: BucketListItem[]): YearStats {
  // Exclude food_drink and archived items from year stats
  const filteredItems = items.filter(i => !i.archived && !i.categories.includes('food_drink'));
  return {
    2026: filteredItems.filter(i => i.target_year === 2026),
    2027: filteredItems.filter(i => i.target_year === 2027),
    2028: filteredItems.filter(i => i.target_year === 2028),
    unassigned: filteredItems.filter(i => !i.target_year),
  };
}

export function getOwnershipStats(items: BucketListItem[]): OwnershipStats {
  // Exclude food_drink and archived items from ownership stats
  const filteredItems = items.filter(i => !i.archived && !i.categories.includes('food_drink'));
  return {
    couples: filteredItems.filter(i => i.ownership === 'couples'),
    peter: filteredItems.filter(i => i.ownership === 'peter'),
    xi: filteredItems.filter(i => i.ownership === 'wife'),
  };
}

export function getInsights(items: BucketListItem[]): Insights {
  items = items.filter(i => !i.archived);
  const completed = items.filter(i => i.status === 'completed');

  return {
    totalItems: items.length,
    completedItems: completed.length,
    completionPercentage: Math.round((completed.length / items.length) * 100),
    priorityItems: items.filter(i => i.is_priority && i.status !== 'completed'),
    items2026: items.filter(i => i.target_year === 2026),
    canDoNowSydney: items.filter(i =>
      i.location_type === 'sydney' &&
      i.actionability === 'can_do_now' &&
      i.status !== 'completed'
    ),
    recentlyCompleted: completed
      .sort((a, b) => {
        if (!a.completed_date || !b.completed_date) return 0;
        return new Date(b.completed_date).getTime() - new Date(a.completed_date).getTime();
      })
      .slice(0, 10),
  };
}

export function groupItemsByCategory(items: BucketListItem[], includeArchived = false): Map<Category, BucketListItem[]> {
  if (!includeArchived) items = items.filter(i => !i.archived);
  const grouped = new Map<Category, BucketListItem[]>();

  for (const item of items) {
    for (const category of item.categories) {
      if (!grouped.has(category)) {
        grouped.set(category, []);
      }
      grouped.get(category)!.push(item);
    }
  }

  return grouped;
}

export type LocationType = 'sydney' | 'australia' | 'international';
export type Actionability = 'can_do_now' | 'needs_planning' | 'needs_saving' | 'needs_milestone';
export type TargetTimeframe = 'this_year' | 'next_few_years' | 'someday' | 'ongoing';
export type Season = 'summer' | 'winter' | 'spring' | 'autumn' | 'specific_date' | 'any';
export type Status = 'idea' | 'planned' | 'in_progress' | 'completed';
export type Ownership = 'couples' | 'peter' | 'wife';

export const CATEGORIES = [
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
  'health_wellness',
] as const;

export type Category = typeof CATEGORIES[number];

export const REGIONS = [
  'Europe',
  'Asia',
  'Americas',
  'Middle East & Africa',
  'Oceania',
] as const;

export type Region = typeof REGIONS[number];

export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface BucketListItem {
  id: string;
  title: string;
  description: string | null;
  categories: Category[];
  location_type: LocationType | null;
  specific_location: string | null;
  region: Region | null;
  country: string | null;
  is_physical: boolean;
  actionability: Actionability | null;
  target_year: number | null;
  target_timeframe: TargetTimeframe | null;
  seasonality: Season[];
  season_notes: string | null;
  status: Status;
  completed_date: string | null;
  completion_notes: string | null;
  ownership: Ownership;
  added_by: string | null;
  created_at: string;
  updated_at: string;
  is_priority: boolean;
  related_item_ids: string[];
}

export interface CreateBucketListItem {
  title: string;
  description?: string | null;
  categories?: Category[];
  location_type?: LocationType | null;
  specific_location?: string | null;
  region?: Region | null;
  country?: string | null;
  is_physical?: boolean;
  actionability?: Actionability | null;
  target_year?: number | null;
  target_timeframe?: TargetTimeframe | null;
  seasonality?: Season[];
  season_notes?: string | null;
  status?: Status;
  ownership?: Ownership;
  is_priority?: boolean;
}

export interface UpdateBucketListItem extends Partial<CreateBucketListItem> {
  completed_date?: string | null;
  completion_notes?: string | null;
  related_item_ids?: string[];
}

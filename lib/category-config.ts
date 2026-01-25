import { Category, Region } from '@/types/database';

export interface CategoryConfig {
  displayName: string;
  icon: string;
  color: {
    bg: string;
    text: string;
    border: string;
  };
  watercolorClass: string;
  isPrimary?: boolean;
}

export const categoryConfig: Record<Category, CategoryConfig> = {
  travel: {
    displayName: 'Travel & Places',
    icon: '✈️',
    color: { bg: 'rgba(168, 181, 200, 0.3)', text: '#2A3A4A', border: '#A8B5C8' },
    watercolorClass: 'badge-dusty-blue',
    isPrimary: true,
  },
  adventure: {
    displayName: 'Adventure',
    icon: '🏔️',
    color: { bg: 'rgba(212, 167, 151, 0.3)', text: '#5A3A2A', border: '#D4A797' },
    watercolorClass: 'badge-terracotta',
  },
  cultural_events: {
    displayName: 'Cultural Events',
    icon: '🎭',
    color: { bg: 'rgba(212, 200, 224, 0.3)', text: '#4A3A5A', border: '#D4C8E0' },
    watercolorClass: 'badge-lavender',
  },
  sporting_events: {
    displayName: 'Sports & Events',
    icon: '🏆',
    color: { bg: 'rgba(184, 197, 184, 0.3)', text: '#3A4A3A', border: '#B8C5B8' },
    watercolorClass: 'badge-sage',
  },
  music_party: {
    displayName: 'Music & Nightlife',
    icon: '🎵',
    color: { bg: 'rgba(244, 212, 212, 0.3)', text: '#6A3A3A', border: '#F4D4D4' },
    watercolorClass: 'badge-blush',
  },
  food_drink: {
    displayName: 'Food & Drink',
    icon: '🍽️',
    color: { bg: 'rgba(253, 230, 138, 0.3)', text: '#5A4A1A', border: '#FDE68A' },
    watercolorClass: 'badge-pale-gold',
  },
  personal_growth: {
    displayName: 'Personal Growth',
    icon: '🌱',
    color: { bg: 'rgba(200, 224, 212, 0.3)', text: '#2A4A3A', border: '#C8E0D4' },
    watercolorClass: 'badge-mint',
  },
  creative: {
    displayName: 'Creative Projects',
    icon: '🎨',
    color: { bg: 'rgba(255, 209, 179, 0.3)', text: '#6A4A2A', border: '#FFD1B3' },
    watercolorClass: 'badge-apricot',
  },
  skills: {
    displayName: 'Skills & Learning',
    icon: '📚',
    color: { bg: 'rgba(184, 197, 184, 0.3)', text: '#3A4A3A', border: '#B8C5B8' },
    watercolorClass: 'badge-sage',
  },
  challenges: {
    displayName: 'Challenges',
    icon: '🎯',
    color: { bg: 'rgba(212, 167, 151, 0.3)', text: '#5A3A2A', border: '#D4A797' },
    watercolorClass: 'badge-terracotta',
  },
  material: {
    displayName: 'Material & Possessions',
    icon: '🏠',
    color: { bg: 'rgba(253, 230, 138, 0.3)', text: '#5A4A1A', border: '#FDE68A' },
    watercolorClass: 'badge-pale-gold',
  },
  business_professional: {
    displayName: 'Business & Career',
    icon: '💼',
    color: { bg: 'rgba(168, 181, 200, 0.3)', text: '#2A3A4A', border: '#A8B5C8' },
    watercolorClass: 'badge-dusty-blue',
  },
  social_impact: {
    displayName: 'Social Impact',
    icon: '🤝',
    color: { bg: 'rgba(200, 224, 212, 0.3)', text: '#2A4A3A', border: '#C8E0D4' },
    watercolorClass: 'badge-mint',
  },
  life_legacy: {
    displayName: 'Life & Legacy',
    icon: '🌟',
    color: { bg: 'rgba(212, 200, 224, 0.3)', text: '#4A3A5A', border: '#D4C8E0' },
    watercolorClass: 'badge-lavender',
  },
  health_wellness: {
    displayName: 'Health & Wellness',
    icon: '💪',
    color: { bg: 'rgba(244, 212, 212, 0.3)', text: '#6A3A3A', border: '#F4D4D4' },
    watercolorClass: 'badge-blush',
  },
};

export interface RegionConfig {
  displayName: string;
  icon: string;
  color: string;
}

export const regionConfig: Record<Region, RegionConfig> = {
  'Europe': {
    displayName: 'Europe',
    icon: '🇪🇺',
    color: '#60A5FA',
  },
  'Asia': {
    displayName: 'Asia',
    icon: '🌏',
    color: '#F59E0B',
  },
  'Americas': {
    displayName: 'Americas',
    icon: '🌎',
    color: '#10B981',
  },
  'Middle East & Africa': {
    displayName: 'Middle East & Africa',
    icon: '🌍',
    color: '#8B5CF6',
  },
  'Oceania': {
    displayName: 'Oceania',
    icon: '🏝️',
    color: '#06B6D4',
  },
};

export const ownershipConfig = {
  couples: {
    icon: '👫',
    label: 'Couples',
    color: '#EC4899'
  },
  peter: {
    icon: '👤',
    label: 'Peter',
    color: '#3B82F6'
  },
  wife: {
    icon: '👤',
    label: 'Xi',
    color: '#8B5CF6'
  }
};

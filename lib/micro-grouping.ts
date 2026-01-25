import { BucketListItem, Category } from '@/types/database';

export interface MicroGroup {
  name: string;
  items: BucketListItem[];
}

// Keyword-based grouping rules for each category
const groupingRules: Record<Category, Record<string, string[]>> = {
  adventure: {
    'Water': ['surf', 'dive', 'snorkel', 'swim', 'kayak', 'sail', 'boat', 'ocean', 'sea', 'beach', 'wave', 'reef'],
    'Mountain': ['climb', 'hike', 'trek', 'mountain', 'peak', 'summit', 'alpine', 'trail', 'canyon', 'valley'],
    'Air': ['fly', 'skydive', 'paraglide', 'balloon', 'helicopter', 'plane', 'aerial'],
    'Extreme': ['bungee', 'zipline', 'rappel', 'cave', 'jump', 'race', 'speed', 'adrenaline'],
  },
  skills: {
    'Creative': ['draw', 'paint', 'music', 'instrument', 'sing', 'dance', 'write', 'photo', 'design', 'art'],
    'Physical': ['martial', 'fitness', 'yoga', 'sport', 'train', 'run', 'cycle', 'strength'],
    'Intellectual': ['learn', 'language', 'code', 'program', 'study', 'course', 'read', 'master', 'certification'],
    'Practical': ['cook', 'build', 'craft', 'repair', 'garden', 'sew', 'woodwork'],
  },
  creative: {
    'Visual Arts': ['paint', 'draw', 'sketch', 'photo', 'sculpture', 'pottery', 'design', 'illustration'],
    'Writing': ['write', 'novel', 'book', 'poetry', 'journal', 'blog', 'story', 'script'],
    'Music': ['music', 'song', 'album', 'instrument', 'compose', 'produce', 'record', 'perform'],
    'Craft': ['craft', 'knit', 'sew', 'woodwork', 'pottery', 'jewelry', 'build', 'create'],
  },
  travel: {
    'Europe': ['europe', 'paris', 'london', 'rome', 'barcelona', 'berlin', 'amsterdam', 'vienna'],
    'Asia': ['asia', 'japan', 'tokyo', 'china', 'thailand', 'vietnam', 'korea', 'bali'],
    'Americas': ['america', 'usa', 'canada', 'mexico', 'brazil', 'peru', 'argentina'],
    'Oceania': ['australia', 'sydney', 'new zealand', 'fiji', 'oceania', 'pacific'],
  },
  food_drink: {
    'Dining': ['restaurant', 'dine', 'michelin', 'chef', 'tasting', 'menu', 'feast'],
    'Cooking': ['cook', 'recipe', 'bake', 'prepare', 'master', 'cuisine', 'dish'],
    'Beverages': ['wine', 'coffee', 'tea', 'cocktail', 'beer', 'spirits', 'drink', 'tasting'],
    'Experience': ['food tour', 'market', 'street food', 'festival', 'farm', 'vineyard'],
  },
  personal_growth: {
    'Mindfulness': ['meditate', 'mindful', 'yoga', 'retreat', 'spiritual', 'zen', 'peace'],
    'Self-Discovery': ['therapy', 'coach', 'mentor', 'reflect', 'journal', 'identity', 'values'],
    'Habits': ['habit', 'routine', 'discipline', 'practice', 'consistency', 'improve'],
    'Relationships': ['relationship', 'friend', 'family', 'social', 'connection', 'community'],
  },
  life_legacy: {
    'Family': ['family', 'children', 'parent', 'marriage', 'home', 'wedding'],
    'Impact': ['legacy', 'impact', 'contribute', 'change', 'influence', 'inspire'],
    'Milestones': ['milestone', 'achievement', 'celebrate', 'birthday', 'anniversary'],
    'Documentation': ['memoir', 'story', 'document', 'record', 'preserve', 'history'],
  },
  business_professional: {
    'Career': ['career', 'job', 'promotion', 'position', 'role', 'interview'],
    'Entrepreneurship': ['business', 'startup', 'company', 'launch', 'venture', 'entrepreneur'],
    'Skills': ['skill', 'certification', 'training', 'course', 'learn', 'master'],
    'Networking': ['network', 'connect', 'mentor', 'conference', 'speak', 'present'],
  },
  material: {
    'Technology': ['computer', 'phone', 'gadget', 'tech', 'device', 'electronics'],
    'Vehicles': ['car', 'bike', 'motorcycle', 'vehicle', 'drive', 'ride'],
    'Home': ['home', 'house', 'furniture', 'decor', 'apartment', 'property'],
    'Collectibles': ['collect', 'watch', 'art', 'vintage', 'rare', 'limited'],
  },
  health_wellness: {
    'Fitness': ['fitness', 'gym', 'train', 'workout', 'exercise', 'strength', 'cardio'],
    'Nutrition': ['diet', 'nutrition', 'eat', 'healthy', 'meal', 'food', 'weight'],
    'Mental Health': ['mental', 'therapy', 'stress', 'anxiety', 'mindful', 'wellness'],
    'Medical': ['health', 'doctor', 'checkup', 'medical', 'test', 'screening'],
  },
  challenges: {
    'Physical': ['marathon', 'race', 'competition', 'athletic', 'endurance', 'physical'],
    'Mental': ['puzzle', 'chess', 'quiz', 'challenge', 'brain', 'solve'],
    'Social': ['public speak', 'perform', 'stage', 'audience', 'overcome fear'],
  },
  social_impact: {
    'Volunteering': ['volunteer', 'help', 'serve', 'donate', 'charity', 'nonprofit'],
    'Environment': ['environment', 'sustainability', 'eco', 'green', 'climate', 'conservation'],
    'Community': ['community', 'local', 'neighborhood', 'organize', 'activism'],
    'Education': ['teach', 'mentor', 'educate', 'tutor', 'workshop', 'training'],
  },
  cultural_events: {
    'Performance': ['concert', 'theater', 'opera', 'ballet', 'performance', 'show'],
    'Festivals': ['festival', 'celebration', 'carnival', 'parade', 'fair'],
    'Museums': ['museum', 'gallery', 'exhibition', 'art', 'history', 'culture'],
  },
  sporting_events: {
    'Major Events': ['olympics', 'world cup', 'championship', 'final', 'grand prix'],
    'Live Sports': ['watch', 'game', 'match', 'stadium', 'arena', 'live'],
  },
  music_party: {
    'Concerts': ['concert', 'festival', 'show', 'live music', 'performance', 'gig'],
    'Clubs': ['club', 'party', 'dance', 'nightlife', 'dj', 'rave'],
    'Events': ['event', 'celebration', 'gathering', 'social', 'meetup'],
  },
};

export function groupItemsByMicroCategory(items: BucketListItem[], category: Category): MicroGroup[] {
  const rules = groupingRules[category];

  // If no rules defined for this category, return single group
  if (!rules) {
    return [{ name: 'All', items }];
  }

  const groups: Record<string, BucketListItem[]> = {};
  const unmatched: BucketListItem[] = [];

  // Initialize groups
  Object.keys(rules).forEach(groupName => {
    groups[groupName] = [];
  });

  // Categorize each item
  items.forEach(item => {
    const titleLower = item.title.toLowerCase();
    const descLower = (item.description || '').toLowerCase();
    const locationLower = (item.specific_location || '').toLowerCase();
    const searchText = `${titleLower} ${descLower} ${locationLower}`;

    let matched = false;

    // Check each group's keywords
    for (const [groupName, keywords] of Object.entries(rules)) {
      if (keywords.some(keyword => searchText.includes(keyword))) {
        groups[groupName].push(item);
        matched = true;
        break; // Only assign to first matching group
      }
    }

    if (!matched) {
      unmatched.push(item);
    }
  });

  // Build result array, excluding empty groups
  const result: MicroGroup[] = [];

  Object.entries(groups).forEach(([name, items]) => {
    if (items.length > 0) {
      result.push({ name, items });
    }
  });

  // Add miscellaneous group if there are unmatched items
  if (unmatched.length > 0) {
    result.push({ name: 'Other', items: unmatched });
  }

  return result;
}

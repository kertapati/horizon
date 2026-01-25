/**
 * Seed Bucket List Items
 *
 * This script imports all bucket list items into the Supabase database.
 * Run with: npx tsx scripts/seed-bucket-list.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface BucketListItemInput {
  title: string;
  description?: string;
  categories: string[];
  location_type?: 'sydney' | 'australia' | 'international';
  specific_location?: string;
  region?: string;
  is_physical?: boolean;
  actionability?: 'can_do_now' | 'needs_planning' | 'needs_saving' | 'needs_milestone';
  target_year?: number;
  target_timeframe?: 'this_year' | 'next_few_years' | 'someday' | 'ongoing';
  seasonality?: string[];
  season_notes?: string;
  status?: 'idea' | 'planned' | 'in_progress' | 'completed';
  completed_date?: string;
  completion_notes?: string;
  ownership?: 'couples' | 'peter' | 'wife';
  is_priority?: boolean;
}

// ============================================================================
// DATA ARRAYS
// ============================================================================

const completedItems: BucketListItemInput[] = [
  { title: "Vietnam", categories: ["travel"], location_type: "international", region: "Asia", specific_location: "Vietnam" },
  { title: "Italy", categories: ["travel"], location_type: "international", region: "Europe", specific_location: "Italy" },
  { title: "Portugal", categories: ["travel"], location_type: "international", region: "Europe", specific_location: "Portugal" },
  { title: "Hallstatt", categories: ["travel"], location_type: "international", region: "Europe", specific_location: "Hallstatt, Austria" },
  { title: "Cambodia", categories: ["travel"], location_type: "international", region: "Asia", specific_location: "Cambodia" },
  { title: "Paris", categories: ["travel"], location_type: "international", region: "Europe", specific_location: "Paris, France" },
  { title: "Grand Prix", categories: ["sporting_events", "travel"], location_type: "international" },
  { title: "Fred Again concert", categories: ["music_party"], is_physical: false },
  { title: "Taylor Swift concert", categories: ["music_party"], is_physical: false },
  { title: "Bangkok", categories: ["travel"], location_type: "international", region: "Asia", specific_location: "Bangkok, Thailand" },
  { title: "London", categories: ["travel"], location_type: "international", region: "Europe", specific_location: "London, UK" },
  { title: "Amsterdam", categories: ["travel"], location_type: "international", region: "Europe", specific_location: "Amsterdam, Netherlands" },
  { title: "Berlin", categories: ["travel"], location_type: "international", region: "Europe", specific_location: "Berlin, Germany" },
  { title: "ETHCC", categories: ["cultural_events", "business_professional"], location_type: "international", region: "Europe" },
  { title: "Token2049", categories: ["cultural_events", "business_professional"], location_type: "international", region: "Asia" },
  { title: "Tomorrowland", categories: ["music_party", "travel"], location_type: "international", region: "Europe", specific_location: "Belgium" },
  { title: "Parasailing", categories: ["adventure"], is_physical: true },
  { title: "Eightsleep mattress", categories: ["material", "health_wellness"] },
  { title: "Korea", categories: ["travel"], location_type: "international", region: "Asia", specific_location: "South Korea" },
  { title: "Travis Scott concert", categories: ["music_party"] },
  { title: "China - Beijing & Shanghai", categories: ["travel"], location_type: "international", region: "Asia", specific_location: "Beijing, Shanghai" },
  { title: "Istanbul", categories: ["travel"], location_type: "international", region: "Europe", specific_location: "Istanbul, Turkey" },
  { title: "Croatia", categories: ["travel"], location_type: "international", region: "Europe", specific_location: "Croatia" },
  { title: "Cappadocia hot air balloons", categories: ["travel", "adventure"], location_type: "international", region: "Europe", specific_location: "Cappadocia, Turkey" },
  { title: "Brighton Beach boxes", categories: ["travel"], location_type: "australia", specific_location: "Melbourne" },
  { title: "Mt Kosciuszko loop", categories: ["adventure", "travel"], location_type: "australia", is_physical: true, specific_location: "NSW" },
  { title: "Chiang Mai", categories: ["travel"], location_type: "international", region: "Asia", specific_location: "Chiang Mai, Thailand" },
];

const priorityItems: BucketListItemInput[] = [
  { title: "Inca Trail + Machu Picchu", categories: ["travel", "adventure"], location_type: "international", region: "Americas", specific_location: "Peru", is_physical: true, actionability: "needs_planning", season_notes: "May-January open, book 6 months in advance", target_timeframe: "next_few_years" },
  { title: "Yosemite National Park", categories: ["travel", "adventure"], location_type: "international", region: "Americas", specific_location: "California, USA", is_physical: true, actionability: "needs_planning" },
  { title: "NBA Playoffs", categories: ["sporting_events", "travel"], location_type: "international", region: "Americas", specific_location: "USA", actionability: "needs_planning" },
  { title: "Burning Man", categories: ["cultural_events", "music_party", "adventure"], location_type: "international", region: "Americas", specific_location: "Nevada, USA", actionability: "needs_planning", season_notes: "Late August/early September" },
  { title: "Northern Lights", categories: ["travel", "adventure"], location_type: "international", region: "Europe", specific_location: "Iceland or Nordics", actionability: "needs_planning", seasonality: ["winter"], season_notes: "Best September-March" },
  { title: "Mexico - Day of the Dead", categories: ["travel", "cultural_events"], location_type: "international", region: "Americas", specific_location: "Mexico", actionability: "needs_planning", seasonality: ["specific_date"], season_notes: "November 1-2" },
  { title: "PokéPark Kanto", categories: ["travel", "cultural_events"], location_type: "international", region: "Asia", specific_location: "Japan", actionability: "needs_planning" },
];

const europeTravel: BucketListItemInput[] = [
  // Italy
  { title: "Lake Como", categories: ["travel"], location_type: "international", region: "Europe", specific_location: "Lake Como, Italy", actionability: "needs_planning" },
  { title: "Lake Garda", categories: ["travel"], location_type: "international", region: "Europe", specific_location: "Lake Garda, Italy", actionability: "needs_planning" },
  { title: "Amalfi Coast", categories: ["travel"], location_type: "international", region: "Europe", specific_location: "Amalfi Coast, Italy", actionability: "needs_planning" },
  { title: "Matera & Bologna", categories: ["travel"], location_type: "international", region: "Europe", specific_location: "Matera, Bologna, Italy", actionability: "needs_planning" },
  { title: "Italian Dolomites hut-to-hut trek", categories: ["travel", "adventure"], location_type: "international", region: "Europe", specific_location: "Dolomites, Italy", is_physical: true, actionability: "needs_planning", description: "Alpe di Siusi, Lago di Braies, South Tyrol" },
  { title: "Capri", categories: ["travel"], location_type: "international", region: "Europe", specific_location: "Capri, Italy", description: "Luxury trip" },

  // Switzerland
  { title: "Mt Pilatus hike", categories: ["travel", "adventure"], location_type: "international", region: "Europe", specific_location: "Mt Pilatus, Switzerland", is_physical: true },
  { title: "Interlaken", categories: ["travel"], location_type: "international", region: "Europe", specific_location: "Interlaken, Switzerland" },
  { title: "Geneva", categories: ["travel"], location_type: "international", region: "Europe", specific_location: "Geneva, Switzerland" },
  { title: "Swiss Alps hike", categories: ["travel", "adventure"], location_type: "international", region: "Europe", specific_location: "Swiss Alps", is_physical: true },
  { title: "St Moritz ski/snowboard", categories: ["travel", "adventure"], location_type: "international", region: "Europe", specific_location: "St Moritz, Switzerland", is_physical: true, seasonality: ["winter"] },
  { title: "Chamonix ski/snowboard", categories: ["travel", "adventure"], location_type: "international", region: "Europe", specific_location: "Chamonix, France", is_physical: true, seasonality: ["winter"] },
  { title: "Gstaad", categories: ["travel"], location_type: "international", region: "Europe", specific_location: "Gstaad, Switzerland", description: "Luxury snow trip", seasonality: ["winter"] },

  // Greece
  { title: "Samaria Gorge hike", categories: ["travel", "adventure"], location_type: "international", region: "Europe", specific_location: "Crete, Greece", is_physical: true, description: "One-way hike 6-8h" },
  { title: "Meteora", categories: ["travel"], location_type: "international", region: "Europe", specific_location: "Meteora, Greece" },

  // UK
  { title: "North of UK road trip", categories: ["travel", "adventure"], location_type: "international", region: "Europe", specific_location: "UK" },
  { title: "Edinburgh", categories: ["travel"], location_type: "international", region: "Europe", specific_location: "Edinburgh, Scotland" },
  { title: "Bath Roman Baths", categories: ["travel"], location_type: "international", region: "Europe", specific_location: "Bath, UK" },
  { title: "Royal Scotsman luxury train", categories: ["travel", "adventure"], location_type: "international", region: "Europe", specific_location: "Scotland", description: "Luxury train experience" },
  { title: "Printworks London", categories: ["music_party", "travel"], location_type: "international", region: "Europe", specific_location: "London, UK" },
  { title: "Stonehenge", categories: ["travel"], location_type: "international", region: "Europe", specific_location: "Stonehenge, UK" },
  { title: "Goodwood Festival of Speed", categories: ["sporting_events", "travel"], location_type: "international", region: "Europe", specific_location: "Goodwood, UK" },
  { title: "Cotswolds", categories: ["travel"], location_type: "international", region: "Europe", specific_location: "Cotswolds, UK" },

  // France
  { title: "Paris - cabaret show", categories: ["travel", "cultural_events"], location_type: "international", region: "Europe", specific_location: "Paris, France" },
  { title: "Paris - underground catacombs", categories: ["travel", "adventure"], location_type: "international", region: "Europe", specific_location: "Paris, France" },
  { title: "Versailles", categories: ["travel"], location_type: "international", region: "Europe", specific_location: "Versailles, France" },
  { title: "Mont-Saint-Michel", categories: ["travel"], location_type: "international", region: "Europe", specific_location: "Mont-Saint-Michel, France" },
  { title: "Marseille", categories: ["travel"], location_type: "international", region: "Europe", specific_location: "Marseille, France" },
  { title: "South of France - Nice, St Tropez, Cannes", categories: ["travel"], location_type: "international", region: "Europe", specific_location: "French Riviera", description: "Nice, St Tropez, Cannes" },
  { title: "Taste Château Margaux", categories: ["travel", "food_drink"], location_type: "international", region: "Europe", specific_location: "Bordeaux, France" },
  { title: "Tour du Mont Blanc trek", categories: ["travel", "adventure"], location_type: "international", region: "Europe", specific_location: "Alps (France/Italy/Switzerland)", is_physical: true, description: "9-12 days, 6.5/10 difficulty" },

  // Germany/Slovenia
  { title: "Königssee", categories: ["travel"], location_type: "international", region: "Europe", specific_location: "Königssee, Germany" },
  { title: "Lake Bled", categories: ["travel"], location_type: "international", region: "Europe", specific_location: "Lake Bled, Slovenia" },

  // Balkans
  { title: "Sarajevo", categories: ["travel"], location_type: "international", region: "Europe", specific_location: "Sarajevo, Bosnia" },
  { title: "Bosnia/Albania/Montenegro loop", categories: ["travel", "adventure"], location_type: "international", region: "Europe", specific_location: "Balkans" },

  // Nordics
  { title: "Iceland eco-lodge Aurora", categories: ["travel"], location_type: "international", region: "Europe", specific_location: "Iceland", seasonality: ["winter"] },
  { title: "Norway/Sweden/Finland trip", categories: ["travel"], location_type: "international", region: "Europe", specific_location: "Nordics", description: "Including Helsinki" },
  { title: "Stockholm", categories: ["travel"], location_type: "international", region: "Europe", specific_location: "Stockholm, Sweden" },
  { title: "Finland husky-sled expedition", categories: ["travel", "adventure"], location_type: "international", region: "Europe", specific_location: "Finland", seasonality: ["winter"] },
  { title: "Preikestolen Pulpit Rock hike", categories: ["travel", "adventure"], location_type: "international", region: "Europe", specific_location: "Norway", is_physical: true, description: "4-6h hike" },

  // Spain & Portugal
  { title: "Granada", categories: ["travel"], location_type: "international", region: "Europe", specific_location: "Granada, Spain" },
  { title: "Carnival", categories: ["travel", "cultural_events"], location_type: "international", region: "Europe", specific_location: "Spain" },
  { title: "Mallorca", categories: ["travel"], location_type: "international", region: "Europe", specific_location: "Mallorca, Spain" },
  { title: "Ibiza", categories: ["travel", "music_party"], location_type: "international", region: "Europe", specific_location: "Ibiza, Spain" },
  { title: "Madeira", categories: ["travel"], location_type: "international", region: "Europe", specific_location: "Madeira, Portugal" },
  { title: "Malta", categories: ["travel"], location_type: "international", region: "Europe", specific_location: "Malta" },
  { title: "Caminito del Rey hike", categories: ["travel", "adventure"], location_type: "international", region: "Europe", specific_location: "Spain", is_physical: true, description: "1-3h hike" },

  // Other
  { title: "Copenhagen", categories: ["travel"], location_type: "international", region: "Europe", specific_location: "Copenhagen, Denmark" },
  { title: "Trans-Siberian Railway", categories: ["travel", "adventure"], location_type: "international", region: "Europe", specific_location: "Russia", description: "Epic train journey" },
];

const middleEastAfrica: BucketListItemInput[] = [
  { title: "Dubai", categories: ["travel"], location_type: "international", region: "Middle East & Africa", specific_location: "Dubai, UAE", description: "Indoor ski, Aura SkyPool, golden-visa, visit Bainy, Sterling, SSJ, Akabeko, Fisher8, Shreya" },
  { title: "Petra & Wadi Rum stargazing", categories: ["travel", "adventure"], location_type: "international", region: "Middle East & Africa", specific_location: "Jordan" },
  { title: "Safari South Africa & Cape Town", categories: ["travel", "adventure"], location_type: "international", region: "Middle East & Africa", specific_location: "South Africa" },
  { title: "Mt Kilimanjaro", categories: ["travel", "adventure", "challenges"], location_type: "international", region: "Middle East & Africa", specific_location: "Tanzania", is_physical: true },
  { title: "Tugela Falls via Amphitheatre hike", categories: ["travel", "adventure"], location_type: "international", region: "Middle East & Africa", specific_location: "South Africa", is_physical: true, description: "4-6h hike" },
];

const asiaTravel: BucketListItemInput[] = [
  // Japan
  { title: "Hakuba/Niseko/Hokkaido snowboard", categories: ["travel", "adventure"], location_type: "international", region: "Asia", specific_location: "Japan", is_physical: true, seasonality: ["winter"] },
  { title: "Okinawa katana-making", categories: ["travel", "creative", "skills"], location_type: "international", region: "Asia", specific_location: "Okinawa, Japan" },
  { title: "Zen monastery stay", categories: ["travel", "personal_growth"], location_type: "international", region: "Asia", specific_location: "Japan" },
  { title: "Kanazawa → Shirakawa-go → Takayama", categories: ["travel"], location_type: "international", region: "Asia", specific_location: "Japan" },
  { title: "Ginzan Onsen", categories: ["travel"], location_type: "international", region: "Asia", specific_location: "Ginzan Onsen, Japan" },
  { title: "Climb Mt Fuji", categories: ["travel", "adventure", "challenges"], location_type: "international", region: "Asia", specific_location: "Mt Fuji, Japan", is_physical: true },
  { title: "Buy farmland in Japan", categories: ["material", "life_legacy"], location_type: "international", region: "Asia", specific_location: "Japan", actionability: "needs_saving" },
  { title: "Mount Zao", categories: ["travel", "adventure"], location_type: "international", region: "Asia", specific_location: "Mount Zao, Japan" },

  // Other Asia
  { title: "Taiwan", categories: ["travel"], location_type: "international", region: "Asia", specific_location: "Taiwan" },
  { title: "Hong Kong hike + ice bath", categories: ["travel", "adventure", "health_wellness"], location_type: "international", region: "Asia", specific_location: "Hong Kong", description: "Visit Sean/Denise, Sen Milo Yang, Happy Valley" },
  { title: "India - Holi festival", categories: ["travel", "cultural_events"], location_type: "international", region: "Asia", specific_location: "India", seasonality: ["specific_date"], season_notes: "March" },
  { title: "Sri Lanka", categories: ["travel"], location_type: "international", region: "Asia", specific_location: "Sri Lanka" },
  { title: "Philippines", categories: ["travel"], location_type: "international", region: "Asia", specific_location: "Philippines" },

  // China
  { title: "Guilin", categories: ["travel"], location_type: "international", region: "Asia", specific_location: "Guilin, China" },
  { title: "Yunnan", categories: ["travel"], location_type: "international", region: "Asia", specific_location: "Yunnan, China" },
  { title: "Huangshan", categories: ["travel", "adventure"], location_type: "international", region: "Asia", specific_location: "Huangshan, China" },
  { title: "Trans-Mongolian Railway Beijing→Moscow", categories: ["travel", "adventure"], location_type: "international", region: "Asia", specific_location: "China/Mongolia/Russia" },
  { title: "Terracotta Warriors", categories: ["travel"], location_type: "international", region: "Asia", specific_location: "Xi'an, China" },
  { title: "Harbin Ice & Snow Festival", categories: ["travel", "cultural_events"], location_type: "international", region: "Asia", specific_location: "Harbin, China", seasonality: ["winter"] },
  { title: "Chongqing", categories: ["travel"], location_type: "international", region: "Asia", specific_location: "Chongqing, China" },

  // Nepal/Malaysia
  { title: "Everest Base Camp trek", categories: ["travel", "adventure", "challenges"], location_type: "international", region: "Asia", specific_location: "Nepal", is_physical: true, description: "15 days" },
  { title: "Annapurna Circuit", categories: ["travel", "adventure"], location_type: "international", region: "Asia", specific_location: "Nepal", is_physical: true },
  { title: "Mt Kinabalu", categories: ["travel", "adventure"], location_type: "international", region: "Asia", specific_location: "Malaysia", is_physical: true },

  // Vietnam
  { title: "Ha Giang Loop", categories: ["travel", "adventure"], location_type: "international", region: "Asia", specific_location: "Vietnam", is_physical: true },
  { title: "Ho Chi Minh City", categories: ["travel"], location_type: "international", region: "Asia", specific_location: "Ho Chi Minh City, Vietnam" },
];

const americasTravel: BucketListItemInput[] = [
  // USA
  { title: "New York - Thanksgiving Parade", categories: ["travel", "cultural_events"], location_type: "international", region: "Americas", specific_location: "New York, USA", seasonality: ["specific_date"], season_notes: "November" },
  { title: "NFT NYC", categories: ["travel", "cultural_events", "business_professional"], location_type: "international", region: "Americas", specific_location: "New York, USA" },
  { title: "Washington D.C. / White House", categories: ["travel"], location_type: "international", region: "Americas", specific_location: "Washington D.C., USA" },
  { title: "California Big Sur drive", categories: ["travel", "adventure"], location_type: "international", region: "Americas", specific_location: "Big Sur, California" },
  { title: "Miami", categories: ["travel"], location_type: "international", region: "Americas", specific_location: "Miami, USA" },
  { title: "The Masters Augusta", categories: ["sporting_events", "travel"], location_type: "international", region: "Americas", specific_location: "Augusta, Georgia" },
  { title: "Joshua Tree National Park", categories: ["travel", "adventure"], location_type: "international", region: "Americas", specific_location: "Joshua Tree, California" },
  { title: "Las Vegas Sphere show", categories: ["travel", "music_party"], location_type: "international", region: "Americas", specific_location: "Las Vegas, USA" },
  { title: "NBA Playoffs/Finals", categories: ["sporting_events", "travel"], location_type: "international", region: "Americas", specific_location: "USA" },
  { title: "Pick up Pokemon cards from America", categories: ["travel", "material"], location_type: "international", region: "Americas", specific_location: "USA" },
  { title: "St Barts from New York", categories: ["travel"], location_type: "international", region: "Americas", specific_location: "St Barts", description: "Luxury trip" },
  { title: "Kalalau Trail Hawaii", categories: ["travel", "adventure"], location_type: "international", region: "Americas", specific_location: "Hawaii, USA", is_physical: true },

  // Canada
  { title: "Vancouver", categories: ["travel"], location_type: "international", region: "Americas", specific_location: "Vancouver, Canada" },
  { title: "Banff → Lake Louise → Jasper → Whistler road trip", categories: ["travel", "adventure"], location_type: "international", region: "Americas", specific_location: "Canadian Rockies" },
  { title: "Quebec", categories: ["travel"], location_type: "international", region: "Americas", specific_location: "Quebec, Canada" },

  // Latin America
  { title: "Mexico all-inclusive resort", categories: ["travel"], location_type: "international", region: "Americas", specific_location: "Mexico" },
  { title: "Teotihuacán", categories: ["travel"], location_type: "international", region: "Americas", specific_location: "Mexico" },
  { title: "Tulum", categories: ["travel"], location_type: "international", region: "Americas", specific_location: "Tulum, Mexico" },
  { title: "Costa Rica bird watching", categories: ["travel", "adventure"], location_type: "international", region: "Americas", specific_location: "Costa Rica" },
  { title: "Havana", categories: ["travel"], location_type: "international", region: "Americas", specific_location: "Havana, Cuba" },
  { title: "Brazil + Rio NYE", categories: ["travel", "cultural_events"], location_type: "international", region: "Americas", specific_location: "Rio de Janeiro, Brazil", seasonality: ["specific_date"] },
  { title: "Iguazu Falls", categories: ["travel"], location_type: "international", region: "Americas", specific_location: "Argentina/Brazil" },
  { title: "Buenos Aires tango", categories: ["travel", "cultural_events"], location_type: "international", region: "Americas", specific_location: "Buenos Aires, Argentina" },
  { title: "Patagonia", categories: ["travel", "adventure"], location_type: "international", region: "Americas", specific_location: "Patagonia", is_physical: true },
  { title: "Jamaica", categories: ["travel"], location_type: "international", region: "Americas", specific_location: "Jamaica" },
  { title: "Guatemala erupting volcano hike", categories: ["travel", "adventure"], location_type: "international", region: "Americas", specific_location: "Guatemala", is_physical: true },
  { title: "Alaska cruise + Mendenhall Glacier", categories: ["travel"], location_type: "international", region: "Americas", specific_location: "Alaska, USA" },
];

const oceaniaTravel: BucketListItemInput[] = [
  { title: "Milford Sound hike", categories: ["travel", "adventure"], location_type: "international", region: "Oceania", specific_location: "New Zealand", is_physical: true, season_notes: "Late Oct - late April" },
  { title: "Lord Howe Island", categories: ["travel"], location_type: "australia", specific_location: "Lord Howe Island, NSW" },
  { title: "Whitsundays", categories: ["travel"], location_type: "australia", specific_location: "Whitsundays, QLD" },
  { title: "Great Barrier Reef snorkel/dive", categories: ["travel", "adventure"], location_type: "australia", specific_location: "Great Barrier Reef, QLD" },
  { title: "Tahiti", categories: ["travel"], location_type: "international", region: "Oceania", specific_location: "Tahiti" },
  { title: "Hawaii - Oahu & Maui", categories: ["travel"], location_type: "international", region: "Oceania", specific_location: "Hawaii" },
  { title: "Maldives", categories: ["travel"], location_type: "international", region: "Asia", specific_location: "Maldives" },
  { title: "Antarctica peninsula cruise", categories: ["travel", "adventure"], location_type: "international", region: "Oceania", specific_location: "Antarctica", description: "9-20k twin share, 12-14 days, fly from South America", actionability: "needs_saving" },
  { title: "Queenstown snow trip", categories: ["travel", "adventure"], location_type: "international", region: "Oceania", specific_location: "Queenstown, NZ", seasonality: ["winter"] },
  { title: "Multi-day hike in New Zealand", categories: ["travel", "adventure"], location_type: "international", region: "Oceania", specific_location: "New Zealand", is_physical: true },
  { title: "Amisfield Winery Queenstown", categories: ["travel", "food_drink"], location_type: "international", region: "Oceania", specific_location: "Queenstown, NZ" },
];

const culturalEvents: BucketListItemInput[] = [
  { title: "Paris Fashion Week", categories: ["cultural_events", "travel"], location_type: "international", region: "Europe", specific_location: "Paris, France" },
  { title: "Art Basel Miami", categories: ["cultural_events", "travel"], location_type: "international", region: "Americas", specific_location: "Miami, USA" },
  { title: "Art Basel Paris", categories: ["cultural_events", "travel"], location_type: "international", region: "Europe", specific_location: "Paris, France" },
  { title: "Art Basel Hong Kong", categories: ["cultural_events", "travel"], location_type: "international", region: "Asia", specific_location: "Hong Kong" },
  { title: "Joust of the Saracen Arezzo", categories: ["cultural_events", "travel"], location_type: "international", region: "Europe", specific_location: "Arezzo, Italy" },
  { title: "Oktoberfest", categories: ["cultural_events", "travel", "food_drink"], location_type: "international", region: "Europe", specific_location: "Munich, Germany" },
  { title: "Yacht Week Croatia", categories: ["cultural_events", "travel", "adventure"], location_type: "international", region: "Europe", specific_location: "Croatia" },
  { title: "World Expo", categories: ["cultural_events", "travel"], location_type: "international" },
  { title: "NODE cryptopunk hub Palo Alto", categories: ["cultural_events", "business_professional"], location_type: "international", region: "Americas", specific_location: "Palo Alto, USA" },
  { title: "Live a month immersed in a city", categories: ["cultural_events", "personal_growth", "travel"], location_type: "international", description: "Kyoto, Florence, or Buenos Aires - language, art, local music" },
];

const sportingEvents: BucketListItemInput[] = [
  { title: "Australian Open", categories: ["sporting_events"], location_type: "australia", specific_location: "Melbourne", actionability: "can_do_now" },
  { title: "NBA Finals", categories: ["sporting_events", "travel"], location_type: "international", region: "Americas", specific_location: "USA" },
  { title: "FIFA World Cup", categories: ["sporting_events", "travel"], location_type: "international" },
  { title: "F1 Paddock ticket experience", categories: ["sporting_events", "travel"], location_type: "international" },
  { title: "Olympic Games", categories: ["sporting_events", "travel"], location_type: "international" },
  { title: "City2Surf Sydney", categories: ["sporting_events", "challenges"], location_type: "sydney", specific_location: "Sydney", is_physical: true, actionability: "can_do_now" },
  { title: "Boston Marathon", categories: ["sporting_events", "challenges"], location_type: "international", region: "Americas", specific_location: "Boston, USA", is_physical: true },
  { title: "London Marathon", categories: ["sporting_events", "challenges"], location_type: "international", region: "Europe", specific_location: "London, UK", is_physical: true },
  { title: "Berlin Marathon", categories: ["sporting_events", "challenges"], location_type: "international", region: "Europe", specific_location: "Berlin, Germany", is_physical: true },
  { title: "Chicago Marathon", categories: ["sporting_events", "challenges"], location_type: "international", region: "Americas", specific_location: "Chicago, USA", is_physical: true },
  { title: "New York Marathon", categories: ["sporting_events", "challenges"], location_type: "international", region: "Americas", specific_location: "New York, USA", is_physical: true },
  { title: "Tokyo Marathon", categories: ["sporting_events", "challenges"], location_type: "international", region: "Asia", specific_location: "Tokyo, Japan", is_physical: true },
  { title: "Sydney Marathon", categories: ["sporting_events", "challenges"], location_type: "sydney", specific_location: "Sydney", is_physical: true, actionability: "can_do_now" },
];

const musicParty: BucketListItemInput[] = [
  { title: "EDC Las Vegas", categories: ["music_party", "travel"], location_type: "international", region: "Americas", specific_location: "Las Vegas, USA" },
  { title: "Coachella", categories: ["music_party", "travel"], location_type: "international", region: "Americas", specific_location: "California, USA" },
  { title: "Caprices Festival Switzerland", categories: ["music_party", "travel"], location_type: "international", region: "Europe", specific_location: "Switzerland" },
  { title: "Petra rave", categories: ["music_party", "travel"], location_type: "international", region: "Middle East & Africa", specific_location: "Petra, Jordan" },
  { title: "Wonderfruit Thailand", categories: ["music_party", "travel"], location_type: "international", region: "Asia", specific_location: "Thailand" },
  { title: "Kanye concert", categories: ["music_party"] },
  { title: "Las Vegas Sphere music event", categories: ["music_party", "travel"], location_type: "international", region: "Americas", specific_location: "Las Vegas, USA" },
];

const adventureAirSnow: BucketListItemInput[] = [
  { title: "Skydive Dubai", categories: ["adventure"], location_type: "international", region: "Middle East & Africa", specific_location: "Dubai", is_physical: true },
  { title: "Skydive Switzerland", categories: ["adventure", "travel"], location_type: "international", region: "Europe", specific_location: "Switzerland", is_physical: true },
  { title: "Paragliding", categories: ["adventure"], is_physical: true },
  { title: "Snowboard Aspen", categories: ["adventure", "travel"], location_type: "international", region: "Americas", specific_location: "Aspen, Colorado", is_physical: true, seasonality: ["winter"] },
  { title: "Complete a black run - Niseko or St Moritz", categories: ["adventure", "challenges"], location_type: "international", is_physical: true },
  { title: "Heli-ski Hokkaido", categories: ["adventure", "travel"], location_type: "international", region: "Asia", specific_location: "Hokkaido, Japan", is_physical: true, description: "Need to be comfortable in deep powder" },
];

const adventureWater: BucketListItemInput[] = [
  { title: "Surf URBNSURF Sydney", categories: ["adventure", "skills"], location_type: "sydney", specific_location: "Sydney", is_physical: true, actionability: "can_do_now" },
  { title: "Surf Bali", categories: ["adventure", "travel"], location_type: "international", region: "Asia", specific_location: "Bali", is_physical: true },
  { title: "Wakeboarding Cables Wake Park", categories: ["adventure"], location_type: "sydney", specific_location: "Sydney", is_physical: true, actionability: "can_do_now" },
  { title: "Paddleboarding", categories: ["adventure"], is_physical: true, actionability: "can_do_now" },
  { title: "Kayaking", categories: ["adventure"], is_physical: true, actionability: "can_do_now" },
  { title: "Yacht charter or ocean cruise", categories: ["adventure", "travel"] },
  { title: "Alaskan cruise", categories: ["adventure", "travel"], location_type: "international", region: "Americas", specific_location: "Alaska" },
];

const adventureLand: BucketListItemInput[] = [
  { title: "Rock climbing", categories: ["adventure", "skills"], is_physical: true },
  { title: "Climb a volcano", categories: ["adventure"], is_physical: true },
  { title: "Desert rally driving", categories: ["adventure"], is_physical: false },
  { title: "Mountain biking", categories: ["adventure", "skills"], is_physical: true },
  { title: "Campervan camping trip", categories: ["adventure", "travel"] },
  { title: "Drive Big Sur", categories: ["adventure", "travel"], location_type: "international", region: "Americas", specific_location: "California, USA" },
  { title: "Drive Banff-Jasper", categories: ["adventure", "travel"], location_type: "international", region: "Americas", specific_location: "Canada" },
  { title: "Drive Trans-Siberian Highway", categories: ["adventure", "travel"], location_type: "international", region: "Asia" },
  { title: "Ride the Orient Express", categories: ["adventure", "travel"], location_type: "international", region: "Europe" },
  { title: "Drive Nürburgring", categories: ["adventure", "challenges"], location_type: "international", region: "Europe", specific_location: "Nürburgring, Germany" },
];

const personalGrowth: BucketListItemInput[] = [
  { title: "Attend a TED Talk", categories: ["personal_growth"] },
  { title: "Complete Landmark Forum", categories: ["personal_growth"] },
  { title: "10-day Vipassana retreat", categories: ["personal_growth"], is_physical: false },
  { title: "Live one month abroad with no digital devices", categories: ["personal_growth", "travel", "challenges"] },
  { title: "Live in a monastery", categories: ["personal_growth", "travel"] },
  { title: "Pass HSK3 Mandarin exam", categories: ["personal_growth", "skills"], description: "600 words" },
  { title: "Psychedelic healing retreat", categories: ["personal_growth", "health_wellness"] },
  { title: "Join a scientific expedition", categories: ["personal_growth", "adventure"] },
  { title: "Camp under desert stars", categories: ["personal_growth", "adventure", "travel"] },
  { title: "EatWith / Couchsurfing meal abroad", categories: ["personal_growth", "travel", "food_drink"] },
  { title: "Join a professional body", categories: ["personal_growth", "business_professional"] },
  { title: "Explore board roles", categories: ["personal_growth", "business_professional"] },
  { title: "Sit on a nonprofit/industry board", categories: ["personal_growth", "social_impact", "business_professional"] },
  { title: "Advocate publicly for a cause", categories: ["personal_growth", "social_impact"] },
  { title: "Fund scholarships", categories: ["personal_growth", "social_impact"], actionability: "needs_saving" },
  { title: "Set up a foundation or donor-advised fund", categories: ["personal_growth", "social_impact", "life_legacy"], actionability: "needs_saving" },
  { title: "Pursue one dream project per year", categories: ["personal_growth", "creative"], description: "Write a book, craft a cabin, found a festival" },
  { title: "Document life lessons", categories: ["personal_growth", "creative"] },
  { title: "Complete AICD/GAICD course", categories: ["personal_growth", "business_professional"], description: "Take a seat on a nonprofit or school board" },
  { title: "Underwrite a community asset", categories: ["personal_growth", "social_impact"], description: "E.g. community park", actionability: "needs_saving" },
  { title: "Wellness retreat Thailand", categories: ["personal_growth", "health_wellness", "travel"], location_type: "international", region: "Asia", specific_location: "Thailand", description: "Silent retreat + ride elephant" },
];

const creative: BucketListItemInput[] = [
  { title: "Travel-inspired painting & DJ set", categories: ["creative"] },
  { title: "Record a music album", categories: ["creative", "challenges"] },
  { title: "Learn DJing & host party", categories: ["creative", "skills"], description: "Home or venue" },
  { title: "Shoot a film / be background extra", categories: ["creative"] },
  { title: "Build a robot", categories: ["creative", "skills"] },
  { title: "Make a 3-min smartphone short movie", categories: ["creative"], description: "Submit to FilmFreeway" },
  { title: "Start an art museum", categories: ["creative", "life_legacy", "business_professional"], actionability: "needs_milestone" },
  { title: "Build a fashion/shoe line", categories: ["creative", "business_professional"], actionability: "needs_saving" },
  { title: "Attend culinary school", categories: ["creative", "skills", "food_drink"] },
  { title: "Carve a stone sculpture", categories: ["creative", "skills"] },
  { title: "Restore vintage cars", categories: ["creative", "skills"], description: "E46 M3, JDM, E92 M3, old Aston, Audi R8" },
];

const challenges: BucketListItemInput[] = [
  { title: "WSOP Poker Main Event - survive Day 2", categories: ["challenges"], location_type: "international", region: "Americas", specific_location: "Las Vegas" },
  { title: "Play WSOP bracelet events", categories: ["challenges"], location_type: "international", region: "Americas", specific_location: "Las Vegas", description: "Small field freezeouts, $1,500 mixed games" },
  { title: "Rail the WSOP main event", categories: ["challenges", "travel"], location_type: "international", region: "Americas", specific_location: "Las Vegas" },
  { title: "WSOP Academy seminar", categories: ["challenges", "skills"], location_type: "international", region: "Americas", specific_location: "Las Vegas" },
  { title: "Play 60-min DJ set at boutique festival", categories: ["challenges", "creative", "music_party"] },
  { title: "Fly Singapore Airlines First Class Suites", categories: ["challenges", "travel"] },
  { title: "Fly Emirates First Class", categories: ["challenges", "travel"] },
  { title: "Fly Qatar Q Suites", categories: ["challenges", "travel"] },
  { title: "Fly business class", categories: ["challenges", "travel"] },
  { title: "Play Sentosa Golf Club", categories: ["challenges", "sporting_events"], location_type: "international", region: "Asia", specific_location: "Singapore" },
  { title: "Dunk a basketball", categories: ["challenges", "health_wellness"], is_physical: true },
  { title: "Run Sydney Marathon", categories: ["challenges", "sporting_events"], location_type: "sydney", specific_location: "Sydney", is_physical: true },
  { title: "Set a Guinness World Record", categories: ["challenges"] },
];

const skills: BucketListItemInput[] = [
  { title: "Master golf", categories: ["skills"], is_physical: true, target_timeframe: "ongoing" },
  { title: "Master Mandarin", categories: ["skills"], target_timeframe: "ongoing" },
  { title: "Master yoga/pilates", categories: ["skills", "health_wellness"], is_physical: true, target_timeframe: "ongoing" },
  { title: "Build gym strength", categories: ["skills", "health_wellness"], is_physical: true, target_timeframe: "ongoing" },
  { title: "Master surfing", categories: ["skills", "adventure"], is_physical: true, target_timeframe: "ongoing" },
  { title: "Master snowboarding/skiing", categories: ["skills", "adventure"], is_physical: true, target_timeframe: "ongoing" },
  { title: "Master BBQ meats & cooking", categories: ["skills", "food_drink"], target_timeframe: "ongoing" },
  { title: "Master DJing", categories: ["skills", "creative"], target_timeframe: "ongoing" },
  { title: "Learn painting", categories: ["skills", "creative"] },
  { title: "Learn drawing", categories: ["skills", "creative"] },
  { title: "Learn calligraphy", categories: ["skills", "creative"] },
  { title: "Learn stone-carving", categories: ["skills", "creative"] },
  { title: "Learn bonsai pruning", categories: ["skills", "creative"] },
  { title: "Learn a martial art", categories: ["skills", "health_wellness"], is_physical: true },
  { title: "Learn mountain biking", categories: ["skills", "adventure"], is_physical: true },
  { title: "Learn rowing", categories: ["skills", "health_wellness"], is_physical: true },
  { title: "Improve swimming", categories: ["skills", "health_wellness"], is_physical: true },
  { title: "Learn interior design", categories: ["skills", "creative"] },
  { title: "Learn to ride a motorbike", categories: ["skills"] },
  { title: "Learn 3D printing", categories: ["skills", "creative"] },
  { title: "Learn knife-making", categories: ["skills", "creative"] },
  { title: "Write a book", categories: ["skills", "creative", "life_legacy"] },
  { title: "Learn music production", categories: ["skills", "creative"] },
];

const australiaSpecific: BucketListItemInput[] = [
  { title: "Melbourne Peninsula hot springs", categories: ["travel", "health_wellness"], location_type: "australia", specific_location: "Melbourne" },
  { title: "Melbourne LUME exhibit", categories: ["cultural_events"], location_type: "australia", specific_location: "Melbourne" },
  { title: "Puffing Billy train Melbourne", categories: ["travel"], location_type: "australia", specific_location: "Melbourne" },
  { title: "MONA Hobart", categories: ["cultural_events", "travel"], location_type: "australia", specific_location: "Hobart, Tasmania" },
  { title: "SailGP Sydney", categories: ["sporting_events"], location_type: "sydney", specific_location: "Sydney Harbour", season_notes: "February" },
  { title: "Camp by the beach", categories: ["adventure"], location_type: "australia" },
  { title: "Learn to surf Sydney", categories: ["skills", "adventure"], location_type: "sydney", specific_location: "Sydney", is_physical: true, actionability: "can_do_now" },

  // Sydney Dining
  { title: "Sushi Oe", categories: ["food_drink"], location_type: "sydney", specific_location: "Sydney", actionability: "can_do_now" },
  { title: "Yoshii's Omakase", categories: ["food_drink"], location_type: "sydney", specific_location: "Sydney", actionability: "can_do_now" },
  { title: "Oncore by Clare Smyth", categories: ["food_drink"], location_type: "sydney", specific_location: "Sydney", actionability: "can_do_now" },
  { title: "Chef's Table experience", categories: ["food_drink"], actionability: "can_do_now" },
  { title: "Degustation menu experience", categories: ["food_drink"], actionability: "can_do_now" },

  // Sydney Sports & Clubs
  { title: "Play Royal Sydney Golf Club", categories: ["sporting_events", "challenges"], location_type: "sydney", specific_location: "Sydney" },
  { title: "Play NSW Golf Club", categories: ["sporting_events"], location_type: "sydney", specific_location: "Sydney" },
  { title: "Attend horse races", categories: ["sporting_events"], location_type: "sydney", specific_location: "Sydney", actionability: "can_do_now" },
  { title: "Join Soho House Sydney", categories: ["life_legacy"], location_type: "sydney", specific_location: "Darlinghurst, Sydney" },
  { title: "Join Work Club Global", categories: ["business_professional"], location_type: "sydney", specific_location: "Sydney" },
  { title: "Visit Club 77", categories: ["music_party"], location_type: "sydney", specific_location: "Sydney", actionability: "can_do_now" },
  { title: "Join Tattersalls Club", categories: ["life_legacy"], location_type: "sydney", specific_location: "Sydney" },
  { title: "Join Automobile Club of Australia", categories: ["life_legacy"], location_type: "sydney", specific_location: "Sydney" },
  { title: "Yacht on Sydney Harbour", categories: ["adventure"], location_type: "sydney", specific_location: "Sydney Harbour" },

  // NSW Hikes
  { title: "Mt Solitary hike", categories: ["adventure"], location_type: "sydney", specific_location: "Blue Mountains, NSW", is_physical: true },
  { title: "Grand Canyon Loop Blue Mountains", categories: ["adventure"], location_type: "sydney", specific_location: "Blue Mountains, NSW", is_physical: true },
];

const lifeLegacy: BucketListItemInput[] = [
  { title: "Have kids", categories: ["life_legacy"], ownership: "couples" },
  { title: "Write a coffee-table book", categories: ["life_legacy", "creative"], description: "Blending artworks with photography from travels + life lessons, memoir style on FIRE/FATfire lifestyle" },
  { title: "Create a Pokemon card store", categories: ["life_legacy", "business_professional"] },
  { title: "Build a business", categories: ["life_legacy", "business_professional"] },
  { title: "Launch YouTube channel", categories: ["life_legacy", "business_professional", "creative"] },
  { title: "Launch newsletter", categories: ["life_legacy", "business_professional", "creative"] },
  { title: "Start a fund", categories: ["life_legacy", "business_professional"], actionability: "needs_milestone" },
  { title: "Create robots", categories: ["life_legacy", "creative", "skills"] },
  { title: "Achieve Hyatt Lifetime Globalist", categories: ["life_legacy", "challenges"] },
  { title: "Own/curate an art museum", categories: ["life_legacy", "creative"], actionability: "needs_saving" },
  { title: "Own a sports team", categories: ["life_legacy"], actionability: "needs_saving" },
  { title: "Volunteer abroad", categories: ["life_legacy", "social_impact"] },
  { title: "Invest in a dog sanctuary", categories: ["life_legacy", "social_impact"], actionability: "needs_saving" },
  { title: "Buy holiday house/cabin", categories: ["life_legacy", "material"], actionability: "needs_saving" },
  { title: "Buy off-grid acreage", categories: ["life_legacy", "material"], actionability: "needs_saving" },
  { title: "Buy penthouse", categories: ["life_legacy", "material"], actionability: "needs_saving" },
  { title: "Reach 8-figure USD net worth", categories: ["life_legacy", "challenges"], actionability: "needs_milestone" },
  { title: "Major philanthropy contribution", categories: ["life_legacy", "social_impact"], actionability: "needs_saving" },
  { title: "Join Arcthecommunity", categories: ["life_legacy"] },
  { title: "Hit 100k views on content", categories: ["life_legacy", "challenges"] },
  { title: "Create donor-advised fund $50k-$250k", categories: ["life_legacy", "social_impact"], actionability: "needs_saving" },
  { title: "Year of curiosity experiment", categories: ["life_legacy", "personal_growth"] },
  { title: "Year of relationships experiment", categories: ["life_legacy", "personal_growth"] },
  { title: "Year of simplicity experiment", categories: ["life_legacy", "personal_growth"] },
  { title: "Quality of presence over quantity", categories: ["life_legacy", "personal_growth"], target_timeframe: "ongoing" },
  { title: "Create something that lasts - body of work", categories: ["life_legacy", "creative"], target_timeframe: "ongoing" },
];

const materialGoals: BucketListItemInput[] = [
  { title: "Buy AP watch from London boutique", categories: ["material"], location_type: "international", region: "Europe", specific_location: "London", description: "15500ST or 15202ST", actionability: "needs_saving" },
  { title: "Buy BMW M3", categories: ["material"], actionability: "needs_saving" },
  { title: "Buy Porsche GT3", categories: ["material"], actionability: "needs_saving" },
  { title: "Buy Audi RS6", categories: ["material"], actionability: "needs_saving" },
  { title: "Build vintage car collection", categories: ["material", "creative"], description: "Heritage BMW, Alpina, race car project", actionability: "needs_saving" },
  { title: "Buy PS5", categories: ["material"], actionability: "can_do_now" },
  { title: "Design forever architectural home Sydney", categories: ["material", "life_legacy"], location_type: "sydney", actionability: "needs_saving" },
  { title: "Build dream garage", categories: ["material"], actionability: "needs_saving" },
  { title: "Buy vacation home", categories: ["material", "life_legacy"], description: "Italy, Vienna, beach, or ski chalet", actionability: "needs_saving" },
  { title: "Buy farmland", categories: ["material", "life_legacy"], actionability: "needs_saving" },
  { title: "Build mancave with PC + collectibles", categories: ["material"] },
  { title: "Build cabin in the woods", categories: ["material", "life_legacy"], actionability: "needs_saving" },
  { title: "Build bunker", categories: ["material"], actionability: "needs_saving" },
  { title: "Stay at Aman Sri Lanka", categories: ["material", "travel"], location_type: "international", region: "Asia", specific_location: "Sri Lanka" },
  { title: "Stay at 5-star hotels", categories: ["material", "travel"], description: "Aman, Rosewood, Capella, Hoshinoya Tokyo" },
  { title: "Stay at Club Med", categories: ["material", "travel"] },
  { title: "Buy Tesla Optimus robot", categories: ["material"], actionability: "needs_milestone" },
  { title: "Buy land for future build", categories: ["material", "life_legacy"], actionability: "needs_saving" },
];

const businessProfessional: BucketListItemInput[] = [
  { title: "Craft LifeOS in Notion/Obsidian", categories: ["business_professional", "personal_growth"] },
  { title: "Launch shoe/fashion line", categories: ["business_professional", "creative"], description: "50-250k capital, 1-2 years, start lean with storytelling", actionability: "needs_saving" },
  { title: "Build boutique 2-4 unit property development", categories: ["business_professional"], actionability: "needs_saving" },
  { title: "Become a commercial artist", categories: ["business_professional", "creative"] },
  { title: "Hire a personal assistant", categories: ["business_professional"], actionability: "needs_milestone" },
  { title: "Create home gym & sauna", categories: ["business_professional", "health_wellness", "material"] },
  { title: "Offer a mentorship program", categories: ["business_professional", "social_impact"] },
  { title: "Create fantasy sports app", categories: ["business_professional"], status: "in_progress", description: "Breakout - currently building" },
  { title: "Work/live overseas stint", categories: ["business_professional", "travel", "personal_growth"] },
  { title: "Become a DJ professionally", categories: ["business_professional", "creative"] },
  { title: "Release an album/mix", categories: ["business_professional", "creative"] },
  { title: "London AP store networking", categories: ["business_professional"], location_type: "international", region: "Europe", specific_location: "London" },
  { title: "Start high-quality YouTube channel", categories: ["business_professional", "creative"] },
  { title: "Start newsletter", categories: ["business_professional", "creative"] },
];

const socialImpact: BucketListItemInput[] = [
  { title: "Voluntourism via IVHQ", categories: ["social_impact", "travel"], description: "Build homes, teach English" },
  { title: "Environmental projects - cleanups, reforestation", categories: ["social_impact"] },
  { title: "Local fundraisers/hackathons with nonprofits", categories: ["social_impact"] },
  { title: "Start local shelter or disaster-relief org", categories: ["social_impact", "life_legacy"], actionability: "needs_milestone" },
  { title: "Mentor youth / coach a team", categories: ["social_impact"] },
  { title: "Serve on charity boards", categories: ["social_impact", "personal_growth"] },
  { title: "Contribute to scientific research", categories: ["social_impact", "personal_growth"] },
];

const healthSupport: BucketListItemInput[] = [
  { title: "Get concierge doctor", categories: ["health_wellness"], actionability: "needs_milestone" },
  { title: "Get cardiologist", categories: ["health_wellness"] },
  { title: "Get personal trainer", categories: ["health_wellness"], actionability: "can_do_now" },
  { title: "Get nutritionist", categories: ["health_wellness"] },
];

const leisureHobbies: BucketListItemInput[] = [
  { title: "Learn woodworking", categories: ["skills", "creative"] },
  { title: "Target shooting / range", categories: ["skills", "adventure"] },
  { title: "Track-day driving", categories: ["adventure", "challenges"] },
  { title: "Train dogs", categories: ["skills"] },
  { title: "Plan vacations around exploration themes", categories: ["travel", "personal_growth"], target_timeframe: "ongoing" },
  { title: "Horology / watch modding", categories: ["skills", "creative"] },
  { title: "Making robotics", categories: ["skills", "creative"] },
  { title: "Mokuhanga Japanese woodblock printing", categories: ["skills", "creative"] },
];

const foodDrink: BucketListItemInput[] = [
  { title: "Global omakase experiences", categories: ["food_drink", "travel"], target_timeframe: "ongoing" },
  { title: "Degustation menu experiences", categories: ["food_drink"], target_timeframe: "ongoing" },
  { title: "Explore international fine-dining list", categories: ["food_drink", "travel"], target_timeframe: "ongoing" },
];

// ============================================================================
// SEED LOGIC
// ============================================================================

async function seedBucketList() {
  console.log('🌱 Starting bucket list seed...\n');

  // Combine all arrays
  const allItems: BucketListItemInput[] = [
    ...completedItems.map(item => ({ ...item, status: 'completed' as const })),
    ...priorityItems.map(item => ({ ...item, is_priority: true })),
    ...europeTravel,
    ...middleEastAfrica,
    ...asiaTravel,
    ...americasTravel,
    ...oceaniaTravel,
    ...culturalEvents,
    ...sportingEvents,
    ...musicParty,
    ...adventureAirSnow,
    ...adventureWater,
    ...adventureLand,
    ...personalGrowth,
    ...creative,
    ...challenges,
    ...skills,
    ...australiaSpecific,
    ...lifeLegacy,
    ...materialGoals,
    ...businessProfessional,
    ...socialImpact,
    ...healthSupport,
    ...leisureHobbies,
    ...foodDrink,
  ];

  console.log(`📊 Total items to process: ${allItems.length}`);

  // Deduplicate by title
  const uniqueItems = new Map<string, BucketListItemInput>();
  allItems.forEach(item => {
    const existing = uniqueItems.get(item.title);
    if (existing) {
      // Merge properties, preferring non-default values
      uniqueItems.set(item.title, {
        ...existing,
        ...item,
        // Merge categories
        categories: Array.from(new Set([...existing.categories, ...item.categories])),
      });
    } else {
      uniqueItems.set(item.title, item);
    }
  });

  console.log(`✨ Unique items after deduplication: ${uniqueItems.size}\n`);

  // Get the first user to set as added_by
  const { data: users } = await supabase.auth.admin.listUsers();
  const userId = users?.users[0]?.id;

  if (!userId) {
    console.error('❌ No users found in the system. Please create a user first.');
    process.exit(1);
  }

  console.log(`👤 Using user: ${users.users[0].email} (${userId})\n`);

  // Apply defaults
  const itemsToInsert = Array.from(uniqueItems.values()).map(item => ({
    ...item,
    status: item.status || 'idea',
    ownership: item.ownership || 'couples',
    is_priority: item.is_priority || false,
    target_timeframe: item.target_timeframe || 'someday',
    added_by: userId,
  }));

  // Insert items with duplicate prevention
  let inserted = 0;
  let skipped = 0;
  let errors = 0;

  for (const item of itemsToInsert) {
    try {
      // Check if item already exists
      const { data: existing, error: checkError } = await supabase
        .from('bucket_list_items')
        .select('id, title')
        .eq('title', item.title)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 = no rows returned, which is fine
        console.error(`❌ Error checking for "${item.title}":`, checkError.message);
        errors++;
        continue;
      }

      if (existing) {
        console.log(`⏭️  Skipping "${item.title}" (already exists)`);
        skipped++;
        continue;
      }

      // Insert new item
      const { error: insertError } = await supabase
        .from('bucket_list_items')
        .insert([item]);

      if (insertError) {
        console.error(`❌ Error inserting "${item.title}":`, insertError.message);
        errors++;
      } else {
        console.log(`✅ Inserted "${item.title}"`);
        inserted++;
      }
    } catch (error) {
      console.error(`❌ Unexpected error with "${item.title}":`, error);
      errors++;
    }
  }

  console.log('\n🎉 Seed completed!');
  console.log(`   ✅ Inserted: ${inserted}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`   📊 Total: ${inserted + skipped + errors}/${itemsToInsert.length}`);
}

// Run the seed
seedBucketList()
  .then(() => {
    console.log('\n✨ All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });

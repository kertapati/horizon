/**
 * Migrate Countries
 *
 * Populates the country field based on specific_location
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Map location keywords to countries
const locationToCountry: Record<string, string> = {
  // Europe - Italy
  'Lake Como': 'Italy',
  'Lake Garda': 'Italy',
  'Amalfi Coast': 'Italy',
  'Amalfi': 'Italy',
  'Matera': 'Italy',
  'Bologna': 'Italy',
  'Dolomites': 'Italy',
  'Capri': 'Italy',
  'Arezzo': 'Italy',
  'Rome': 'Italy',
  'Venice': 'Italy',
  'Florence': 'Italy',
  'Milan': 'Italy',
  'Sicily': 'Italy',

  // Europe - Switzerland
  'Mt Pilatus': 'Switzerland',
  'Pilatus': 'Switzerland',
  'Interlaken': 'Switzerland',
  'Geneva': 'Switzerland',
  'Swiss Alps': 'Switzerland',
  'Switzerland': 'Switzerland',
  'St Moritz': 'Switzerland',
  'Gstaad': 'Switzerland',
  'Zermatt': 'Switzerland',
  'Zurich': 'Switzerland',

  // Europe - France
  'Chamonix': 'France',
  'Paris': 'France',
  'Mont-Saint-Michel': 'France',
  'Marseille': 'France',
  'Nice': 'France',
  'St Tropez': 'France',
  'Cannes': 'France',
  'Bordeaux': 'France',
  'Lyon': 'France',
  'Versailles': 'France',
  'French Riviera': 'France',
  'South of France': 'France',
  'Château Margaux': 'France',
  'Tour du Mont Blanc': 'France',

  // Europe - Spain
  'Granada': 'Spain',
  'Mallorca': 'Spain',
  'Ibiza': 'Spain',
  'Caminito del Rey': 'Spain',
  'Barcelona': 'Spain',
  'Madrid': 'Spain',
  'Seville': 'Spain',
  'Valencia': 'Spain',
  'Basque': 'Spain',

  // Europe - UK
  'Edinburgh': 'UK',
  'Scotland': 'UK',
  'Bath': 'UK',
  'London': 'UK',
  'Stonehenge': 'UK',
  'Goodwood': 'UK',
  'Cotswolds': 'UK',
  'Wales': 'UK',
  'Belfast': 'UK',
  'Royal Scotsman': 'UK',
  'Printworks London': 'UK',

  // Europe - Germany
  'Munich': 'Germany',
  'Berlin': 'Germany',
  'Frankfurt': 'Germany',
  'Hamburg': 'Germany',
  'Cologne': 'Germany',
  'Neuschwanstein': 'Germany',
  'Bavaria': 'Germany',

  // Europe - Greece
  'Samaria Gorge': 'Greece',
  'Crete': 'Greece',
  'Meteora': 'Greece',
  'Santorini': 'Greece',
  'Mykonos': 'Greece',
  'Athens': 'Greece',

  // Europe - Portugal
  'Lisbon': 'Portugal',
  'Porto': 'Portugal',
  'Algarve': 'Portugal',
  'Madeira': 'Portugal',
  'Azores': 'Portugal',

  // Europe - Others
  'Slovenia': 'Slovenia',
  'Ljubljana': 'Slovenia',
  'Croatia': 'Croatia',
  'Dubrovnik': 'Croatia',
  'Split': 'Croatia',
  'Bosnia': 'Bosnia and Herzegovina',
  'Sarajevo': 'Bosnia and Herzegovina',
  'Iceland': 'Iceland',
  'Reykjavik': 'Iceland',
  'Norway': 'Norway',
  'Oslo': 'Norway',
  'Bergen': 'Norway',
  'Sweden': 'Sweden',
  'Stockholm': 'Sweden',
  'Finland': 'Finland',
  'Helsinki': 'Finland',
  'Denmark': 'Denmark',
  'Copenhagen': 'Denmark',
  'Netherlands': 'Netherlands',
  'Amsterdam': 'Netherlands',
  'Austria': 'Austria',
  'Vienna': 'Austria',
  'Salzburg': 'Austria',
  'Turkey': 'Turkey',
  'Istanbul': 'Turkey',
  'Cappadocia': 'Turkey',
  'Malta': 'Malta',
  'Valletta': 'Malta',

  // Asia - Japan
  'Hakuba': 'Japan',
  'Niseko': 'Japan',
  'Hokkaido': 'Japan',
  'Okinawa': 'Japan',
  'Kanazawa': 'Japan',
  'Takayama': 'Japan',
  'Ginzan Onsen': 'Japan',
  'Mt Fuji': 'Japan',
  'Tokyo': 'Japan',
  'Kyoto': 'Japan',
  'Osaka': 'Japan',
  'Hiroshima': 'Japan',
  'Nara': 'Japan',
  'Japan': 'Japan',
  'PokéPark': 'Japan',

  // Asia - China
  'Guilin': 'China',
  'Yunnan': 'China',
  'Huangshan': 'China',
  'Terracotta Warriors': 'China',
  "Xi'an": 'China',
  'Harbin': 'China',
  'Chongqing': 'China',
  'Beijing': 'China',
  'Shanghai': 'China',
  'Hong Kong': 'Hong Kong',
  'Macau': 'Macau',

  // Asia - Southeast Asia
  'Bangkok': 'Thailand',
  'Thailand': 'Thailand',
  'Chiang Mai': 'Thailand',
  'Phuket': 'Thailand',
  'Vietnam': 'Vietnam',
  'Hanoi': 'Vietnam',
  'Ho Chi Minh': 'Vietnam',
  'Cambodia': 'Cambodia',
  'Angkor Wat': 'Cambodia',
  'Phnom Penh': 'Cambodia',
  'Malaysia': 'Malaysia',
  'Kuala Lumpur': 'Malaysia',
  'Singapore': 'Singapore',
  'Philippines': 'Philippines',
  'Manila': 'Philippines',
  'Palawan': 'Philippines',
  'Indonesia': 'Indonesia',
  'Bali': 'Indonesia',
  'Jakarta': 'Indonesia',

  // Asia - South Asia
  'India': 'India',
  'Delhi': 'India',
  'Mumbai': 'India',
  'Taj Mahal': 'India',
  'Goa': 'India',
  'Kerala': 'India',
  'Nepal': 'Nepal',
  'Kathmandu': 'Nepal',
  'Everest': 'Nepal',
  'Annapurna': 'Nepal',
  'Sri Lanka': 'Sri Lanka',
  'Colombo': 'Sri Lanka',
  'Maldives': 'Maldives',

  // Asia - Other
  'Taiwan': 'Taiwan',
  'Taipei': 'Taiwan',
  'Korea': 'South Korea',
  'Seoul': 'South Korea',
  'Busan': 'South Korea',

  // Americas - USA
  'New York': 'USA',
  'NYC': 'USA',
  'Washington': 'USA',
  'D.C.': 'USA',
  'Big Sur': 'USA',
  'California': 'USA',
  'Miami': 'USA',
  'Las Vegas': 'USA',
  'Joshua Tree': 'USA',
  'Hawaii': 'USA',
  'Alaska': 'USA',
  'Augusta': 'USA',
  'Boston': 'USA',
  'Chicago': 'USA',
  'Los Angeles': 'USA',
  'San Francisco': 'USA',
  'Seattle': 'USA',
  'Portland': 'USA',
  'Austin': 'USA',
  'New Orleans': 'USA',
  'Yosemite': 'USA',
  'Grand Canyon': 'USA',
  'Yellowstone': 'USA',
  'Zion': 'USA',
  'Antelope Canyon': 'USA',

  // Americas - Canada
  'Vancouver': 'Canada',
  'Banff': 'Canada',
  'Jasper': 'Canada',
  'Whistler': 'Canada',
  'Quebec': 'Canada',
  'Toronto': 'Canada',
  'Montreal': 'Canada',
  'Canada': 'Canada',

  // Americas - Mexico
  'Mexico': 'Mexico',
  'Teotihuacán': 'Mexico',
  'Tulum': 'Mexico',
  'Cancun': 'Mexico',
  'Mexico City': 'Mexico',
  'Day of the Dead': 'Mexico',

  // Americas - South America
  'Brazil': 'Brazil',
  'Rio de Janeiro': 'Brazil',
  'São Paulo': 'Brazil',
  'Argentina': 'Argentina',
  'Buenos Aires': 'Argentina',
  'Patagonia': 'Argentina',
  'Peru': 'Peru',
  'Machu Picchu': 'Peru',
  'Lima': 'Peru',
  'Inca Trail': 'Peru',
  'Costa Rica': 'Costa Rica',
  'Cuba': 'Cuba',
  'Havana': 'Cuba',
  'Jamaica': 'Jamaica',
  'Guatemala': 'Guatemala',
  'Colombia': 'Colombia',
  'Chile': 'Chile',
  'Easter Island': 'Chile',

  // Middle East & Africa
  'Dubai': 'UAE',
  'Abu Dhabi': 'UAE',
  'Jordan': 'Jordan',
  'Petra': 'Jordan',
  'Wadi Rum': 'Jordan',
  'South Africa': 'South Africa',
  'Cape Town': 'South Africa',
  'Tugela Falls': 'South Africa',
  'Tanzania': 'Tanzania',
  'Kilimanjaro': 'Tanzania',
  'Serengeti': 'Tanzania',
  'Egypt': 'Egypt',
  'Cairo': 'Egypt',
  'Pyramids': 'Egypt',
  'Morocco': 'Morocco',
  'Marrakech': 'Morocco',

  // Oceania
  'New Zealand': 'New Zealand',
  'Milford Sound': 'New Zealand',
  'Queenstown': 'New Zealand',
  'Auckland': 'New Zealand',
  'Wellington': 'New Zealand',
  'Fiji': 'Fiji',
  'Whitsundays': 'Australia',
  'Great Barrier Reef': 'Australia',
  'Lord Howe Island': 'Australia',
  'Melbourne': 'Australia',
  'MONA': 'Australia',
  'Tasmania': 'Australia',
  'Perth': 'Australia',
  'Darwin': 'Australia',
  'Uluru': 'Australia',
  'Byron Bay': 'Australia',
  'Gold Coast': 'Australia',
  'Cairns': 'Australia',
  'Adelaide': 'Australia',
  'Canberra': 'Australia',

  // Sydney-specific
  'Brighton Beach': 'Australia',
  'Mt Kosciuszko': 'Australia',
  'Blue Mountains': 'Australia',
};

async function migrateCountries() {
  console.log('🌍 Migrating country data...\n');

  try {
    // Get all items
    const { data: items, error } = await supabase
      .from('bucket_list_items')
      .select('id, title, specific_location, location_type');

    if (error) {
      console.error('❌ Error fetching items:', error);
      return;
    }

    console.log(`📊 Processing ${items?.length || 0} items...\n`);

    let updated = 0;
    let skipped = 0;

    for (const item of items || []) {
      let country: string | null = null;

      // Try to match specific_location to country
      if (item.specific_location) {
        const location = item.specific_location.toLowerCase();

        for (const [keyword, countryName] of Object.entries(locationToCountry)) {
          if (location.includes(keyword.toLowerCase())) {
            country = countryName;
            break;
          }
        }
      }

      // Update if we found a country
      if (country) {
        const { error: updateError } = await supabase
          .from('bucket_list_items')
          .update({ country })
          .eq('id', item.id);

        if (updateError) {
          console.error(`❌ Error updating ${item.title}:`, updateError);
        } else {
          console.log(`✅ ${item.title} → ${country}`);
          updated++;
        }
      } else {
        console.log(`⏭️  Skipped: ${item.title} (no country match)`);
        skipped++;
      }
    }

    console.log(`\n📊 Migration complete!`);
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

migrateCountries();

/**
 * Import Restaurant Data from Unstructured Notes
 *
 * This script parses the raw restaurant notes and imports them into the Supabase database.
 * Run with: npx tsx scripts/import-restaurants.ts
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
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ============================================================================
// RAW DATA - The unstructured restaurant notes
// ============================================================================

const rawData = `
City

Goros Surry Hills

Gaku robata grill darlinghurst ($280 omakase)

Marys

Bar Luca

Honkas potts point

Yakiniku yokocho

Chubby cheeks paddington

Chin Chin surry hills

Lode pies and bakeries

jazushi surry hills

Pennys cheese shop chesese toastie potts point

Big poppas darlinghurst

Mjolner bar Redfern

Suzuya Surry Hills

Xiao gege snowball mochi chinatown

The Dolar Shop haymarket

Harry Deane Bar

Sang by Mubasa Surry Hills

Saga bar chippendale

PS40

the bearded tit redfern

Lana

Le foote

boon cafe

duck and rice cbd

chuuka pyrmont

poly surry hills

bistecca

henry lees redfern

Huxtaburger redfern

gami chicken and beer

Eternity café town hall

Jimmys falafel

Artificer surry hills (brunch)

Dean and nancy on 22 (fancy bar)

Edition coffee roasters steam mill lane

XOPP haymarket

Nanjing dumpling haymarket

Chongqing street noodle haymarket

Xing xing sichuan dish haymarket

Chinese noodle restaurant haymarket

Botswana butchery sydney

Pub life kitchen surry hills

Haco

Nomad

Pellegrino 2000 surry hills

South Dowling Sandwiches darlinghurst

Mrs Palmer sandwich darlinghurst

Wan restaurant mascot (japanese)

Viand Woolloomooloo

Paski Vineria Popolare15 Darlinghurst

Parlar potts point spanish

Mumu (SEA food)

Jane Surry Hills

Shell House Dining

Matsusaka backstreet jap bbq buffet haymarket

Aalia

Palazzo salatto

Bay Nine Omakase The Rocks

Whalebridge Circular Quay

Meet alice bar

Oborozuki circular quay

Gildas surry hills spanish

Goodsline pyrmont café

Franca brasserie potts point

Chaco ramen darlinghurst

Ragazzi wine and pasta sydney

The gidley (steakhouse no phones)

Beau surry hills

Golden century bbq

Hubert happy hour 5-6pm

Cinnabon

Kingsley steakhouse woolloomoolloo

Malay chinese circular quay

Oti pizza

Tao restaurant and bar

Ezra kings cross

Franca brasserie potts point

Bouillon l'entrecote sydney

10 william st paddington

Picco Leo

Palazzo salato cbd

Lenny briskets pastrami sandwich kings cross

Lps quality meats closed on weekends

Single o surry hills

Tenacious bakehouse darlinghurst

A P bakery surry hills

Lenny briskets darlinghurst

Hakata gensuke ramenn

Zaffi middle eastern restaurant and club

Kkokko restaurant pyrmont indonesian food

Cash only diner vietnamese

Amuro darlinghurst

Parami onigiri café sydney

Kazando ramen cbd

Lenny Briskets diner darlinghurst (pastrami sandwiches)

Rolling penny newtown

Yappari steak town hall

Home croissanterie

Tenacious Bakehouse

Charcoal Fish

Maeda

Malabar

Saint Peter Paddington

Chester White Potts Point

Spice I Am

Porkfat

South Dowling St Sandwich

Henrietta surry hills

King clarence sydney

Theeca darlinghurst

Bouillon L'Entrecôte

Olio Chippendale

Good luck restaurant lounge

Tento surry hills

Le Foote

Mensho ramen

Lune croissanterie

Pizzeria da alfredo repole glebe

A bowl of noodles chippendale

Martinez lunch special

Rockpool lunch special

Poetica lunch special north sydney

Kagoshima master

Bistecca

Oncore bar menu

Hakata gensuke ramen

Streats chippendale

Bloods bakery ultimo

Mogu Mogu onigiri Surry Hills

The Gidley steak

Fabbrica pasta shop

Porkfat Thai Haymarket

The boiling crab haymarket

Kindred Darlington

Neptunes grotto cbd

JIHO Hanbang Samgyetang

Saint peter

By sang sydney

Restaurant ka darlinghurst

Menya kokoro mazesoba (the rocks)

Ramen nichi getsu do city

AP bread and wine darlinghurst

Bessie and alma's surry hills

Olympus dining redfern

Porcine paddington

Towzen ramen

Alchemy Polish Cafe Restaurant

Izakaya Gaku (five dock)

Shaffa sydney

Outta coffee sydney

St Blaise Bistro matraville

Kyoto Katsugyu gadigal station

Pizzeria de michele

Appizza darlinghurst (new york style pizza)

25 spices hunan

Grandfathers Angel Place

40Res

Pizza oltra



City Fine Dining

Sasaki - now taco

Sokyo breakfast

Albertos Lounge (surry hills)

Firedoor Surry Hills (3rd best steak in the world)

Mr wong (wynyard)

Restaurant hubert

Kuon omakase

Totti's (in the ivy)

Amare (they make pasta by your table)

Fontana redfern (mediterranean)

S'more castlecrag

Oncore by Clare Smyth

Ele by frederico and Karl (pyrmont) multi sensory journey

Chefs table chatswood (reservations opened on monthly basis on the 15th at 12pm. Only accept online reservations through website)

parlar

Esteban

Aru Melbourne

Osaka bar new kaiseki

https://www.broadsheet.com.au/sydney/food-and-drink/article/sydneys-best-restaurant-openings-2022-so-far?fbclid=IwAR0UrrgUhh15Z2o2s-9P-2xv3NN9-VvPKr-xrrdSDiAG-ezn6JZEQZST1JI

https://www.timeout.com/sydney/restaurants/the-best-restaurants-in-sydney



DONE:



Five Guys George Street

Omu surry hills



Newtown

Hartsyard

Marys

PGs

Young Henrys

Continental Deli Bar Bistro

Kurumac Marrickville

stinking bishops enmore

chinese dumpling master enmore

blacksheep enmore

faheem fast food enmore

wish bone enmore

Ona coffee marrickville

Mecca coffee alexandria

Stix

Lazza marrickville

Cicco zetland

Bar planet (drink martini)

Pantry story stanmore

Bertas deli marrickville



Parramatta

Three Fold Pastry

Lilymu parramatta

Willo parramatta

Homage parramatta

Lucien baked goods parramatta

fratellipulcinella

Dosa hut harris park

Alpha sushi parramatta

Harveys hot sandwiches parramatta

Yeodongsik lidcombe

Derrels parramatta

Oribu parramatta



Northern Suburbs

Choji Yakiniku exp omakase Chatswood

Amah restaurant chatswood

Toriciya japanese restaurant near cammeray

Pasture of Balmoral

Jilin family chatswood

restaurant plage cremorne

Xenos Crows nest

Ometesando north sydney

Yakitori Yurippi Crows Nest

Loulou milsons point

Anything but humble alexandria

Kabul social north sydney

Olea Lindfield

Kame house gordon

Chefs table chatswood

The bower manly

St siandra the spit

S'more castlecrag

Wakana artarmon

New yamanishi crows nest

Sekka dining st leonards

COYA st leonards

East west  gourmet chatswood

Sandoitchi chatswood

Xinjiang handmade noodles chatswood

Only coffee crows nest

Ramen auru crows nest

Sashimi shunsengumi crows nest

Poetica lunch special

Soup zen hotpot chatswood

Saravana Bhavan North Sydney

Dozo by 88 st leonards

Bathers pavilion balmoral

Banh Cuon Ba Oanh Chatswood



Eastern Suburbs

Madame & Yves Patisserie Clovelly

eastside kitchen ($44 dessert) kensington

banh xeo eatery rosebery

ayam penyet randwick

Sean's panorama bondi beach

Kostas takeaway rockdale

By sang sydney rosebery

Getsashimi by getfish bondi

Lox in a box north bondi

Corner 75 randwick

Margaret double bay



Inner Suburbs

Roji monster icecream burwood

Edomae sushi burwood

Burwood chinatown markets fri sat sun night

Burwood hotel

Fortuna drink and eat burwood

Lanzhou noodle

Bunsik burwood westfield korean food

Kurumac marrickville

Geprek in sydney burwood

xian eatery burwood

Happy Field haberfield

Yakitori Jin haberfield

Peppes pasta haberfield

Moretti pizerria leichhart

The fenwick balmain

Baba's place marrickville

Café paci newtown

Maiz mexican street food newtown

Hearth café stanmore

Ellen18huntley alexandria

Gyros five dock

Warren & holt marrickville

Ona coffee

Maiz mexican street food newtown

Grappa italian leichhart

Yummy guilin bbq burwood

Chan kun kee rhodes

Silk road Uyghur restaurant in Ashfield

Maestria restaurant rhodes

Donut Papi Marrickville

Ba oanh marrickville

Hashi Sushi Rhodes

Cairo Takeaway Enmore

Tamaleria & Mexican Deli Dulwich Hill

Emma's Snack Bar Enmore

Pepito's Marrickville

FICH Petersham

Gigi Pizzeria Newtown

Little Lagos Enmore

Two Chaps Marrickville

Pistou Sydney Park

Bloodwood Newtown

The Stinking Bishops Newtown

Lazza Marrickville

Pino's Vino e Cucina Alexandria

L'Auberge du Bout du Monde

Ommi Don Redfern

Firepop enmore

Kombu lab ramen bar circular quay

Matkim Sydney

Olympic meats marrickville



Other

Black Bear BBQ Blacktown

Burgerhood Balmain

The Fenwick Balmain

Benzin café Dural

My mother's cousin Bexley north pizza

Kostas takeaway kogarah

8 at trinity lake macquarie

Harris park not just curries

Medan Ciak Mascot



Hornsby

Super nash chicken waitara



Epping

Yuzu restaurant

678

Common

Rusty Rabbit

Café at genesis building

Broaster chicken

Two Peck

Darcy st café

Hong kong bing sutt café eastwood

Northeast restaurant eastwood

Sushi roya

Kangnam bbq

Yiming steamed stonepot

Itzsan yakiniku eastwood

Parkbongsook eastwood

Gusta penannt hill

Superbowl congee eastwood

An viet eastwood

Chinese chilli restaurant

Yeodongsik eastwood opening, 1hat

The naked duck macquarie park

Hungry paulie eastwood



Bars

Big poppas Darlinghurst

Mjolner bar redfern

Harry deane bar walsh bay

Saga bar chippendale (hidden bar)

Old Mate's place (cbd)

Papa Gede's

Apollonia circular quay

The caterpillar club pitt st



Ps40 city

Dean and nancy on 22

The department of myth and legend (barangaroo)

Alice (The Rocks)

Ante Newtown

Bar Planet (newtown)Clocktower bar CBD

El primo sanchez paddington

Bar messenger circular quay

Now and then clarence street



Rooftop bars

Manly pavilion

Glenmore

Aster

Old mates place

Sussex hotel

kasbah

Henry deane

The steyne

Bar ombre

Library bar

Sky bar wynyard

Re Eveleigh

Piccolo Potts Point

Una mas coogee

Ramblin' rascal tavern Sydney
`;

// ============================================================================
// PARSING LOGIC
// ============================================================================

interface ParsedRestaurant {
  title: string;
  neighborhood: string | null;
  notes: string | null;
  gastronomy_type: 'restaurant' | null;
  region: string;
  status: 'idea' | 'completed';
  cuisine: string | null;
  price_level: string | null;
}

// Map section headers to Sydney regions
const regionMapping: Record<string, string> = {
  'city': 'city',
  'city fine dining': 'city',
  'newtown': 'inner_west',
  'parramatta': 'west',
  'northern suburbs': 'north_shore',
  'eastern suburbs': 'eastern_suburbs',
  'inner suburbs': 'inner_west',
  'other': 'other',
  'hornsby': 'northern_suburbs',
  'epping': 'northern_suburbs',
  'bars': 'city',
  'rooftop bars': 'city',
};

// Known neighborhoods and their mappings
const neighborhoodPatterns: [RegExp, string][] = [
  [/surry hills/i, 'Surry Hills'],
  [/darlinghurst/i, 'Darlinghurst'],
  [/potts point/i, 'Potts Point'],
  [/paddington/i, 'Paddington'],
  [/redfern/i, 'Redfern'],
  [/chippendale/i, 'Chippendale'],
  [/haymarket/i, 'Haymarket'],
  [/chinatown/i, 'Chinatown'],
  [/pyrmont/i, 'Pyrmont'],
  [/woolloomooloo/i, 'Woolloomooloo'],
  [/circular quay/i, 'Circular Quay'],
  [/the rocks/i, 'The Rocks'],
  [/kings cross/i, 'Kings Cross'],
  [/glebe/i, 'Glebe'],
  [/ultimo/i, 'Ultimo'],
  [/newtown/i, 'Newtown'],
  [/marrickville/i, 'Marrickville'],
  [/enmore/i, 'Enmore'],
  [/alexandria/i, 'Alexandria'],
  [/zetland/i, 'Zetland'],
  [/stanmore/i, 'Stanmore'],
  [/chatswood/i, 'Chatswood'],
  [/crows nest/i, 'Crows Nest'],
  [/north sydney/i, 'North Sydney'],
  [/milsons point/i, 'Milsons Point'],
  [/cremorne/i, 'Cremorne'],
  [/balmoral/i, 'Balmoral'],
  [/manly/i, 'Manly'],
  [/artarmon/i, 'Artarmon'],
  [/st leonards/i, 'St Leonards'],
  [/lindfield/i, 'Lindfield'],
  [/gordon/i, 'Gordon'],
  [/castlecrag/i, 'Castlecrag'],
  [/cammeray/i, 'Cammeray'],
  [/bondi/i, 'Bondi'],
  [/clovelly/i, 'Clovelly'],
  [/kensington/i, 'Kensington'],
  [/rosebery/i, 'Rosebery'],
  [/randwick/i, 'Randwick'],
  [/rockdale/i, 'Rockdale'],
  [/double bay/i, 'Double Bay'],
  [/coogee/i, 'Coogee'],
  [/burwood/i, 'Burwood'],
  [/haberfield/i, 'Haberfield'],
  [/leichhardt/i, 'Leichhardt'],
  [/balmain/i, 'Balmain'],
  [/five dock/i, 'Five Dock'],
  [/rhodes/i, 'Rhodes'],
  [/ashfield/i, 'Ashfield'],
  [/dulwich hill/i, 'Dulwich Hill'],
  [/petersham/i, 'Petersham'],
  [/sydney park/i, 'Sydney Park'],
  [/darlington/i, 'Darlington'],
  [/blacktown/i, 'Blacktown'],
  [/dural/i, 'Dural'],
  [/bexley/i, 'Bexley'],
  [/kogarah/i, 'Kogarah'],
  [/mascot/i, 'Mascot'],
  [/harris park/i, 'Harris Park'],
  [/parramatta/i, 'Parramatta'],
  [/lidcombe/i, 'Lidcombe'],
  [/waitara/i, 'Waitara'],
  [/eastwood/i, 'Eastwood'],
  [/macquarie park/i, 'Macquarie Park'],
  [/pennant hills/i, 'Pennant Hills'],
  [/epping/i, 'Epping'],
  [/walsh bay/i, 'Walsh Bay'],
  [/barangaroo/i, 'Barangaroo'],
  [/pitt st/i, 'CBD'],
  [/wynyard/i, 'Wynyard'],
  [/george st/i, 'CBD'],
  [/cbd/i, 'CBD'],
  [/sydney/i, 'Sydney'],
  [/town hall/i, 'Town Hall'],
  [/angel place/i, 'CBD'],
  [/gadigal/i, 'CBD'],
  [/eveleigh/i, 'Eveleigh'],
  [/matraville/i, 'Matraville'],
];

// Cuisine detection patterns
const cuisinePatterns: [RegExp, string][] = [
  [/japanese|jap|ramen|sushi|yakiniku|robata|omakase|izakaya|onigiri|yakitori|mazesoba/i, 'Japanese'],
  [/korean|bbq|samgyetang|bunsik/i, 'Korean'],
  [/chinese|sichuan|hunan|dumpling|noodle|congee|dim sum|cantonese|uyghur|guilin/i, 'Chinese'],
  [/vietnamese|banh|pho|viet/i, 'Vietnamese'],
  [/thai|porkfat/i, 'Thai'],
  [/indonesian|geprek|ayam penyet/i, 'Indonesian'],
  [/indian|dosa|bhavan|curry/i, 'Indian'],
  [/mexican|tacos|tamaleria/i, 'Mexican'],
  [/italian|pasta|pizza|pizzeria|trattoria|vino/i, 'Italian'],
  [/french|brasserie|bistro|croissant|patisserie/i, 'French'],
  [/spanish|tapas/i, 'Spanish'],
  [/mediterranean|greek|gyros/i, 'Mediterranean'],
  [/middle eastern|falafel|lebanese/i, 'Middle Eastern'],
  [/polish/i, 'Polish'],
  [/african|lagos|ethiopian/i, 'African'],
  [/sea food|seafood|fish|crab/i, 'Seafood'],
  [/steak|steakhouse|butcher/i, 'Steakhouse'],
  [/burger/i, 'American'],
  [/bakery|bakehouse|bread|pastry|croissant/i, 'Bakery'],
  [/coffee|café|cafe/i, 'Cafe'],
];

function extractNeighborhood(text: string): string | null {
  for (const [pattern, neighborhood] of neighborhoodPatterns) {
    if (pattern.test(text)) {
      return neighborhood;
    }
  }
  return null;
}

function extractCuisine(text: string): string | null {
  for (const [pattern, cuisine] of cuisinePatterns) {
    if (pattern.test(text)) {
      return cuisine;
    }
  }
  return null;
}

function extractNotes(text: string): string | null {
  // Extract parenthetical notes
  const parenMatch = text.match(/\(([^)]+)\)/);
  if (parenMatch) {
    return parenMatch[1];
  }
  return null;
}

function extractPriceLevel(text: string): string | null {
  const priceMatch = text.match(/\$(\d+)/);
  if (priceMatch) {
    const price = parseInt(priceMatch[1]);
    if (price > 200) return '$$$$';
    if (price > 100) return '$$$';
    if (price > 50) return '$$';
    return '$';
  }
  if (text.toLowerCase().includes('fine dining') || text.toLowerCase().includes('omakase')) {
    return '$$$$';
  }
  return null;
}

function cleanTitle(text: string): string {
  // Remove neighborhood names from title
  let cleaned = text;

  // Remove parenthetical content
  cleaned = cleaned.replace(/\([^)]*\)/g, '');

  // Remove known neighborhood patterns
  for (const [pattern] of neighborhoodPatterns) {
    cleaned = cleaned.replace(pattern, '');
  }

  // Remove price mentions
  cleaned = cleaned.replace(/\$\d+/g, '');

  // Clean up extra spaces and trim
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // Title case
  cleaned = cleaned
    .split(' ')
    .map(word => {
      if (word.length === 0) return word;
      // Keep some words lowercase
      if (['and', 'the', 'of', 'by', 'at', 'in', 'on', 'for'].includes(word.toLowerCase()) && word !== cleaned.split(' ')[0]) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');

  return cleaned;
}

function parseRestaurants(data: string): ParsedRestaurant[] {
  const lines = data.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const restaurants: ParsedRestaurant[] = [];

  let currentSection = 'city';
  let isCompletedSection = false;
  let isBarSection = false;

  // Section headers to detect
  const sectionHeaders = [
    'city',
    'city fine dining',
    'done:',
    'newtown',
    'parramatta',
    'northern suburbs',
    'eastern suburbs',
    'inner suburbs',
    'other',
    'hornsby',
    'epping',
    'bars',
    'rooftop bars',
  ];

  for (const line of lines) {
    const lineLower = line.toLowerCase();

    // Skip URLs
    if (lineLower.startsWith('http')) {
      continue;
    }

    // Check if this is a section header
    const matchedHeader = sectionHeaders.find(h => lineLower === h || lineLower === h.replace(':', ''));
    if (matchedHeader) {
      if (matchedHeader === 'done:') {
        isCompletedSection = true;
        continue;
      }

      // New section resets completed flag (except for items after DONE)
      if (matchedHeader !== 'done:' && !isCompletedSection) {
        isCompletedSection = false;
      }

      currentSection = matchedHeader.replace(':', '');
      isBarSection = matchedHeader === 'bars' || matchedHeader === 'rooftop bars';
      continue;
    }

    // Parse restaurant entry
    const title = cleanTitle(line);
    if (title.length < 2) continue;

    const neighborhood = extractNeighborhood(line);
    const notes = extractNotes(line);
    const cuisine = extractCuisine(line);
    const priceLevel = extractPriceLevel(line);
    const region = regionMapping[currentSection] || 'other';

    // Build notes string
    let notesStr = notes || null;
    if (neighborhood && !notesStr) {
      notesStr = neighborhood;
    } else if (neighborhood && notesStr) {
      notesStr = `${notesStr} - ${neighborhood}`;
    }

    restaurants.push({
      title,
      neighborhood,
      notes: notesStr,
      gastronomy_type: 'restaurant', // Bars are still restaurants in our schema
      region,
      status: isCompletedSection ? 'completed' : 'idea',
      cuisine: isBarSection ? null : cuisine,
      price_level: priceLevel,
    });
  }

  return restaurants;
}

function deduplicateRestaurants(restaurants: ParsedRestaurant[]): ParsedRestaurant[] {
  const seen = new Map<string, ParsedRestaurant>();

  for (const restaurant of restaurants) {
    const key = restaurant.title.toLowerCase().replace(/[^a-z0-9]/g, '');

    // If we haven't seen this restaurant, or this one has more info, keep it
    const existing = seen.get(key);
    if (!existing) {
      seen.set(key, restaurant);
    } else {
      // Prefer the one with more information
      const existingScore = (existing.notes ? 1 : 0) + (existing.cuisine ? 1 : 0) + (existing.neighborhood ? 1 : 0);
      const newScore = (restaurant.notes ? 1 : 0) + (restaurant.cuisine ? 1 : 0) + (restaurant.neighborhood ? 1 : 0);

      if (newScore > existingScore) {
        seen.set(key, restaurant);
      }
      // Prefer completed status
      if (restaurant.status === 'completed' && existing.status !== 'completed') {
        seen.set(key, { ...seen.get(key)!, status: 'completed' });
      }
    }
  }

  return Array.from(seen.values());
}

// ============================================================================
// DATABASE IMPORT
// ============================================================================

async function importRestaurants() {
  console.log('Parsing restaurant data...');

  const parsed = parseRestaurants(rawData);
  console.log(`Parsed ${parsed.length} entries`);

  const deduplicated = deduplicateRestaurants(parsed);
  console.log(`After deduplication: ${deduplicated.length} unique restaurants`);

  // Prepare for insert
  const itemsToInsert = deduplicated.map(r => ({
    title: r.title,
    categories: ['food_drink'],
    status: r.status,
    location_type: 'sydney' as const,
    ownership: 'couples' as const,
    is_physical: true,
    is_priority: false,
    gastronomy_type: r.gastronomy_type,
    cuisine: r.cuisine,
    neighborhood: r.neighborhood,
    notes: r.notes,
    region: r.region,
  }));

  // Check for existing restaurants to avoid duplicates
  console.log('Checking for existing restaurants...');
  const { data: existingItems, error: fetchError } = await supabase
    .from('bucket_list_items')
    .select('title')
    .eq('categories', '{food_drink}');

  if (fetchError) {
    console.error('Error fetching existing items:', fetchError);
  }

  const existingTitles = new Set(
    (existingItems || []).map(item => item.title.toLowerCase().replace(/[^a-z0-9]/g, ''))
  );

  // Filter out items that already exist
  const newItems = itemsToInsert.filter(item =>
    !existingTitles.has(item.title.toLowerCase().replace(/[^a-z0-9]/g, ''))
  );

  console.log(`Found ${existingTitles.size} existing food_drink items`);
  console.log(`Will insert ${newItems.length} new restaurants`);

  if (newItems.length === 0) {
    console.log('No new restaurants to insert');
    return;
  }

  // Insert in batches
  const batchSize = 50;
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < newItems.length; i += batchSize) {
    const batch = newItems.slice(i, i + batchSize);
    console.log(`Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(newItems.length / batchSize)}...`);

    const { data, error } = await supabase
      .from('bucket_list_items')
      .insert(batch)
      .select();

    if (error) {
      console.error(`Error inserting batch:`, error);
      errorCount += batch.length;
    } else {
      successCount += data?.length || 0;
      console.log(`  Inserted ${data?.length || 0} items`);
    }
  }

  console.log('\n========================================');
  console.log('IMPORT COMPLETE');
  console.log('========================================');
  console.log(`Successfully imported: ${successCount} restaurants`);
  console.log(`Failed: ${errorCount}`);
  console.log(`Skipped (already exist): ${itemsToInsert.length - newItems.length}`);

  // Print breakdown by region
  const byRegion: Record<string, number> = {};
  const byStatus: Record<string, number> = {};

  for (const item of newItems) {
    byRegion[item.region || 'unknown'] = (byRegion[item.region || 'unknown'] || 0) + 1;
    byStatus[item.status] = (byStatus[item.status] || 0) + 1;
  }

  console.log('\nBy Region:');
  for (const [region, count] of Object.entries(byRegion).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${region}: ${count}`);
  }

  console.log('\nBy Status:');
  for (const [status, count] of Object.entries(byStatus)) {
    console.log(`  ${status}: ${count}`);
  }
}

// Run the import
importRestaurants().catch(console.error);

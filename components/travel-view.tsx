import { BucketListItem, Region } from '@/types/database';
import { regionConfig } from '@/lib/category-config';

interface TravelViewProps {
  items: BucketListItem[];
  onItemClick: (item: BucketListItem) => void;
}

interface CountryGroup {
  country: string;
  flag: string;
  items: BucketListItem[];
}

const countryFlags: Record<string, string> = {
  // Europe
  'Italy': '🇮🇹',
  'Switzerland': '🇨🇭',
  'Spain': '🇪🇸',
  'France': '🇫🇷',
  'UK': '🇬🇧',
  'Germany': '🇩🇪',
  'Greece': '🇬🇷',
  'Portugal': '🇵🇹',
  'Slovenia': '🇸🇮',
  'Croatia': '🇭🇷',
  'Bosnia and Herzegovina': '🇧🇦',
  'Iceland': '🇮🇸',
  'Norway': '🇳🇴',
  'Sweden': '🇸🇪',
  'Finland': '🇫🇮',
  'Denmark': '🇩🇰',
  'Netherlands': '🇳🇱',
  'Austria': '🇦🇹',
  'Turkey': '🇹🇷',
  'Malta': '🇲🇹',

  // Asia
  'Japan': '🇯🇵',
  'China': '🇨🇳',
  'Taiwan': '🇹🇼',
  'Hong Kong': '🇭🇰',
  'Thailand': '🇹🇭',
  'Vietnam': '🇻🇳',
  'India': '🇮🇳',
  'Nepal': '🇳🇵',
  'Malaysia': '🇲🇾',
  'Singapore': '🇸🇬',
  'Philippines': '🇵🇭',
  'Sri Lanka': '🇱🇰',
  'Maldives': '🇲🇻',
  'Indonesia': '🇮🇩',
  'South Korea': '🇰🇷',
  'Cambodia': '🇰🇭',
  'Macau': '🇲🇴',

  // Americas
  'USA': '🇺🇸',
  'Canada': '🇨🇦',
  'Mexico': '🇲🇽',
  'Brazil': '🇧🇷',
  'Argentina': '🇦🇷',
  'Peru': '🇵🇪',
  'Costa Rica': '🇨🇷',
  'Cuba': '🇨🇺',
  'Jamaica': '🇯🇲',
  'Guatemala': '🇬🇹',
  'Colombia': '🇨🇴',
  'Chile': '🇨🇱',

  // MEA
  'UAE': '🇦🇪',
  'Jordan': '🇯🇴',
  'South Africa': '🇿🇦',
  'Tanzania': '🇹🇿',
  'Egypt': '🇪🇬',
  'Morocco': '🇲🇦',

  // Oceania
  'Australia': '🇦🇺',
  'New Zealand': '🇳🇿',
  'Fiji': '🇫🇯',
};

function groupByCountry(items: BucketListItem[]): CountryGroup[] {
  const groups = new Map<string, BucketListItem[]>();

  items.forEach(item => {
    const country = item.country || 'Other';
    if (!groups.has(country)) {
      groups.set(country, []);
    }
    groups.get(country)!.push(item);
  });

  return Array.from(groups.entries())
    .map(([country, items]) => ({
      country,
      flag: countryFlags[country] || '🌍',
      items: items.sort((a, b) => a.title.localeCompare(b.title)),
    }))
    .sort((a, b) => b.items.length - a.items.length); // Sort by count descending
}

export function TravelView({ items, onItemClick }: TravelViewProps) {
  // Group by location type first
  const sydneyItems = items.filter(i => i.location_type === 'sydney');
  const australiaItems = items.filter(i => i.location_type === 'australia' && !i.region);
  const europeItems = items.filter(i => i.region === 'Europe');
  const asiaItems = items.filter(i => i.region === 'Asia');
  const americasItems = items.filter(i => i.region === 'Americas');
  const meaItems = items.filter(i => i.region === 'Middle East & Africa');
  const oceaniaItems = items.filter(i => i.region === 'Oceania' || (i.location_type === 'australia' && i.region));

  const sydneyCountries = groupByCountry(sydneyItems);
  const australiaCountries = groupByCountry(australiaItems);
  const europeCountries = groupByCountry(europeItems);
  const asiaCountries = groupByCountry(asiaItems);
  const americasCountries = groupByCountry(americasItems);
  const meaCountries = groupByCountry(meaItems);
  const oceaniaCountries = groupByCountry(oceaniaItems);

  return (
    <div className="space-y-6">
      {/* Masonry column layout - eliminates whitespace gaps */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
        {/* Sydney Column */}
        {sydneyItems.length > 0 && (
          <ContinentColumn
            icon="🏙️"
            name="Sydney"
            count={sydneyItems.length}
            countries={sydneyCountries}
            onItemClick={onItemClick}
          />
        )}

        {/* Australia Column */}
        {australiaItems.length > 0 && (
          <ContinentColumn
            icon="🦘"
            name="Australia"
            count={australiaItems.length}
            countries={australiaCountries}
            onItemClick={onItemClick}
          />
        )}

        {/* Europe Column */}
        {europeItems.length > 0 && (
          <ContinentColumn
            icon="🇪🇺"
            name="Europe"
            count={europeItems.length}
            countries={europeCountries}
            onItemClick={onItemClick}
          />
        )}

        {/* Asia Column */}
        {asiaItems.length > 0 && (
          <ContinentColumn
            icon="🌏"
            name="Asia"
            count={asiaItems.length}
            countries={asiaCountries}
            onItemClick={onItemClick}
          />
        )}

        {/* Americas Column */}
        {americasItems.length > 0 && (
          <ContinentColumn
            icon="🌎"
            name="Americas"
            count={americasItems.length}
            countries={americasCountries}
            onItemClick={onItemClick}
          />
        )}

        {/* MEA Column */}
        {meaItems.length > 0 && (
          <ContinentColumn
            icon="🌍"
            name="Middle East & Africa"
            count={meaItems.length}
            countries={meaCountries}
            onItemClick={onItemClick}
          />
        )}

        {/* Oceania Column */}
        {oceaniaItems.length > 0 && (
          <ContinentColumn
            icon="🏝️"
            name="Oceania"
            count={oceaniaItems.length}
            countries={oceaniaCountries}
            onItemClick={onItemClick}
          />
        )}
      </div>
    </div>
  );
}

function ContinentColumn({
  icon,
  name,
  count,
  countries,
  onItemClick,
}: {
  icon: string;
  name: string;
  count: number;
  countries: CountryGroup[];
  onItemClick: (item: BucketListItem) => void;
}) {
  return (
    <div className="card-warm card-warm-hover break-inside-avoid mb-6">
      {/* Continent Header */}
      <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(139, 123, 114, 0.15)', background: 'rgba(253, 230, 138, 0.05)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{icon}</span>
            <h3 className="font-serif font-bold" style={{ color: 'var(--charcoal-brown)' }}>{name}</h3>
          </div>
          <span className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>{count}</span>
        </div>
      </div>

      {/* Countries */}
      <div className="px-4 py-3" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {countries.map((country) => (
          <CountrySection
            key={country.country}
            country={country}
            onItemClick={onItemClick}
          />
        ))}
      </div>
    </div>
  );
}

function CountrySection({
  country,
  onItemClick,
}: {
  country: CountryGroup;
  onItemClick: (item: BucketListItem) => void;
}) {
  return (
    <div>
      {/* Country Header */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-base">{country.flag}</span>
          <h4 className="text-sm font-semibold" style={{ color: 'var(--charcoal-brown)' }}>{country.country}</h4>
        </div>
        <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{country.items.length}</span>
      </div>

      {/* Places - Compact bullet list */}
      <div className="text-xs leading-relaxed pl-6 font-medium" style={{ color: 'var(--text-secondary)' }}>
        {country.items.map((item, idx) => (
          <span key={item.id}>
            <button
              onClick={() => onItemClick(item)}
              className="hover:underline transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold-leaf)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              {item.title}
            </button>
            {idx < country.items.length - 1 && (
              <span style={{ color: 'var(--text-muted)' }}> • </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

import { BucketListItem } from '@/types/database';
import { categoryConfig } from '@/lib/category-config';

interface CompactListItemProps {
  item: BucketListItem;
  onClick?: () => void;
  density?: 'compact' | 'comfortable' | 'table';
}

export function CompactListItem({ item, onClick, density = 'compact' }: CompactListItemProps) {
  const primaryCategory = item.categories[0];
  const categoryInfo = primaryCategory ? categoryConfig[primaryCategory] : null;

  // Only show status if not "idea" (most are ideas)
  const showStatus = item.status !== 'idea';

  // Only show ownership if not "couples" (most are couples)
  const showOwnership = item.ownership !== 'couples';

  const getStatusColor = () => {
    switch (item.status) {
      case 'planned': return 'bg-blue-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  const rowHeight = density === 'compact' ? 'h-8' : 'h-10';
  const fontSize = density === 'compact' ? 'text-sm' : 'text-base';

  return (
    <div
      onClick={onClick}
      className={`${rowHeight} flex items-center gap-3 px-4 cursor-pointer group transition-all`}
      style={{
        borderBottom: '1px solid rgba(139, 123, 114, 0.1)',
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(253, 230, 138, 0.08)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      {/* Left: Status indicator + Priority + Title */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {/* Status dot */}
        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${getStatusColor()}`} />

        {/* Priority star */}
        {item.is_priority && (
          <span className="text-xs flex-shrink-0">⭐</span>
        )}

        {/* Title */}
        <span className={`${fontSize} font-semibold truncate transition-colors`} style={{ color: 'var(--charcoal-brown)' }}>
          {item.title}
        </span>
      </div>

      {/* Right: Metadata */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Category tag */}
        {categoryInfo && (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${categoryInfo.watercolorClass}`}
          >
            <span className="text-xs">{categoryInfo.icon}</span>
            <span className="hidden sm:inline">{categoryInfo.displayName}</span>
          </span>
        )}

        {/* Location */}
        {item.specific_location && (
          <span className="text-xs hidden md:inline max-w-[120px] truncate font-medium" style={{ color: 'var(--text-muted)' }}>
            📍 {item.specific_location}
          </span>
        )}

        {/* Status label (only if not idea) */}
        {showStatus && (
          <span className="text-xs hidden lg:inline capitalize font-medium" style={{ color: 'var(--text-muted)' }}>
            {item.status.replace(/_/g, ' ')}
          </span>
        )}

        {/* Year badge */}
        {item.target_year && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold badge-pale-gold">
            {item.target_year}
          </span>
        )}

        {/* Ownership (only if not couples) */}
        {showOwnership && (
          <span className="text-xs hidden xl:inline font-medium" style={{ color: 'var(--text-muted)' }}>
            {item.ownership === 'peter' ? '👤 Peter' : '👤 Xi'}
          </span>
        )}
      </div>
    </div>
  );
}

import Link from 'next/link';
import { BucketListItem } from '@/types/database';
import { categoryConfig, ownershipConfig } from '@/lib/category-config';

interface ItemCardProps {
  item: BucketListItem;
}

export function ItemCard({ item }: ItemCardProps) {
  const getStatusColor = (status: BucketListItem['status']) => {
    switch (status) {
      case 'idea':
        return 'bg-gray-100 text-gray-700';
      case 'planned':
        return 'bg-blue-100 text-blue-700';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
    }
  };

  return (
    <Link
      href={`/items/${item.id}`}
      className="group block rounded-lg border border-gray-200 bg-white p-4 transition hover:border-indigo-500 hover:shadow-md"
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-gray-900 group-hover:text-indigo-600 line-clamp-2">
            {item.title}
          </h3>
          <div className="flex flex-shrink-0 gap-1">
            {item.is_priority && (
              <span className="text-yellow-500" title="Priority">⭐</span>
            )}
            {item.target_year && (
              <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-xs font-medium text-indigo-700">
                {item.target_year}
              </span>
            )}
          </div>
        </div>

        {/* Location */}
        {item.specific_location && (
          <p className="text-sm text-gray-600">
            📍 {item.specific_location}
          </p>
        )}

        {/* Description */}
        {item.description && (
          <p className="line-clamp-2 text-sm text-gray-600">{item.description}</p>
        )}

        {/* Category Tags */}
        <div className="flex flex-wrap gap-1.5">
          {item.categories.slice(0, 3).map((cat) => {
            const config = categoryConfig[cat];
            if (!config) return null;

            return (
              <span
                key={cat}
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                style={{
                  backgroundColor: config.color.bg,
                  color: config.color.text,
                }}
              >
                <span>{config.icon}</span>
                <span>{config.displayName}</span>
              </span>
            );
          })}
          {item.categories.length > 3 && (
            <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
              +{item.categories.length - 3}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className={`inline-flex rounded-full px-2 py-1 font-medium ${getStatusColor(item.status)}`}>
            {item.status.replace(/_/g, ' ')}
          </span>

          <span className="text-gray-500">
            {ownershipConfig[item.ownership].icon} {ownershipConfig[item.ownership].label}
          </span>

          {item.actionability === 'can_do_now' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-green-700">
              🟢 Can do now
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

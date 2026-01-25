import { BucketListItem } from '@/types/database';
import { categoryConfig } from '@/lib/category-config';

interface TableViewProps {
  items: BucketListItem[];
  onItemClick: (item: BucketListItem) => void;
}

export function TableView({ items, onItemClick }: TableViewProps) {
  const getStatusColor = (status: BucketListItem['status']) => {
    switch (status) {
      case 'idea': return 'bg-gray-300';
      case 'planned': return 'bg-blue-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr className="text-left text-xs font-medium text-gray-600">
            <th className="px-4 py-2 w-[40%]">Goal</th>
            <th className="px-4 py-2 w-[20%] hidden md:table-cell">Category</th>
            <th className="px-4 py-2 w-[15%] hidden lg:table-cell">Location</th>
            <th className="px-4 py-2 w-[10%] hidden sm:table-cell">Status</th>
            <th className="px-4 py-2 w-[10%]">Year</th>
            <th className="px-4 py-2 w-[5%]"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const primaryCategory = item.categories[0];
            const categoryInfo = primaryCategory ? categoryConfig[primaryCategory] : null;

            return (
              <tr
                key={item.id}
                onClick={() => onItemClick(item)}
                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer group h-9"
              >
                {/* Goal */}
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    {item.is_priority && <span className="text-xs">⭐</span>}
                    <span className="text-sm text-gray-900 group-hover:text-indigo-600 truncate">
                      {item.title}
                    </span>
                    {item.actionability === 'can_do_now' && (
                      <span className="text-xs">🟢</span>
                    )}
                  </div>
                </td>

                {/* Category */}
                <td className="px-4 py-2 hidden md:table-cell">
                  {categoryInfo && (
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
                        style={{
                          backgroundColor: categoryInfo.color.bg,
                          color: categoryInfo.color.text,
                        }}
                      >
                        <span>{categoryInfo.icon}</span>
                        <span className="hidden lg:inline">{categoryInfo.displayName}</span>
                      </span>
                      {item.categories.length > 1 && (
                        <span className="text-xs text-gray-500">+{item.categories.length - 1}</span>
                      )}
                    </div>
                  )}
                </td>

                {/* Location */}
                <td className="px-4 py-2 hidden lg:table-cell">
                  <span className="text-xs text-gray-600 truncate block max-w-[150px]">
                    {item.specific_location || item.location_type || '—'}
                  </span>
                </td>

                {/* Status */}
                <td className="px-4 py-2 hidden sm:table-cell">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(item.status)}`} />
                    {item.status !== 'idea' && (
                      <span className="text-xs text-gray-600 capitalize hidden lg:inline">
                        {item.status.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
                </td>

                {/* Year */}
                <td className="px-4 py-2">
                  {item.target_year ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-medium">
                      {item.target_year}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-4 py-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onItemClick(item);
                    }}
                    className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

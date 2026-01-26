'use client';

// Skeleton components for perceived performance
// Matches the "Golden Storybook" design with warm cream colors

export function CardSkeleton() {
  return (
    <div
      className="rounded-xl p-4 animate-pulse"
      style={{
        background: 'rgba(253, 230, 138, 0.1)',
        border: '1px solid rgba(139, 123, 114, 0.1)',
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-5 h-5 rounded-full"
          style={{ background: 'rgba(139, 123, 114, 0.15)' }}
        />
        <div
          className="h-4 rounded-full flex-1"
          style={{ background: 'rgba(139, 123, 114, 0.15)', maxWidth: '70%' }}
        />
      </div>
      <div className="space-y-2">
        <div
          className="h-3 rounded-full"
          style={{ background: 'rgba(139, 123, 114, 0.1)', width: '90%' }}
        />
        <div
          className="h-3 rounded-full"
          style={{ background: 'rgba(139, 123, 114, 0.1)', width: '60%' }}
        />
      </div>
    </div>
  );
}

export function ChipSkeleton() {
  return (
    <div
      className="h-7 rounded-full animate-pulse"
      style={{
        background: 'rgba(139, 123, 114, 0.1)',
        width: `${60 + Math.random() * 80}px`,
      }}
    />
  );
}

export function CardGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="columns-1 md:columns-2 xl:columns-3 gap-6 p-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="break-inside-avoid mb-6">
          <div
            className="rounded-xl overflow-hidden animate-pulse"
            style={{
              background: 'var(--paper-cream)',
              border: '1px solid rgba(139, 123, 114, 0.15)',
            }}
          >
            {/* Header */}
            <div
              className="px-4 py-3 flex items-center justify-between"
              style={{ borderBottom: '1px solid rgba(139, 123, 114, 0.1)' }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded"
                  style={{ background: 'rgba(139, 123, 114, 0.15)' }}
                />
                <div
                  className="h-5 rounded-full"
                  style={{ background: 'rgba(139, 123, 114, 0.15)', width: '100px' }}
                />
              </div>
              <div
                className="w-8 h-4 rounded-full"
                style={{ background: 'rgba(139, 123, 114, 0.1)' }}
              />
            </div>
            {/* Content - Chips */}
            <div className="px-4 py-4">
              <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: 4 + Math.floor(Math.random() * 6) }).map((_, j) => (
                  <ChipSkeleton key={j} />
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <div className="p-4">
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: 'var(--paper-cream)',
          border: '1px solid rgba(139, 123, 114, 0.15)',
        }}
      >
        {/* Table header */}
        <div
          className="px-4 py-3 flex gap-4"
          style={{
            background: 'rgba(253, 230, 138, 0.08)',
            borderBottom: '1px solid rgba(139, 123, 114, 0.15)',
          }}
        >
          <div
            className="h-4 rounded animate-pulse"
            style={{ background: 'rgba(139, 123, 114, 0.2)', width: '30%' }}
          />
          <div
            className="h-4 rounded animate-pulse"
            style={{ background: 'rgba(139, 123, 114, 0.2)', width: '20%' }}
          />
          <div
            className="h-4 rounded animate-pulse"
            style={{ background: 'rgba(139, 123, 114, 0.2)', width: '15%' }}
          />
          <div
            className="h-4 rounded animate-pulse"
            style={{ background: 'rgba(139, 123, 114, 0.2)', width: '15%' }}
          />
        </div>
        {/* Table rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="px-4 py-3 flex gap-4 items-center"
            style={{ borderBottom: '1px solid rgba(139, 123, 114, 0.08)' }}
          >
            <div
              className="h-4 rounded animate-pulse"
              style={{
                background: 'rgba(139, 123, 114, 0.1)',
                width: `${25 + Math.random() * 15}%`,
                animationDelay: `${i * 50}ms`,
              }}
            />
            <div
              className="h-4 rounded animate-pulse"
              style={{
                background: 'rgba(139, 123, 114, 0.08)',
                width: '18%',
                animationDelay: `${i * 50 + 25}ms`,
              }}
            />
            <div
              className="h-4 rounded animate-pulse"
              style={{
                background: 'rgba(139, 123, 114, 0.08)',
                width: '12%',
                animationDelay: `${i * 50 + 50}ms`,
              }}
            />
            <div
              className="h-4 rounded animate-pulse"
              style={{
                background: 'rgba(139, 123, 114, 0.08)',
                width: '12%',
                animationDelay: `${i * 50 + 75}ms`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CompactListSkeleton({ rows = 15 }: { rows?: number }) {
  return (
    <div className="p-4 space-y-1">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-3 py-2 rounded-lg animate-pulse"
          style={{
            background: i % 2 === 0 ? 'rgba(253, 230, 138, 0.05)' : 'transparent',
            animationDelay: `${i * 30}ms`,
          }}
        >
          <div
            className="w-5 h-5 rounded-full flex-shrink-0"
            style={{ background: 'rgba(139, 123, 114, 0.15)' }}
          />
          <div
            className="h-4 rounded-full flex-1"
            style={{
              background: 'rgba(139, 123, 114, 0.12)',
              maxWidth: `${50 + Math.random() * 40}%`,
            }}
          />
          <div
            className="h-5 rounded-full"
            style={{ background: 'rgba(139, 123, 114, 0.08)', width: '60px' }}
          />
        </div>
      ))}
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="w-64 p-4 space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg animate-pulse"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <div
            className="w-5 h-5 rounded"
            style={{ background: 'rgba(139, 123, 114, 0.15)' }}
          />
          <div
            className="h-4 rounded-full flex-1"
            style={{ background: 'rgba(139, 123, 114, 0.12)' }}
          />
        </div>
      ))}
    </div>
  );
}

export function HeaderSkeleton() {
  return (
    <div
      className="px-6 py-4 flex items-center justify-between animate-pulse"
      style={{ borderBottom: '1px solid rgba(139, 123, 114, 0.15)' }}
    >
      <div className="flex items-center gap-4">
        <div
          className="h-6 rounded-full"
          style={{ background: 'rgba(139, 123, 114, 0.15)', width: '120px' }}
        />
        <div
          className="h-5 rounded-full"
          style={{ background: 'rgba(139, 123, 114, 0.1)', width: '80px' }}
        />
      </div>
      <div className="flex items-center gap-3">
        <div
          className="h-8 rounded-lg"
          style={{ background: 'rgba(139, 123, 114, 0.1)', width: '200px' }}
        />
        <div
          className="h-8 rounded-md"
          style={{ background: 'rgba(139, 123, 114, 0.15)', width: '70px' }}
        />
      </div>
    </div>
  );
}

export function FullPageSkeleton() {
  return (
    <div className="h-screen flex" style={{ background: 'var(--paper-cream)' }}>
      {/* Sidebar */}
      <div
        className="w-64 flex-shrink-0"
        style={{ borderRight: '1px solid rgba(139, 123, 114, 0.15)' }}
      >
        <div className="p-4">
          <div
            className="h-8 rounded-lg mb-6 animate-pulse"
            style={{ background: 'rgba(139, 123, 114, 0.15)', width: '140px' }}
          />
        </div>
        <SidebarSkeleton />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <HeaderSkeleton />
        <div className="flex-1 overflow-hidden">
          <CardGridSkeleton count={9} />
        </div>
      </div>
    </div>
  );
}

export function QuickCaptureSkeleton() {
  return (
    <div
      className="p-4 animate-pulse"
      style={{ borderBottom: '1px solid rgba(139, 123, 114, 0.15)' }}
    >
      <div className="max-w-5xl mx-auto">
        <div
          className="h-12 rounded-xl"
          style={{
            background: 'rgba(139, 123, 114, 0.08)',
            border: '2px solid rgba(139, 123, 114, 0.1)',
          }}
        />
      </div>
    </div>
  );
}

export function GastronomyViewSkeleton() {
  return (
    <div className="h-full flex flex-col">
      <QuickCaptureSkeleton />
      <div
        className="px-4 py-3"
        style={{ borderBottom: '1px solid rgba(139, 123, 114, 0.1)' }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div
            className="h-9 rounded-full animate-pulse"
            style={{ background: 'rgba(139, 123, 114, 0.1)', width: '200px' }}
          />
          <div
            className="h-4 rounded-full animate-pulse"
            style={{ background: 'rgba(139, 123, 114, 0.08)', width: '60px' }}
          />
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <CardGridSkeleton count={6} />
      </div>
    </div>
  );
}

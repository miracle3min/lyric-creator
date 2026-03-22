"use client";

export default function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="card-glass animate-pulse">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-gradient-to-r from-brand-400 to-violet-400" />
          <h3 className="text-lg font-bold text-white">Generating...</h3>
          <span className="ml-auto text-sm text-gray-500">Please wait</span>
        </div>
        <div className="space-y-3">
          <div className="shimmer h-4 w-full rounded" />
          <div className="shimmer h-4 w-5/6 rounded" />
          <div className="shimmer h-4 w-4/6 rounded" />
          <div className="shimmer h-4 w-full rounded" />
          <div className="shimmer h-4 w-3/6 rounded" />
        </div>
      </div>
    </div>
  );
}

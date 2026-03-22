"use client";

import { PROVIDER_LABELS, PROVIDER_COLORS, Provider } from "@/types";

export default function LoadingSkeleton({ providers }: { providers: Provider[] }) {
  return (
    <div className="space-y-6">
      {providers.map((p) => (
        <div key={p} className="card-glass animate-pulse">
          <div className="mb-4 flex items-center gap-3">
            <div className={`h-3 w-3 rounded-full bg-gradient-to-r ${PROVIDER_COLORS[p]}`} />
            <h3 className="text-lg font-bold text-white">
              {PROVIDER_LABELS[p]}
            </h3>
            <span className="ml-auto text-sm text-gray-500">Generating...</span>
          </div>
          <div className="space-y-3">
            <div className="shimmer h-4 w-full rounded" />
            <div className="shimmer h-4 w-5/6 rounded" />
            <div className="shimmer h-4 w-4/6 rounded" />
            <div className="shimmer h-4 w-full rounded" />
            <div className="shimmer h-4 w-3/6 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

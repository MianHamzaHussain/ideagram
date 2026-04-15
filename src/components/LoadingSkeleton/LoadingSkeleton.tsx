import React from 'react';

interface SkeletonProps {
  count?: number;
  className?: string;
}

export const ReportSkeleton = ({ count = 3, className = "" }: SkeletonProps) => (
  <div className={`flex flex-col gap-4 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <div 
        key={i} 
        className="w-full h-[310px] bg-neutral-100 animate-pulse rounded-xl shadow-sm border border-neutral-100/50" 
      />
    ))}
  </div>
);

export const ProjectSkeleton = ({ count = 4, className = "" }: SkeletonProps) => (
  <div className={`flex flex-col gap-4 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <div 
        key={i} 
        className="w-full h-[120px] bg-neutral-100 animate-pulse rounded-xl border border-neutral-100" 
      />
    ))}
  </div>
);

export const ListItemSkeleton = ({ count = 3, className = "" }: SkeletonProps) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex gap-3 animate-pulse px-4 py-3">
        <div className="w-10 h-10 bg-neutral-100 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="w-24 h-4 bg-neutral-100 rounded" />
          <div className="w-full h-8 bg-neutral-100 rounded" />
        </div>
      </div>
    ))}
  </div>
);

export const TagGroupSkeleton = ({ count = 2, className = "" }: SkeletonProps) => (
  <div className={`flex flex-col gap-10 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex flex-col gap-4 animate-pulse">
        <div className="h-6 bg-neutral-100 rounded w-24 mb-1" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-11 bg-neutral-100 rounded-full w-full" />
          <div className="h-11 bg-neutral-100 rounded-full w-full" />
        </div>
      </div>
    ))}
  </div>
);

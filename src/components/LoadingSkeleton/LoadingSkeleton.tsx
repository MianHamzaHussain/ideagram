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

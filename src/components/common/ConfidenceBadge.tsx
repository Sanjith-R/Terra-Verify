import React from 'react';

interface ConfidenceBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ score, size = 'md', showLabel = false }) => {
  // Green >= 85, Yellow 70-84, Red < 70
  let colorStyle = 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-emerald-600/20';
  let dotColor = 'bg-emerald-500';
  let label = 'High';

  if (score < 70) {
    colorStyle = 'bg-rose-50 text-rose-700 border-rose-300 ring-rose-600/20';
    dotColor = 'bg-rose-500';
    label = 'Low';
  } else if (score < 85) {
    colorStyle = 'bg-amber-50 text-amber-700 border-amber-300 ring-amber-600/20';
    dotColor = 'bg-amber-500';
    label = 'Medium';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border shadow-2xs ${colorStyle} ${sizeClasses[size]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{score.toFixed(1)}%</span>
      {showLabel && <span className="text-[11px] opacity-80 font-normal">({label})</span>}
    </span>
  );
};

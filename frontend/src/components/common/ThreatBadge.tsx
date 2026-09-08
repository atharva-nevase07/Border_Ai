import React from 'react';
import { ThreatSeverity } from '../../types';

interface ThreatBadgeProps {
  severity: ThreatSeverity;
  score?: number;
  showScore?: boolean;
  className?: string;
}

export const ThreatBadge: React.FC<ThreatBadgeProps> = ({
  severity,
  score,
  showScore = false,
  className = ''
}) => {
  const getColors = () => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-500/15 text-red-400 border-red-500/50 shadow-sm shadow-red-500/20';
      case 'HIGH':
        return 'bg-orange-500/15 text-orange-400 border-orange-500/50';
      case 'MEDIUM':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/50';
      case 'LOW':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/50';
      case 'NORMAL':
      default:
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/50';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-semibold tracking-wider uppercase border ${getColors()} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${
        severity === 'CRITICAL' ? 'bg-red-400 animate-ping' : 
        severity === 'HIGH' ? 'bg-orange-400' :
        severity === 'MEDIUM' ? 'bg-amber-400' :
        severity === 'LOW' ? 'bg-blue-400' : 'bg-emerald-400'
      }`} />
      {severity}
      {showScore && score !== undefined && (
        <span className="opacity-80 text-[11px]">({score}/100)</span>
      )}
    </span>
  );
};

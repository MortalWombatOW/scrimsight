import React, { useState } from 'react';
import { Card } from '../surface/Card';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { SectionSummary } from '../../domain/analysis';

interface AnalysisSectionWrapperProps {
  summary: SectionSummary;
  icon: React.ReactNode;
  title: string;
  researchContext: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export const AnalysisSectionWrapper: React.FC<AnalysisSectionWrapperProps> = ({
  summary,
  icon,
  title,
  researchContext,
  defaultOpen = false,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className="p-0 overflow-hidden">
      {/* Collapsed header — always visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-base-content/5 transition-colors cursor-pointer"
      >
        <div className="flex-shrink-0 text-base-content/70">
          {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </div>
        <div className="flex-shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h3 className="text-base font-bold text-base-content">{title}</h3>
            <span className="text-sm italic text-primary/70 truncate">{summary.insight}</span>
          </div>
        </div>
        <div className="flex-shrink-0 text-right pl-4">
          <div className="text-2xl font-bold text-base-content">{summary.heroStat}</div>
          <div className="text-xs text-base-content/50">{summary.heroLabel}</div>
        </div>
      </button>

      {/* Expanded detail content */}
      {isOpen && (
        <div className="px-6 pb-6 border-t border-base-content/5">
          <p className="text-sm text-base-content/60 mt-4 mb-4">{researchContext}</p>
          {children}
        </div>
      )}
    </Card>
  );
};

import React from 'react';
import { Card } from '../surface/Card';
import { Sparkles } from 'lucide-react';
import { KeyFindings } from '../../domain/analysis';

interface ExecutiveSummaryProps {
  keyFindings: KeyFindings;
}

const NOTABILITY_BADGE: Record<string, string> = {
  high: 'badge-primary',
  medium: 'badge-ghost',
  low: 'badge-ghost opacity-60',
};

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ keyFindings }) => {
  if (keyFindings.topFindings.length === 0) return null;

  return (
    <Card className="p-6 border-l-4 border-l-primary">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={18} className="text-primary" />
        <h3 className="text-base font-bold text-base-content">Key Findings</h3>
      </div>
      <ul className="space-y-2">
        {keyFindings.topFindings.map((finding) => (
          <li key={finding.id} className="flex items-start gap-3">
            <span className={`badge badge-sm mt-0.5 ${NOTABILITY_BADGE[finding.notability]}`}>
              {finding.notability}
            </span>
            <span className="text-sm text-base-content/80">{finding.finding}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
};

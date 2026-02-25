import React, { useMemo } from 'react';
import { Page, ZeroState } from '@components';
import { useDetailedAnalysis } from '../hooks/useDetailedAnalysis';
import { useUltCycles } from '../hooks/useUltCycles';
import { useBenchmarks } from '../hooks/useBenchmarks';
import { generateKeyFindings } from '../domain/analysis';
import { ExecutiveSummary } from '../components/analysis/ExecutiveSummary';
import { FirstPickSection } from '../components/analysis/FirstPickSection';
import { UltEconomySection } from '../components/analysis/UltEconomySection';
import { SurvivalSection } from '../components/analysis/SurvivalSection';
import { TFWRSection } from '../components/analysis/TFWRSection';
import { StrategyProfileSection } from '../components/analysis/StrategyProfileSection';
import { TargetFocusSection } from '../components/analysis/TargetFocusSection';
import { CompositionSection } from '../components/analysis/CompositionSection';
import { useCompositionAnalysis } from '../hooks/useCompositionAnalysis';

export const DetailedAnalysisPage: React.FC = () => {
  const analysis = useDetailedAnalysis();
  const ultCycles = useUltCycles();
  const bm = useBenchmarks();
  const composition = useCompositionAnalysis();

  const keyFindings = useMemo(() => {
    if (!analysis.hasData) return null;
    return generateKeyFindings(
      analysis.firstPick,
      analysis.ultEconomy,
      analysis.survival,
      analysis.tfwr,
      analysis.strategyProfile,
      analysis.targetFocus,
    );
  }, [analysis]);

  if (!analysis.hasData) {
    return <ZeroState />;
  }

  return (
    <Page>
      <Page.Header
        title="Detailed Analysis"
        subtitle={`Research-backed hypotheses validated by your data — ${analysis.totalMatches} matches, ${analysis.totalFights} teamfights`}
      />
      <Page.Content>
        {keyFindings && <ExecutiveSummary keyFindings={keyFindings} />}
        <FirstPickSection data={analysis.firstPick} benchmarks={bm.firstPick} />
        <UltEconomySection data={analysis.ultEconomy} playerMetrics={ultCycles.playerMetrics} roleDistributions={ultCycles.roleDistributions} benchmarks={bm.ultEconomy} />
        <SurvivalSection data={analysis.survival} benchmarks={bm.survival} />
        <TFWRSection data={analysis.tfwr} benchmarks={bm.tfwr} />
        <StrategyProfileSection data={analysis.strategyProfile} benchmarks={bm.strategy} />
        <TargetFocusSection data={analysis.targetFocus} benchmarks={bm.targetFocus} />
        {composition.hasData && <CompositionSection data={composition} />}
      </Page.Content>
    </Page>
  );
};

export default DetailedAnalysisPage;

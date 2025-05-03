import React, { Suspense } from 'react';
import { DataDisplayPage as GenericDataDisplayPage } from '../components/DataDisplayPage';
import { silverMatchesAtom } from '../v2/atoms/silverAtoms';
import type { MatchSilver } from '../v2/schemas/silverSchema';
import type { ColumnDef } from '@tanstack/react-table';

/**
 * Page to display match-level Silver data using a generic table + chart component.
 */
const DataDisplayPage: React.FC = () => {
  // Column definitions for MatchSilver
  const matchColumns: ColumnDef<MatchSilver, any>[] = [
    { header: 'Match ID', accessorKey: 'id' },
    { header: 'Map', accessorKey: 'map_name' },
    { header: 'Team 1', accessorKey: 'team1_name' },
    { header: 'Team 1 Score', accessorKey: 'team1_score' },
    { header: 'Team 2', accessorKey: 'team2_name' },
    { header: 'Team 2 Score', accessorKey: 'team2_score' },
    { header: 'Duration (s)', accessorKey: 'duration' },
    { header: 'Winner', accessorKey: 'winner' },
  ];

  return (
    <Suspense fallback={<div>Loading match data...</div>}>
      <GenericDataDisplayPage
        title="Matches"
        tableAtom={silverMatchesAtom}
        tableColumns={matchColumns}
        chartAtom={silverMatchesAtom}
        chartConfig={{
          xKey: 'start_time',
          lines: [
            { dataKey: 'team1_score', name: 'Team 1 Score', color: '#3b82f6' },
            { dataKey: 'team2_score', name: 'Team 2 Score', color: '#ef4444' },
          ],
        }}
      />
    </Suspense>
  );
};

export default DataDisplayPage;
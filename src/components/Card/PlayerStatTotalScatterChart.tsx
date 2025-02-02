import { useAtom } from 'jotai';
import { type PlayerStatTotals, playerStatTotalsAtom } from '~/atoms';
import { CardContent, Typography } from '@mui/material';
import { SimpleScatterChart } from '~/components/Charts/SimpleScatterChart';

interface PlayerStatTotalScatterChartProps {
  metricName: keyof Omit<PlayerStatTotals, 'playerName'>;
  metricName2: keyof Omit<PlayerStatTotals, 'playerName'>;
}

export const PlayerStatTotalScatterChart: React.FC<PlayerStatTotalScatterChartProps> = ({ 
  metricName, 
  metricName2 
}) => {
  const [playerStatTotals] = useAtom(playerStatTotalsAtom);

  return (
    <CardContent>
      <Typography variant="h3">{metricName} vs {metricName2}</Typography>
      <SimpleScatterChart 
        categoryKey={'playerName'} 
        valueKey={metricName} 
        valueKey2={metricName2} 
        data={playerStatTotals ?? []} 
      />
    </CardContent>
  );
};

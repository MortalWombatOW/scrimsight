import { SingleBarChart } from "~/components/Charts/SingleBarChart";
import { useAtom } from "jotai";
import { type PlayerStatTotals, playerStatTotalsAtom } from "~/atoms";
import { CardContent, Typography } from "@mui/material";

interface PlayerStatTotalBarChartProps {
  metricName: keyof Omit<PlayerStatTotals, 'playerName'>;
}

export const PlayerStatTotalBarChart: React.FC<PlayerStatTotalBarChartProps> = ({ metricName }) => {
  const [playerStatTotals] = useAtom(playerStatTotalsAtom);

  return (
    <CardContent>
      <Typography variant="h3">{metricName}</Typography>
      <SingleBarChart 
        categoryKey={'playerName'} 
        valueKey={metricName} 
        data={playerStatTotals ?? []} 
      />
    </CardContent>
  );
};

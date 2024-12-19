import { SingleBarChart } from "~/components/Charts/SingleBarChart";

import { useWombatData } from "wombat-data-framework";
import { player_stat_totals_node, PlayerMetrics, PlayerStatTotalsNodeData } from "~/WombatDataFrameworkSchema";
import { CardContent, Typography } from "@mui/material";

interface PlayerStatTotalBarChartProps {
  metricName: keyof PlayerMetrics;
}

export const PlayerStatTotalBarChart: React.FC<PlayerStatTotalBarChartProps> = ({ metricName }) => {
  const playerStatTotalData = useWombatData<PlayerStatTotalsNodeData>(player_stat_totals_node.name);

  return (
    <CardContent>
      <Typography variant="h3">{metricName}</Typography>
      <SingleBarChart categoryKey={'playerName'} valueKey={metricName} data={playerStatTotalData.data} />
    </CardContent>
  );
};


import { useWombatData, WombatDataOptions } from "wombat-data-framework";
import { player_stat_totals_node, PlayerMetrics, PlayerStatTotalsNodeData } from "~/WombatDataFrameworkSchema";
import { CardContent, Typography } from "@mui/material";
import { SimpleScatterChart } from "~/components/Charts/SimpleScatterChart";

interface PlayerStatTotalScatterChartProps {
  metricName: keyof PlayerMetrics;
  metricName2: keyof PlayerMetrics;
  dataOptions?: WombatDataOptions<PlayerStatTotalsNodeData>;
}

export const PlayerStatTotalScatterChart: React.FC<PlayerStatTotalScatterChartProps> = ({ metricName, metricName2, dataOptions }) => {
  const playerStatTotalData = useWombatData<PlayerStatTotalsNodeData>(player_stat_totals_node.name, dataOptions);

  return (
    <CardContent>
      <Typography variant="h3">{metricName} vs {metricName2}</Typography>
      <SimpleScatterChart categoryKey={'playerName'} valueKey={metricName} valueKey2={metricName2} data={playerStatTotalData.data} />
    </CardContent>
  );
};

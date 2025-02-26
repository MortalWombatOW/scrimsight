import { useState } from "react";
import { useAtomValue } from "jotai";
import { Paper, Select, Stack, Title } from "@mantine/core";
import { BarChart } from "@mantine/charts";
import {
  PlayerStatsNumericalKeys,
  matchDataAtom,
  playerStatsNumericalKeys,
  useStats,
} from "../../../../atoms";
import { camelCaseToWords, prettyFormat } from "../../../../lib";

interface SingleStatPlayerComparisonProps {
  matchId: string;
}

export const SingleStatPlayerComparison = ({
  matchId,
}: SingleStatPlayerComparisonProps) => {
  const matchData = useAtomValue(matchDataAtom).find(
    (match) => match.matchId === matchId
  );
  const playerStats = useStats(["playerName", "playerTeam"], {
    matchId: [matchId],
  });
  const [stat, setStat] = useState<PlayerStatsNumericalKeys>("finalBlows");

  if (!matchData) {
    return null;
  }

  const team1Data = playerStats.rows
    .filter((stats) => stats.playerTeam === matchData.team1Name)
    .sort((a, b) => b[stat] - a[stat]);
  const team2Data = playerStats.rows
    .filter((stats) => stats.playerTeam === matchData.team2Name)
    .sort((a, b) => b[stat] - a[stat]);

  return (
    <Paper withBorder p="md">
      <Stack>
        <Title order={3}>Compare Metric</Title>
        <Select
          data={playerStatsNumericalKeys.map((key) => ({
            label: camelCaseToWords(key),
            value: key,
          }))}
          value={stat}
          onChange={(value) => setStat(value as PlayerStatsNumericalKeys)}
          allowDeselect={false}
          searchable
        />
        <Title order={4}>{matchData.team1Name}</Title>
        <BarChart
          orientation="vertical"
          h={150}
          w="500px"
          data={team1Data}
          dataKey="playerName"
          series={[{ name: stat, color: "myColor", label: "playerName" }]}
          yAxisProps={{ width: 120 }}
          withBarValueLabel
          valueFormatter={(value) => prettyFormat(value)}
          valueLabelProps={{ position: "inside", fill: "white" }}
          barProps={{
            radius: 5,
          }}
          tickLine="none"
          strokeDasharray="0 1"
          withXAxis={false}
        />
        <Title order={4}>{matchData.team2Name}</Title>
        <BarChart
          orientation="vertical"
          h={150}
          w="500px"
          data={team2Data}
          dataKey="playerName"
          series={[{ name: stat, color: "myColor", label: "playerName" }]}
          yAxisProps={{ width: 120 }}
          withBarValueLabel
          valueFormatter={(value) => prettyFormat(value)}
          valueLabelProps={{ position: "inside", fill: "white" }}
          barProps={{
            radius: 5,
          }}
          tickLine="none"
          strokeDasharray="0 1"
          withXAxis={false}
        />
      </Stack>
    </Paper>
  );
};

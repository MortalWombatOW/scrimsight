import { useState } from "react";
import { useAtomValue } from "jotai";
import { Group, Paper, Select, Stack, Title } from "@mantine/core";
import { ScatterChart } from "@mantine/charts";
import {
  PlayerStatsNumericalKeys,
  matchDataAtom,
  playerStatsNumericalKeys,
  useStats,
} from "../../../../atoms";
import { camelCaseToWords, prettyFormat } from "../../../../lib";

interface AllPlayerComparisonProps {
  matchId: string;
}

export const AllPlayerComparison = ({ matchId }: AllPlayerComparisonProps) => {
  const matchData = useAtomValue(matchDataAtom).find(
    (match) => match.matchId === matchId
  );
  if (!matchData) {
    return null;
  }
  const playerStats = useStats(["playerName", "playerTeam"], {
    matchId: [matchId],
  });

  const [xStat, setXStat] = useState<PlayerStatsNumericalKeys>("finalBlows");
  const [yStat, setYStat] = useState<PlayerStatsNumericalKeys>("deaths");

  const team1Data = playerStats.rows.filter(
    (stats) => stats.playerTeam === matchData.team1Name
  );
  const team2Data = playerStats.rows.filter(
    (stats) => stats.playerTeam === matchData.team2Name
  );

  const data = [
    ...team1Data.map((stats) => ({
      color: "blue",
      name: stats.playerName,
      data: [stats],
    })),
    ...team2Data.map((stats) => ({
      color: "red",
      name: stats.playerName,
      data: [stats],
    })),
  ];

  return (
    <Paper withBorder p="md">
      <Stack align="flex-start">
        <Title order={3}>Compare Players</Title>
        <ScatterChart
          h={500}
          w="100%"
          data={data}
          dataKey={{ x: xStat, y: yStat }}
          xAxisLabel={camelCaseToWords(xStat)}
          yAxisLabel={camelCaseToWords(yStat)}
          labels={{ x: camelCaseToWords(xStat), y: camelCaseToWords(yStat) }}
          valueFormatter={(value) => prettyFormat(value)}
          scatterProps={{
            shape: (props: any) => {
              return (
                <g transform={`translate(${props.x + 5}, ${props.y + 5})`}>
                  <circle
                    cx={0}
                    cy={0}
                    r={5}
                    fill={
                      props.playerTeam === matchData.team1Name
                        ? "#1971c2"
                        : "#e03131"
                    }
                  />
                  <text
                    x={0}
                    y={15}
                    fill="grey"
                    fontSize={12}
                    dominantBaseline="middle"
                    textAnchor="middle"
                  >
                    {props.playerName}
                  </text>
                </g>
              );
            },
          }}
        />
        <Group>
          <Select
            label="X Metric"
            data={playerStatsNumericalKeys.map((key) => ({
              label: camelCaseToWords(key),
              value: key,
            }))}
            value={xStat}
            onChange={(value) => setXStat(value as PlayerStatsNumericalKeys)}
            allowDeselect={false}
            searchable
          />
          <Select
            label="Y Metric"
            data={playerStatsNumericalKeys.map((key) => ({
              label: camelCaseToWords(key),
              value: key,
            }))}
            value={yStat}
            onChange={(value) => setYStat(value as PlayerStatsNumericalKeys)}
            allowDeselect={false}
            searchable
          />
        </Group>
      </Stack>
    </Paper>
  );
};

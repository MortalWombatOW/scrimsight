import { useAtomValue } from "jotai";
import {
  Title,
  Paper,
  Stack,
  Text,
  Center,
  Group,
  ColorSwatch,
} from "@mantine/core";
import { BarChart } from "@mantine/charts";
import { matchDataAtom, useStats } from "../../../../atoms";
import { camelCaseToWords, prettyFormat } from "../../../../lib/format";

interface TeamStatsComparisonProps {
  matchId: string;
}

export const TeamStatsComparison = ({ matchId }: TeamStatsComparisonProps) => {
  const matchData = useAtomValue(matchDataAtom).find(
    (match) => match.matchId === matchId
  );
  if (!matchData) {
    throw new Error("No match data");
  }

  const teamStats = useStats(["playerTeam"], { matchId: [matchId] });

  const statsToShow = [
    "finalBlows",
    "allDamageDealt",
    "healingDealt",
    "ultimatesUsed",
  ];

  const data: Record<string, number | string>[] = statsToShow.map((stat) => {
    const label = camelCaseToWords(stat);
    const row: Record<string, number | string> = {
      stat: label,
    };

    for (const teamStat of teamStats.rows) {
      row[teamStat.playerTeam] = teamStat[stat];
    }

    return row;
  });

  return (
    <Paper withBorder p="md">
      <Stack>
        <Title order={2}>Team Stats</Title>
        {data.map((stat) => (
          <BarChart
            key={stat.stat.toString()}
            orientation="vertical"
            data={[stat]}
            h={50}
            w={500}
            dataKey="stat"
            series={[
              {
                name: matchData.team1Name,
                color: "blue",
                label: matchData.team1Name,
                stackId: "team1",
              },
              {
                name: matchData.team2Name,
                color: "red",
                label: matchData.team2Name,
                stackId: "team2",
              },
            ]}
            yAxisProps={{ width: 120 }}
            barProps={{
              radius: 5,
            }}
            withBarValueLabel
            tickLine="none"
            strokeDasharray="0 1"
            withXAxis={false}
            valueFormatter={(value) => prettyFormat(value)}
            valueLabelProps={{ position: "inside", fill: "white" }}
          />
        ))}
        <Center>
          <Group>
            <Group>
              <ColorSwatch size={16} color="var(--mantine-color-blue-7)" />
              <Text size="xs">{matchData.team1Name}</Text>
            </Group>
            <Group>
              <ColorSwatch size={16} color="var(--mantine-color-red-7)" />
              <Text size="xs">{matchData.team2Name}</Text>
            </Group>
          </Group>
        </Center>
      </Stack>
    </Paper>
  );
};

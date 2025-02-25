import { useEffect, useState } from "react";
import {
  Avatar,
  Center,
  Group,
  Paper,
  Progress,
  Stack,
  Text,
  Title,
  Tooltip,
  Transition,
} from "@mantine/core";
import { BarChart } from "@mantine/charts";
import { useHover, usePrevious, useTimeout, useInterval } from "@mantine/hooks";
import { useStats } from "../../../../atoms";
import { getHeroImage } from "../../../../lib/data/hero";
import {
  camelCaseToAbbreviation,
  camelCaseToWords,
  prettyFormat,
} from "../../../../lib/format";

interface PlayerStatsCardProps {
  playerName: string;
  matchId: string;
}

export const PlayerStatsCard = ({
  playerName,
  matchId,
}: PlayerStatsCardProps) => {
  const playerStats = useStats(["playerName", "playerTeam", "playerRole"], {
    matchId: [matchId],
  });
  const heroStats = useStats(
    ["playerName", "playerHero"],
    { matchId: [matchId] },
    "playtime",
    "desc"
  ).rows.filter((stats) => stats.playerName === playerName);
  const { hovered, ref } = useHover();
  const lastHovered = usePrevious(hovered);
  const [highlighted, setHighlighted] = useState(false);
  const [progress, setProgress] = useState(0);

  const { start, clear } = useTimeout(([hovered]) => {
    setHighlighted(hovered);
  }, 1000);

  const interval = useInterval(() => {
    if (progress < 100) {
      setProgress(progress + 20);
    }
  }, 100);

  useEffect(() => {
    if (lastHovered !== hovered) {
      clear();
      start(hovered);
      setProgress(0);
      interval.start();
    }
    if ((!hovered && !highlighted) || (hovered && highlighted)) {
      clear();
      setProgress(0);
      interval.stop();
    }
  }, [hovered]);

  if (!playerStats || !heroStats.length) {
    throw new Error("No player stats");
  }

  const heroImage = getHeroImage(heroStats[0]?.playerHero, true);

  const playerRole = playerStats.rows.find(
    (stats) => stats.playerName === playerName
  )?.playerRole;

  const getStat = (stat: string): number => {
    return (
      playerStats.rows.find((stats) => stats.playerName === playerName)?.[
        stat
      ] ?? 0
    );
  };

  const getMaxStat = (stat: string) => {
    return Math.max(...playerStats.rows.map((stats) => stats[stat] || 0));
  };

  const getRanking = (
    stat: string
  ): { rank: number; max: number; percentage: number } => {
    const max = getMaxStat(stat);
    const percentage = max > 0 ? (getStat(stat) / max) * 100 : 0;
    const rank =
      playerStats.rows.filter((stats) => (stats[stat] || 0) > getStat(stat))
        .length + 1;
    return { rank, max, percentage };
  };

  const statsToShow = ["finalBlows", "allDamageDealt", "ultimatesUsed"];

  if (playerRole === "damage") {
    statsToShow.push("eliminations", "weaponAccuracy", "criticalHits");
  }

  if (playerRole === "support") {
    statsToShow.push("healingDealt", "offensiveAssists", "defensiveAssists");
  }

  if (playerRole === "tank") {
    statsToShow.push("damageBlocked");
  }

  return (
    <Transition transition="fade" mounted={true}>
      {(transitionStyles) => (
        <Paper
          withBorder
          p="md"
          w="fit-content"
          h="100%"
          ref={ref}
          style={{ ...transitionStyles }}
        >
          <Group style={{ alignItems: "flex-start" }}>
            <Stack>
              <Group>
                <Avatar src={heroImage} size="30" />
                <Stack gap="0">
                  <Title order={5}>{playerName}</Title>
                  <Text size="xs">
                    {
                      playerStats.rows.find(
                        (stats) => stats.playerName === playerName
                      )?.playerTeam
                    }
                  </Text>
                </Stack>
                <Group gap="0" style={{ alignItems: "flex-end" }}>
                  {(highlighted ? statsToShow : statsToShow.slice(0, 3)).map(
                    (stat) => (
                      <Tooltip
                        key={stat}
                        label={
                          <Text>
                            {playerName} is ranked #{getRanking(stat).rank} in{" "}
                            {camelCaseToWords(stat)} this match
                          </Text>
                        }
                      >
                        <Stack key={stat} gap="0" w="50px">
                          <Center>
                            <Avatar
                              size={getRanking(stat).rank === 1 ? "md" : "sm"}
                              color={
                                getRanking(stat).rank === 1
                                  ? "myColor"
                                  : "gray.5"
                              }
                            >
                              <Text
                                size={getRanking(stat).rank === 1 ? "md" : "sm"}
                              >
                                #{getRanking(stat).rank}
                              </Text>
                            </Avatar>
                          </Center>
                          <Center>
                            <Text size="xs">
                              {camelCaseToAbbreviation(stat)}
                            </Text>
                          </Center>
                        </Stack>
                      </Tooltip>
                    )
                  )}
                </Group>
              </Group>

              {(highlighted ? statsToShow : statsToShow.slice(0, 3)).map(
                (stat) => (
                  <BarChart
                    key={stat}
                    orientation="vertical"
                    h={25}
                    w={300}
                    data={[
                      { stat: camelCaseToWords(stat), value: getStat(stat) },
                    ]}
                    dataKey="stat"
                    series={[{ name: "value", color: "myColor" }]}
                    yAxisProps={{ width: 80 }}
                    barProps={{
                      radius: 5,
                    }}
                    withBarValueLabel
                    tickLine="none"
                    strokeDasharray="0 1"
                    withXAxis={false}
                    valueFormatter={(value) => prettyFormat(value)}
                    valueLabelProps={{ position: "inside", fill: "white" }}
                    xAxisProps={{
                      domain: [0, getMaxStat(stat)],
                    }}
                  />
                )
              )}
              {progress > 0 && progress < 100 && (
                <Progress
                  size={2}
                  value={progress}
                  color="myColor"
                  m="0"
                  mb="-16px"
                />
              )}
            </Stack>
          </Group>
        </Paper>
      )}
    </Transition>
  );
};

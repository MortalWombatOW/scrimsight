import { useParams } from "react-router-dom";
import { useAtomValue } from "jotai";
import { PlayerStatsNumericalKeys, matchDataAtom, playerStatsNumericalKeys, useStats } from "../../atoms";
import { Title, Group, Grid, Paper, Center, Stack, Text, Progress, Tooltip, Avatar, SimpleGrid, Box, Overlay, ColorSwatch, Select } from "@mantine/core";
import { camelCaseToWords, formatTime, prettyFormat } from "../../lib/format";
import { mapNameToFileName } from "../../lib/string";
import { Image } from "@mantine/core";
import { IoMdCalendar } from "react-icons/io";
import { MdAccessTime } from "react-icons/md";
import { TbClockHour1 } from "react-icons/tb";
import { getHeroImage } from "../../lib/data/hero";
import { GoTrophy } from "react-icons/go";
import { FiMapPin } from "react-icons/fi";
import { BarChart, ScatterChart } from "@mantine/charts";
import { useState } from "react";

const TeamStatsComparison = ({ matchId }: { matchId: string }) => {

  const matchData = useAtomValue(matchDataAtom).find((match) => match.matchId === matchId);
  if (!matchData) {
    throw new Error('No match data');
  }


  const teamStats = useStats(['playerTeam'], { matchId: [matchId] });

  const statsToShow = ["finalBlows", "allDamageDealt", "healingDealt", "ultimatesUsed"];

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


  console.log("data", data);


  return <Paper withBorder p="md">
    <Stack>
      <Title order={2}>Team Stats</Title>
      {data.map((stat) => (
        <BarChart
          orientation="vertical"
          data={[stat]}
          h={50}
          w={500}
          dataKey="stat"
          // type="stacked"
          series={[
            { name: matchData.team1Name, color: "blue", label: matchData.team1Name, stackId: "team1" },
            { name: matchData.team2Name, color: "red", label: matchData.team2Name, stackId: "team2" },
          ]}
          yAxisProps={{ width: 120 }}
          barProps={{
            radius: 5
          }}
          withBarValueLabel
          tickLine="none"
          strokeDasharray="0 1"
          withXAxis={false}
          valueFormatter={(value) => prettyFormat(value)}
          valueLabelProps={{ position: 'inside', fill: 'white' }}
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
}

const StatBar = ({ label, value, formattedValue, maxValue, icon, color, width, height, showLabel }: { label: string, value: number, formattedValue: string, maxValue: number, icon: React.ReactNode, color?: string, width: string, height: string, showLabel?: boolean }) => {
  const percentage = value / maxValue * 100;
  return <Group>
    <Avatar size="sm" color={color ?? "myColor"}>{icon}</Avatar>
    <Tooltip label={<Text>{formattedValue} {label}</Text>}>
      <Box w={width} pos="relative">
        <Progress size={height} radius="xl" value={percentage} color={color ?? "myColor"} />
        <Overlay backgroundOpacity={0}>
          <Center><Text size="xs" lh={height} fw={700} c="white">{formattedValue} {showLabel && label}</Text></Center>
        </Overlay>
      </Box>
    </Tooltip>
  </Group >
}

const PlayerStatsCard = ({ playerName, matchId }: { playerName: string, matchId: string }) => {
  const playerStats = useStats(['playerName', "playerTeam", "playerRole"], { matchId: [matchId] });
  const heroStats = useStats(['playerName', 'playerHero'], { matchId: [matchId] }, 'playtime', 'desc').rows.filter((stats) => stats.playerName === playerName);
  if (!playerStats || !heroStats) {
    throw new Error('No player stats');
  }

  console.log("heroStats", heroStats);

  const heroImage = getHeroImage(heroStats[0].playerHero, true);

  const playerRole = playerStats.rows.find((stats) => stats.playerName === playerName)?.playerRole;

  const getStat = (stat: string): number => {
    return playerStats.rows.find((stats) => stats.playerName === playerName)?.[stat] ?? 0;
  }

  const getMaxStat = (stat: string) => {
    return Math.max(...playerStats.rows.map((stats) => stats[stat]));
  }

  const statsToShow = ["finalBlows", "allDamageDealt", "ultimatesUsed"];

  if (playerRole === "support") {
    statsToShow.push("healingDealt");
  }

  if (playerRole === "tank") {
    statsToShow.push("damageBlocked");
  }

  return <Paper withBorder p="md" w="fit-content" h="100%">
    <Group style={{ alignItems: "flex-start" }}>
      <Stack>
        <Group>
          <Avatar src={heroImage} size="lg" />
          <Stack gap="0">
            <Title order={3}>{playerName}</Title>
            <Text size="xs">{playerStats.rows.find((stats) => stats.playerName === playerName)?.playerTeam}</Text>
          </Stack>
        </Group>
        <SimpleGrid cols={2}>
          {heroStats.map((stat) => (
            <StatBar key={stat.playerHero} label={`played on ${stat.playerHero}`} width="70px" height="20px" value={stat.playtime} formattedValue={formatTime(stat.playtime)} maxValue={Math.max(...heroStats.map((stats) => stats.playtime))} icon={<Avatar src={getHeroImage(stat.playerHero, true)} size="sm" />} color="myColor" />
          ))}
        </SimpleGrid>
      </Stack>
      <Stack>
        {statsToShow.map((stat) => (
          <BarChart
            orientation="vertical"
            h={25}
            w={300}
            data={[
              { stat: camelCaseToWords(stat), value: getStat(stat) },
            ]}
            dataKey="stat"
            series={[
              { name: "value", color: "myColor" },
            ]}
            yAxisProps={{ width: 120 }}
            barProps={{
              radius: 5
            }}
            withBarValueLabel
            tickLine="none"
            strokeDasharray="0 1"
            withXAxis={false}
            valueFormatter={(value) => prettyFormat(value)}
            valueLabelProps={{ position: 'inside', fill: 'white' }}
            xAxisProps={{
              domain: [0, getMaxStat(stat)]
            }}
          />
        ))}
      </Stack>
    </Group>
  </Paper>
}

const PlayerStatsComparison = ({ matchId }: { matchId: string }) => {
  const matchData = useAtomValue(matchDataAtom).find((match) => match.matchId === matchId);
  const playerStats = useStats(['playerName', "playerTeam", "playerRole"], { matchId: [matchId] });
  if (!matchData) {
    return null;
  }
  return <Paper p="0">
    <Stack gap="md">
      <Stack>
        <Title order={3}>{matchData.team1Name} Players</Title>
        <Group align="flex-start">
          {playerStats.rows.filter((stats) => stats.playerTeam === matchData.team1Name).map((player) => (
            <PlayerStatsCard key={player.playerName} playerName={player.playerName} matchId={matchId} />
          ))}
        </Group>
      </Stack>
      <Stack>
        <Title order={3}>{matchData.team2Name} Players</Title>
        <Group align="flex-start">
          {playerStats.rows.filter((stats) => stats.playerTeam === matchData.team2Name).map((player) => (
            <PlayerStatsCard key={player.playerName} playerName={player.playerName} matchId={matchId} />
          ))}
        </Group>
      </Stack>
    </Stack>
  </Paper>
}

interface MatchScoreCardProps {
  matchData: {
    team1Name: string;
    team2Name: string;
    team1Score: number;
    team2Score: number;
    roundWinners: ("team1" | "team2" | "draw")[];
  };
}

const AllPlayerComparison = ({ matchId }: { matchId: string }) => {
  const matchData = useAtomValue(matchDataAtom).find((match) => match.matchId === matchId);
  if (!matchData) {
    return null;
  }
  const playerStats = useStats(['playerName', "playerTeam"], { matchId: [matchId] });

  console.log("playerStats", playerStats);

  const [xStat, setXStat] = useState<PlayerStatsNumericalKeys>("finalBlows");
  const [yStat, setYStat] = useState<PlayerStatsNumericalKeys>("deaths");

  const team1Data = playerStats.rows.filter((stats) => stats.playerTeam === matchData.team1Name);
  const team2Data = playerStats.rows.filter((stats) => stats.playerTeam === matchData.team2Name);

  const data = [
    ...team1Data.map((stats) => ({ color: "blue", name: stats.playerName, data: [stats] })),
    ...team2Data.map((stats) => ({ color: "red", name: stats.playerName, data: [stats] })),
  ];

  return <Paper withBorder p="md">
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
      />
      <Group>
        <Select
          label="X Metric"
          data={playerStatsNumericalKeys.map((key) => ({ label: camelCaseToWords(key), value: key }))}
          value={xStat}
          onChange={(value) => setXStat(value as PlayerStatsNumericalKeys)}
          allowDeselect={false}
          searchable
        />
        <Select
          label="Y Metric"
          data={playerStatsNumericalKeys.map((key) => ({ label: camelCaseToWords(key), value: key }))}
          value={yStat}
          onChange={(value) => setYStat(value as PlayerStatsNumericalKeys)}
          allowDeselect={false}
          searchable
        />
      </Group>
    </Stack>
  </Paper>
}

const SingleStatPlayerComparison = ({ matchId }: { matchId: string }) => {
  const matchData = useAtomValue(matchDataAtom).find((match) => match.matchId === matchId);
  const playerStats = useStats(['playerName', "playerTeam"], { matchId: [matchId] });
  const [stat, setStat] = useState<PlayerStatsNumericalKeys>("finalBlows");

  if (!matchData) {
    return null;
  }

  const team1Data = playerStats.rows.filter((stats) => stats.playerTeam === matchData.team1Name).sort((a, b) => b[stat] - a[stat]);
  const team2Data = playerStats.rows.filter((stats) => stats.playerTeam === matchData.team2Name).sort((a, b) => b[stat] - a[stat]);

  return <Paper withBorder p="md">
    <Stack>
      <Title order={3}>Compare Metric</Title>
      <Select
        data={playerStatsNumericalKeys.map((key) => ({ label: camelCaseToWords(key), value: key }))}
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
        series={[
          { name: stat, color: "myColor", label: 'playerName' },
        ]}
        yAxisProps={{ width: 120 }}
        withBarValueLabel
        valueFormatter={(value) => prettyFormat(value)}
        valueLabelProps={{ position: 'inside', fill: 'white' }}
        barProps={{
          radius: 5
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
        series={[
          { name: stat, color: "myColor", label: 'playerName' },
        ]}
        yAxisProps={{ width: 120 }}
        withBarValueLabel
        valueFormatter={(value) => prettyFormat(value)}
        valueLabelProps={{ position: 'inside', fill: 'white' }}
        barProps={{
          radius: 5
        }}
        tickLine="none"
        strokeDasharray="0 1"
        withXAxis={false}
      />
    </Stack>
  </Paper>
}

const MatchScoreCard = ({ matchData }: MatchScoreCardProps) => {
  return (
    <Paper withBorder p="md">
      <Stack miw={300} gap="xs">
        <Grid>
          <Grid.Col span={4} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Text size="xs">Round</Text>
          </Grid.Col>
          <Grid.Col span={8} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Text size="xs">Winner</Text>
          </Grid.Col>
        </Grid>
        {matchData.roundWinners.map((winner, index) => (
          <Grid key={index}>
            <Grid.Col span={4} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Text>{index + 1}</Text>
            </Grid.Col>
            <Grid.Col span={8}>
              <Paper bg={winner === "team1" ? "blue.9" : winner === "team2" ? "redDark.6" : "gray.9"} p="xs" ta="center">
                <Text>{winner === "team1" ? matchData.team1Name : winner === "team2" ? matchData.team2Name : "Draw"}</Text>
              </Paper>
            </Grid.Col>
          </Grid>
        ))}
        <Grid>
          <Grid.Col span={4} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Group gap="xs">
              <GoTrophy size={16} />
              <Text size="xs">Winner</Text>
            </Group>
          </Grid.Col>
          <Grid.Col span={8}>
            <Paper bg={matchData.team1Score > matchData.team2Score ? "blue.8" : matchData.team2Score > matchData.team1Score ? "redDark.6" : "gray.9"} p="xs" ta="center">
              <Text fw={700} mb={10}>{matchData.team1Score > matchData.team2Score ? matchData.team1Name : matchData.team2Score > matchData.team1Score ? matchData.team2Name : "Draw"}</Text>
              <Group grow>
                <Paper withBorder bg="blue.8" p="xs">
                  <Title order={2}>{matchData.team1Score}</Title>
                </Paper>
                <Paper withBorder bg="redDark.8" p="xs">
                  <Title order={2}>{matchData.team2Score}</Title>
                </Paper>
              </Group>
            </Paper>
          </Grid.Col>
        </Grid>
      </Stack>
    </Paper>
  );
};

export const MatchPage2 = () => {
  const { matchId } = useParams<{ matchId: string }>();

  const matchDataList = useAtomValue(matchDataAtom)
  if (!matchDataList || !matchId) {
    return null;
  }
  const matchData = matchDataList.find((match) => match.matchId === matchId);
  if (!matchData) {
    return null;
  }
  // const teamStats = useStats(['playerTeam'], { matchId: [matchId] });
  // const playerStats = useStats(['playerName'], { matchId: [matchId] });

  return (
    <Group align="flex-start">

      <Paper withBorder p="0" w={350}>
        <Stack gap="0">
          <Image src={mapNameToFileName(matchData.map, false)} radius="sm" h={200} w={350} />
          <Group p="xs">
            <FiMapPin />
            <Title order={3}>{matchData.map} ({matchData.mode})</Title>
          </Group>
          <Group p="xs">
            <Group>
              <IoMdCalendar />
              <Text>{new Date(matchData.fileModified).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
            </Group>
            <Group>
              <MdAccessTime />
              <Text>{new Date(matchData.fileModified).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })}</Text>
            </Group>
            <Group>
              <TbClockHour1 />
              <Text>{formatTime(matchData.duration)}</Text>
            </Group>
          </Group>
        </Stack>
      </Paper>


      <MatchScoreCard matchData={matchData} />
      <TeamStatsComparison matchId={matchId} />
      <PlayerStatsComparison matchId={matchId} />
      <AllPlayerComparison matchId={matchId} />
      <SingleStatPlayerComparison matchId={matchId} />
    </Group>
  );
};
import { useParams } from "react-router-dom";
import { useAtomValue } from "jotai";
import { matchDataAtom, useStats } from "../../atoms";
import { Title, Group, Grid, Paper, Center, Stack, Text, Progress, Tooltip, Avatar, SimpleGrid, Box, Overlay } from "@mantine/core";
import { camelCaseToWords, formatTime, prettyFormat } from "../../lib/format";
import { mapNameToFileName } from "../../lib/string";
import { Image } from "@mantine/core";
import { IoMdCalendar } from "react-icons/io";
import { MdAccessTime } from "react-icons/md";
import { TbClockHour1 } from "react-icons/tb";
import { getHeroImage } from "../../lib/data/hero";
import { GiDeathSkull } from "react-icons/gi";
import { LuSword } from "react-icons/lu";
import { GiBullets } from "react-icons/gi";
import { GiHealthNormal } from "react-icons/gi";
import { GoTrophy } from "react-icons/go";
import { FiMapPin } from "react-icons/fi";
import { BarChart } from "@mantine/charts";


const TeamStatsComparison = ({ matchId }: { matchId: string }) => {
  const matchData = useAtomValue(matchDataAtom).find((match) => match.matchId === matchId);
  if (!matchData) {
    throw new Error('No match data');
  }

  const teamStats = useStats(['playerTeam'], { matchId: [matchId] });

  const statsToShow = ["finalBlows", "allDamageDealt", "healingDealt", "ultimatesUsed"];

  const data: { stat: string, team1Value: number, team1Name: string, team2Value: number, team2Name: string }[] = statsToShow.map((stat) => ({
    stat: camelCaseToWords(stat),
    team1Value: teamStats.rows.find((stats) => stats.playerTeam === matchData.team1Name)?.[stat] ?? 0,
    team1Name: matchData.team1Name,
    team2Value: teamStats.rows.find((stats) => stats.playerTeam === matchData.team2Name)?.[stat] ?? 0,
    team2Name: matchData.team2Name,
  }));


  console.log("data", data);


  return <Paper withBorder p="md">
    <Stack>
      <Title order={2}>Team Stats Comparison</Title>
      {/* <StatComparisonBar team1Name={matchData.team1Name} team2Name={matchData.team2Name} team1Value={team1Kills} team2Value={team2Kills} label="Kills" />
      <StatComparisonBar team1Name={matchData.team1Name} team2Name={matchData.team2Name} team1Value={team1Damage} team2Value={team2Damage} label="Damage" />
      <StatComparisonBar team1Name={matchData.team1Name} team2Name={matchData.team2Name} team1Value={team1Healing} team2Value={team2Healing} label="Healing" />
      <StatComparisonBar team1Name={matchData.team1Name} team2Name={matchData.team2Name} team1Value={team1UltsUsed} team2Value={team2UltsUsed} label="Ultimates Used" /> */}
      {data.map((stat) => (
        <BarChart
          orientation="vertical"
          data={[stat]}
          h={50}
          w={500}
          dataKey="stat"
          series={[
            { name: "team1Value", color: "blue", label: matchData.team1Name },
            { name: "team2Value", color: "red", label: matchData.team2Name },
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

  const roleIsSupport = playerStats.rows.find((stats) => stats.playerName === playerName)?.playerRole === "support";

  const getStat = (stat: string) => {
    return playerStats.rows.find((stats) => stats.playerName === playerName)?.[stat] ?? 0;
  }

  const getMaxStat = (stat: string) => {
    return Math.max(...playerStats.rows.map((stats) => stats[stat]));
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
        <StatBar label="Final Blows" showLabel width="200px" height="20px" value={getStat("finalBlows")} formattedValue={prettyFormat(getStat("finalBlows"))} maxValue={getMaxStat("finalBlows")} icon={<LuSword size={16} />} />
        <StatBar label="Eliminations" showLabel width="200px" height="20px" value={getStat("eliminations")} formattedValue={prettyFormat(getStat("eliminations"))} maxValue={getMaxStat("eliminations")} icon={<LuSword size={16} />} />
        <StatBar label="Deaths" showLabel width="200px" height="20px" value={getStat("deaths")} formattedValue={prettyFormat(getStat("deaths"))} maxValue={getMaxStat("deaths")} icon={<GiDeathSkull size={16} />} />
        <StatBar label="Damage" showLabel width="200px" height="20px" value={getStat("allDamageDealt")} formattedValue={prettyFormat(getStat("allDamageDealt"))} maxValue={getMaxStat("allDamageDealt")} icon={<GiBullets size={16} />} />
        {roleIsSupport && <StatBar label="Healing" showLabel width="200px" height="20px" value={getStat("healingDealt")} formattedValue={prettyFormat(getStat("healingDealt"))} maxValue={getMaxStat("healingDealt")} icon={<GiHealthNormal size={16} />} />}
        <StatBar label="Ultimates Used" showLabel width="200px" height="20px" value={getStat("ultimatesUsed")} formattedValue={prettyFormat(getStat("ultimatesUsed"))} maxValue={getMaxStat("ultimatesUsed")} icon={<Text fw={700}>Q</Text>} />
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
  return <Paper withBorder p="md">
    <Stack gap="md">
      <Stack>
        <Title order={3}>{matchData.team1Name}</Title>
        <Group align="flex-start">
          {playerStats.rows.filter((stats) => stats.playerTeam === matchData.team1Name).map((player) => (
            <PlayerStatsCard key={player.playerName} playerName={player.playerName} matchId={matchId} />
          ))}
        </Group>
      </Stack>
      <Stack>
        <Title order={3}>{matchData.team2Name}</Title>
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
    <Group>

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
    </Group>
  );
};
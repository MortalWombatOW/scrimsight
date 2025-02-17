import { useParams } from "react-router-dom";
import { useAtomValue } from "jotai";
import { matchDataAtom, useStats } from "../../atoms";
import { Title, Group, Grid, Paper, Center, Stack, Text, Space, Progress, Tooltip, NumberFormatter } from "@mantine/core";
import { formatTime, prettyFormat } from "../../lib/format";
import { mapNameToFileName } from "../../lib/string";
import { Image } from "@mantine/core";
import { IoMdCalendar } from "react-icons/io";
import { MdAccessTime } from "react-icons/md";
import { TbClockHour1 } from "react-icons/tb";

const StatComparisonBar = ({ team1Name, team2Name, team1Value, team2Value, label }: { team1Name: string, team2Name: string, team1Value: number, team2Value: number, label: string }) => {
  const total = team1Value + team2Value;
  const team1Percentage = team1Value / total * 100;
  const team2Percentage = team2Value / total * 100;

  return (
    <Stack gap="0">
      <Text>{label}</Text>
      <Progress.Root size="20" >
        <Tooltip label={`${team1Name}: ${prettyFormat(team1Value)} ${label.toLowerCase()}`}>
          <Progress.Section value={team1Percentage} color="blue">
            <Progress.Label><NumberFormatter value={team1Value} thousandSeparator decimalScale={0} /></Progress.Label>
          </Progress.Section>
        </Tooltip>
        <Tooltip label={`${team2Name}: ${prettyFormat(team2Value)} ${label.toLowerCase()}`}>
          <Progress.Section value={team2Percentage} color="red">
            <Progress.Label><NumberFormatter value={team2Value} thousandSeparator decimalScale={0} /></Progress.Label>
          </Progress.Section>
        </Tooltip>
      </Progress.Root>
    </Stack>
  )
}

const TeamStatsComparison = ({ matchId }: { matchId: string }) => {
  const matchData = useAtomValue(matchDataAtom).find((match) => match.matchId === matchId);
  if (!matchData) {
    throw new Error('No match data');
  }
  const teamStats = useStats(['playerTeam'], { matchId: [matchId] });

  console.log(teamStats.rows);

  const team1Kills = teamStats.rows.find((stats) => stats.playerTeam === matchData.team1Name)?.finalBlows;
  const team2Kills = teamStats.rows.find((stats) => stats.playerTeam === matchData.team2Name)?.finalBlows;

  const team1Damage = teamStats.rows.find((stats) => stats.playerTeam === matchData.team1Name)?.allDamageDealt;
  const team2Damage = teamStats.rows.find((stats) => stats.playerTeam === matchData.team2Name)?.allDamageDealt;

  const team1Healing = teamStats.rows.find((stats) => stats.playerTeam === matchData.team1Name)?.healingDealt;
  const team2Healing = teamStats.rows.find((stats) => stats.playerTeam === matchData.team2Name)?.healingDealt;

  const team1UltsUsed = teamStats.rows.find((stats) => stats.playerTeam === matchData.team1Name)?.ultimatesUsed;
  const team2UltsUsed = teamStats.rows.find((stats) => stats.playerTeam === matchData.team2Name)?.ultimatesUsed;




  return <Paper withBorder p="md">
    <Stack>
      <Title order={2}>Team Stats Comparison</Title>
      <StatComparisonBar team1Name={matchData.team1Name} team2Name={matchData.team2Name} team1Value={team1Kills} team2Value={team2Kills} label="Kills" />
      <StatComparisonBar team1Name={matchData.team1Name} team2Name={matchData.team2Name} team1Value={team1Damage} team2Value={team2Damage} label="Damage" />
      <StatComparisonBar team1Name={matchData.team1Name} team2Name={matchData.team2Name} team1Value={team1Healing} team2Value={team2Healing} label="Healing" />
      <StatComparisonBar team1Name={matchData.team1Name} team2Name={matchData.team2Name} team1Value={team1UltsUsed} team2Value={team2UltsUsed} label="Ultimates Used" />
    </Stack>
  </Paper >
}

export const MatchPage2 = () => {
  const { matchId } = useParams<{ matchId: string }>();
  if (!matchId) {
    throw new Error('No match ID');
  }
  const matchData = useAtomValue(matchDataAtom).find((match) => match.matchId === matchId);
  if (!matchData) {
    throw new Error('No match data');
  }
  // const teamStats = useStats(['playerTeam'], { matchId: [matchId] });
  // const playerStats = useStats(['playerName'], { matchId: [matchId] });

  return (
    <div>
      <Image src={mapNameToFileName(matchData.map, false)} radius="md" h={200} w="100%" mb="lg" />
      <Grid>
        <Grid.Col span={4}>
          <Center>
            <Title order={1}>{matchData.team1Name}</Title>
          </Center>
        </Grid.Col>
        <Grid.Col span={4}>
          <Center>
            <Group>
              <Paper bg="blue.9" p="xs">
                <Title order={2}>{matchData.team1Score}</Title>
              </Paper>
              <Paper bg="red.9" p="xs">
                <Title order={2}>{matchData.team2Score}</Title>
              </Paper>
            </Group>
          </Center>
        </Grid.Col>
        <Grid.Col span={4}>
          <Center>
            <Title order={1}>{matchData.team2Name}</Title>
          </Center>
        </Grid.Col>
      </Grid>
      <Space h="md" />
      <Paper withBorder p="md" mb="lg">
        <Group grow>
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
      </Paper>
      <TeamStatsComparison matchId={matchId} />
    </div>
  );
};
import { Title, Divider, Space, Group, MultiSelect, Text, Paper, Stack, Grid, Avatar, Center, Progress, Tooltip, Card, Image } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useAtomValue } from 'jotai';
import { matchDataAtom } from '../../atoms/matchDataAtom';
import { teamNamesAtom } from '../../atoms/teamNamesAtom';
import { uniquePlayerNamesAtom } from '../../atoms/uniquePlayerNamesAtom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { uniqueMapNamesAtom } from '../../atoms/uniqueMapNamesAtom';
import { mapNameToFileName } from '../../lib/string';
import { Carousel } from '@mantine/carousel';
import { scrimAtom } from '../../atoms/scrimAtom';
export const MatchesPage = () => {

  const navigate = useNavigate();
  const matchData = useAtomValue(matchDataAtom);
  const scrims = useAtomValue(scrimAtom);
  if (matchData.length === 0) {
    console.log('No match data found, redirecting to home');
    navigate('/');
  }


  const uniqueDates = Array.from(new Set(matchData.map((match) => match.dateString))).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  const teamNames = useAtomValue(teamNamesAtom);
  const playerNames = useAtomValue(uniquePlayerNamesAtom);
  const mapNames = useAtomValue(uniqueMapNamesAtom);

  const [teamFilter, setTeamFilter] = useState<string[]>([]);
  const [playerFilter, setPlayerFilter] = useState<string[]>([]);
  const [mapFilter, setMapFilter] = useState<string[]>([]);
  console.log(teamFilter, playerFilter);


  const minDate = matchData.length > 0 ? matchData.map((match) => new Date(match.fileModified)).reduce((min, date) => date < min ? date : min, new Date(matchData[0].fileModified)) : new Date();

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([new Date(minDate), new Date()]);

  const filteredMatches = matchData.filter((match) => {
    const matchDate = new Date(match.fileModified);
    const passesDateFilter = dateRange[0] && dateRange[1] ? matchDate >= dateRange[0] && matchDate <= dateRange[1] : true;
    const passesTeamFilter = teamFilter.length === 0 ? true : teamFilter.includes(match.team1Name) || teamFilter.includes(match.team2Name);
    const passesPlayerFilter = playerFilter.length === 0 ? true : (match.team1Players.concat(match.team2Players)).some(player => playerFilter.includes(player));
    const passesMapFilter = mapFilter.length === 0 ? true : mapFilter.includes(match.map);
    return passesDateFilter && passesTeamFilter && passesPlayerFilter && passesMapFilter;
  });

  const filteredScrims = scrims.filter((scrim) => {
    return scrim.matchIds.some((matchId) => filteredMatches.some((match) => match.matchId === matchId));
  });

  const filteredUniqueDates = uniqueDates.filter((date) => {
    return filteredScrims.some((scrim) => scrim.dateString === date);
  });

  console.log(filteredUniqueDates);
  console.log(filteredScrims);
  console.log(filteredMatches);


  return (
    <div>
      <Title order={1}>
        Matches
      </Title>
      <Space h="md" />
      <Group grow>
        <MultiSelect placeholder="Search by team name, player name, etc." searchable data={[
          { group: 'Teams', items: teamNames },
          { group: 'Players', items: playerNames },
          { group: 'Maps', items: mapNames },
        ]}
          value={teamFilter.concat(playerFilter).concat(mapFilter)}
          onChange={(value) => {
            setTeamFilter(value.filter((item) => teamNames.includes(item)));
            setPlayerFilter(value.filter((item) => playerNames.includes(item)));
            setMapFilter(value.filter((item) => mapNames.includes(item)));
          }}
        />
        <DatePickerInput type="range" clearable placeholder="Show matches between dates" value={dateRange} onChange={(value) => setDateRange(value as [Date, Date])} />
      </Group>
      <Space h="md" />
      <Divider />
      <Space h="md" />
      {filteredUniqueDates.map((dateString) => {
        const date = new Date(dateString);
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
        const monthDay = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
        const year = date.getFullYear();
        return <div key={dateString}>
          <Title order={3}>{dayOfWeek}, {monthDay}, {year}</Title>
          <Divider />
          <Space h="md" />
          {filteredScrims.filter((scrim) => scrim.dateString === dateString).map((scrim) => {
            return <Paper key={scrim.dateString} withBorder p="md">
              <Stack>
                <Grid>
                  <Grid.Col span={5}>
                    <Stack>
                      <Center><Avatar color="blue">{scrim.team1Name.split(' ').map((name) => name[0]).join('')}</Avatar></Center>
                      <Center><Text>{scrim.team1Name}</Text></Center>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={2}>
                    <Group grow>
                      <Paper bg="dark.9" p="xs" ta="center" >
                        <Text>{scrim.team1Wins}</Text>
                      </Paper>
                      <Paper bg="dark.9" p="xs" ta="center">
                        <Text>{scrim.team2Wins}</Text>
                      </Paper>
                    </Group>
                    <Space h="lg" />
                    <Progress.Root size="20">
                      <Tooltip label={`${scrim.team1Wins} match${scrim.team1Wins === 1 ? '' : 'es'} won by ${scrim.team1Name}`}>
                        <Progress.Section value={scrim.team1Wins / (scrim.team1Wins + scrim.team2Wins + scrim.draws) * 100} color="blue">
                          <Progress.Label>{scrim.team1Wins}</Progress.Label>
                        </Progress.Section>
                      </Tooltip>
                      <Tooltip label={`${scrim.draws} draw${scrim.draws === 1 ? '' : 's'}`}>
                        <Progress.Section value={scrim.draws / (scrim.team1Wins + scrim.team2Wins + scrim.draws) * 100} color="gray">
                          <Progress.Label>{scrim.draws}</Progress.Label>
                        </Progress.Section>
                      </Tooltip>
                      <Tooltip label={`${scrim.team2Wins} match${scrim.team2Wins === 1 ? '' : 'es'} won by ${scrim.team2Name}`}>
                        <Progress.Section value={scrim.team2Wins / (scrim.team1Wins + scrim.team2Wins + scrim.draws) * 100} color="red">
                          <Progress.Label>{scrim.team2Wins}</Progress.Label>
                        </Progress.Section>
                      </Tooltip>
                    </Progress.Root>
                  </Grid.Col>
                  <Grid.Col span={5}>
                    <Stack>
                      <Center><Avatar color="red">{scrim.team2Name.split(' ').map((name) => name[0]).join('')}</Avatar></Center>
                      <Center><Text>{scrim.team2Name}</Text></Center>
                    </Stack>
                  </Grid.Col>

                </Grid>
                {scrim.matchIds.map((matchId) => {
                  const match = filteredMatches.find((match) => match.matchId === matchId);
                  if (!match) {
                    throw new Error(`Match ${matchId} not found in filteredMatches`);
                  }
                  return <Card key={matchId}>
                    <Card.Section>
                      <Image src={mapNameToFileName(match.map, false)} height={100} />
                    </Card.Section>
                    <Text>{matchId}</Text>
                  </Card>;
                })}
              </Stack>
            </Paper>;
          })}
        </div>;
      })}
    </div>
  );
};


import { Title, Divider, Space, Group, MultiSelect, Text, Paper, Stack, Grid, Avatar, Center, Tooltip, Image, Loader, Button } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useAtomValue } from 'jotai';
import { matchDataAtom } from '../../atoms/matchDataAtom';
import { teamNamesAtom } from '../../atoms/teamNamesAtom';
import { uniquePlayerNamesAtom } from '../../atoms/uniquePlayerNamesAtom';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Suspense, useMemo } from 'react';
import { uniqueMapNamesAtom } from '../../atoms/uniqueMapNamesAtom';
import { mapNameToFileName } from '../../lib/string';
import { scrimAtom } from '../../atoms/scrimAtom';
import { useStats } from '../../atoms/metrics/playerMetricsAtoms';
import { getHeroImage } from '../../lib/data/hero';
import { formatTime } from '../../lib/format';
import { CiMap } from "react-icons/ci";
import { CiClock1 } from "react-icons/ci";
import React from 'react';
interface PlayerCardProps {
  playerName: string;
  matchId: string;
  highlight: boolean;
}

const PlayerCard = React.memo(({ playerName, matchId, highlight }: PlayerCardProps) => {
  const playerStats = useStats(['playerHero'], { playerName: [playerName], matchId: [matchId] }, 'playtime');
  const tooltipContent = useMemo(() =>
    `${playerStats.rows[0].playerHero} - ${formatTime(playerStats.rows[0].playtime)}`,
    [playerStats]
  );
  return <Paper bg={highlight ? 'myColor.9' : 'dark.8'} radius="md">
    <Group>
      <Tooltip label={tooltipContent}>
        <Avatar src={getHeroImage(playerStats.rows[0].playerHero, true)} radius="lg" size="sm" />
      </Tooltip>
      <Text size="sm">{playerName}</Text>
    </Group>
  </Paper>;

});


interface MatchCardProps {
  matchId: string;
  playerFilter: string[];
}

const MatchCard = React.memo(({ matchId, playerFilter }: MatchCardProps) => {
  const matchData = useAtomValue(matchDataAtom);
  const match = matchData.find((match) => match.matchId === matchId);
  const playerStats = useStats(['playerName', 'playerRole', 'playerTeam'], { matchId: [matchId] });
  const navigate = useNavigate();

  if (!match) {
    throw new Error(`Match ${matchId} not found in matchData`);
  }

  return (
    <Paper p="md" withBorder bg="dark.8" mb="sm">
      <Grid>
        <Grid.Col span={4}>
          <Center>
            <Stack gap="xs">
              {playerStats.rows
                .filter((stats) => stats.playerRole === 'tank' && stats.playerTeam === match.team1Name)
                .map((stats) => {
                  return (
                    <PlayerCard key={stats.playerName} playerName={stats.playerName} matchId={matchId} highlight={playerFilter.includes(stats.playerName)} />
                  );
                })}

              {playerStats.rows
                .filter((stats) => stats.playerRole === 'damage' && stats.playerTeam === match.team1Name)
                .map((stats) => {
                  return (
                    <PlayerCard key={stats.playerName} playerName={stats.playerName} matchId={matchId} highlight={playerFilter.includes(stats.playerName)} />
                  );
                })}

              {playerStats.rows
                .filter((stats) => stats.playerRole === 'support' && stats.playerTeam === match.team1Name)
                .map((stats) => {
                  return (
                    <PlayerCard key={stats.playerName} playerName={stats.playerName} matchId={matchId} highlight={playerFilter.includes(stats.playerName)} />
                  );
                })}
            </Stack>
          </Center>
        </Grid.Col>
        <Grid.Col span={4}>
          <Stack gap="xs">
            <Center>
              <Image src={mapNameToFileName(match.map, false)} radius="md" h={100} w={100} />
            </Center>
            <Center>
              <Group>
                <CiMap />
                <Text>{match.map}</Text>
              </Group>
            </Center>
            <Center>
              <Group>
                <Paper bg="blue.9" p="xs" ta="center">
                  <Text>{match.team1Score}</Text>
                </Paper>
                <Paper bg="red.9" p="xs" ta="center">
                  <Text>{match.team2Score}</Text>
                </Paper>
              </Group>
            </Center>
            <Center>
              <Button variant="light" color="blue" onClick={() => navigate(`/matches/${matchId}`)}>View Match</Button>
            </Center>
          </Stack>
        </Grid.Col>
        <Grid.Col span={4}>
          <Center>
            <Stack gap="xs">
              {playerStats.rows
                .filter((stats) => stats.playerRole === 'tank' && stats.playerTeam === match.team2Name)
                .map((stats) => {
                  return (
                    <PlayerCard key={stats.playerName} playerName={stats.playerName} matchId={matchId} highlight={playerFilter.includes(stats.playerName)} />
                  );
                })}

              {playerStats.rows
                .filter((stats) => stats.playerRole === 'damage' && stats.playerTeam === match.team2Name)
                .map((stats) => {
                  return (
                    <PlayerCard key={stats.playerName} playerName={stats.playerName} matchId={matchId} highlight={playerFilter.includes(stats.playerName)} />
                  );
                })}

              {playerStats.rows
                .filter((stats) => stats.playerRole === 'support' && stats.playerTeam === match.team2Name)
                .map((stats) => {
                  return (
                    <PlayerCard key={stats.playerName} playerName={stats.playerName} matchId={matchId} highlight={playerFilter.includes(stats.playerName)} />
                  );
                })}

            </Stack>
          </Center>
        </Grid.Col>
      </Grid>
    </Paper>
  );
});

interface TeamScoreRowProps {
  teamName: string;
  matchIds: string[];
  matchData: {
    matchId: string;
    team1Score: number;
    team2Score: number;
    fileModified: string;
  }[];
  wins: number;
  teamColor: string;
  teamNameWidth: number;
  matchScoreWidth: number;
  finalScoreWidth: number;
  isTeam1: boolean;
}

const TeamScoreRow = React.memo(({
  teamName,
  matchIds,
  matchData,
  wins,
  teamColor,
  teamNameWidth,
  matchScoreWidth,
  finalScoreWidth,
  isTeam1
}: TeamScoreRowProps) => {
  return (
    <Grid>
      <Grid.Col span={teamNameWidth}>
        <Group>
          <Avatar color={teamColor}>{teamName.split(' ').map((name) => name[0]).join('')}</Avatar>
          <Text fw={900}>{teamName}</Text>
        </Group>
      </Grid.Col>
      <Grid.Col span={matchScoreWidth}>
        <Grid grow>
          {matchIds.map((matchId) => {
            const match = matchData.find((match) => match.matchId === matchId);
            return (
              <Grid.Col key={matchId} span={1}>
                <Paper bg="gray.9" p="xs" ta="center">
                  <Text>{isTeam1 ? match?.team1Score : match?.team2Score}</Text>
                </Paper>
              </Grid.Col>
            );
          })}
        </Grid>
      </Grid.Col>
      <Grid.Col span={finalScoreWidth}>
        <Paper bg={`${teamColor}.9`} p="xs" ta="center" >
          <Text fw={900}>{wins}</Text>
        </Paper>
      </Grid.Col>
    </Grid>
  );
});

interface ScrimHeaderProps {
  scrim: {
    team1Name: string;
    team2Name: string;
    team1Wins: number;
    team2Wins: number;
    matchIds: string[];
  };
  matchData: {
    matchId: string;
    team1Score: number;
    team2Score: number;
    fileModified: string;
  }[];
}

const ScrimHeader = React.memo(({ scrim, matchData }: ScrimHeaderProps) => {

  const teamNameWidth = 4;
  const matchScoreWidth = 4;
  const finalScoreWidth = 1;
  const metadataWidth = 4;
  return (
    <Stack gap="xs">
      <Grid>
        <Grid.Col span={teamNameWidth} />
        <Grid.Col span={matchScoreWidth}>
          <Grid grow>
            {scrim.matchIds.map((_, index) => {
              return (
                <Grid.Col span={1}>
                  <Text size="sm">Match {index + 1}</Text>
                </Grid.Col>
              );
            })}
          </Grid>
        </Grid.Col>
        <Grid.Col span={finalScoreWidth}>
          <Text>Final Score</Text>
        </Grid.Col>
        <Grid.Col span={metadataWidth} />
      </Grid>
      <TeamScoreRow
        isTeam1={true}
        teamName={scrim.team1Name}
        matchIds={scrim.matchIds}
        matchData={matchData}
        wins={scrim.team1Wins}
        teamColor="blue"
        teamNameWidth={teamNameWidth}
        matchScoreWidth={matchScoreWidth}
        finalScoreWidth={finalScoreWidth}
      />
      <TeamScoreRow
        isTeam1={false}
        teamName={scrim.team2Name}
        matchIds={scrim.matchIds}
        matchData={matchData}
        wins={scrim.team2Wins}
        teamColor="red"
        teamNameWidth={teamNameWidth}
        matchScoreWidth={matchScoreWidth}
        finalScoreWidth={finalScoreWidth}
      />
    </Stack >
  );
});

interface MatchDateGroupProps {
  dateString: string;
  teamFilter: string[];
  playerFilter: string[];
  mapFilter: string[];
  dateRange: [Date | null, Date | null];
}

const MatchDateGroup = React.memo(({ dateString, dateRange, teamFilter, playerFilter, mapFilter }: MatchDateGroupProps) => {
  const matchData = useAtomValue(matchDataAtom);
  const scrims = useAtomValue(scrimAtom);

  const date = new Date(dateString);
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
  const monthDay = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  const year = date.getFullYear();


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

  console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);

  return (
    <div>
      <Title order={3}>{dayOfWeek}, {monthDay}, {year}</Title>
      <Space h="md" />
      {filteredScrims.map((scrim) => {
        return (
          <Suspense fallback={<Loader />}>
            <Paper key={scrim.dateString} bg="dark.8" p="md" mb="lg">
              <Stack>
                <ScrimHeader scrim={scrim} matchData={matchData} />
                {scrim.matchIds.filter((matchId) => filteredMatches.some((match) => match.matchId === matchId)).map((matchId) => (
                  <Suspense fallback={<Loader />}>
                    <MatchCard key={matchId} matchId={matchId} playerFilter={playerFilter} />
                  </Suspense>
                ))}
              </Stack>
            </Paper></Suspense>
        );
      })}
    </div>
  );
});

// Memoize MatchDateGroup with deep comparison for dateRange
const MemoizedMatchDateGroup = React.memo(MatchDateGroup, (prev, next) => {
  return prev.dateString === next.dateString &&
    prev.teamFilter.join() === next.teamFilter.join() &&
    prev.playerFilter.join() === next.playerFilter.join() &&
    prev.mapFilter.join() === next.mapFilter.join() &&
    prev.dateRange?.[0]?.getTime() === next.dateRange?.[0]?.getTime() &&
    prev.dateRange?.[1]?.getTime() === next.dateRange?.[1]?.getTime();
});

export const MatchesPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const teamFilter = useMemo(() => searchParams.get('teams')?.split(',') || [], [searchParams]);
  const playerFilter = useMemo(() => searchParams.get('players')?.split(',') || [], [searchParams]);
  const mapFilter = useMemo(() => searchParams.get('maps')?.split(',') || [], [searchParams]);

  const dateRange = useMemo<[Date | null, Date | null]>(() => {
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    return [
      from ? new Date(from) : null,
      to ? new Date(to) : null,
    ];
  }, [searchParams]);

  const updateFilters = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    setSearchParams(params);
  };

  const handleFilterChange = (value: string[]) => {
    updateFilters({
      teams: value.filter(item => teamNames.includes(item)).join(','),
      players: value.filter(item => playerNames.includes(item)).join(','),
      maps: value.filter(item => mapNames.includes(item)).join(',')
    });
  };

  const handleDateChange = (range: [Date | null, Date | null]) => {
    updateFilters({
      from: range[0]?.toISOString() || null,
      to: range[1]?.toISOString() || null
    });
  };

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

  const filteredUniqueDates = useMemo(() =>
    uniqueDates.filter((date) =>
      filteredScrims.some((scrim) => scrim.dateString === date)
    ),
    [uniqueDates, filteredScrims]
  );



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
          value={[...teamFilter, ...playerFilter, ...mapFilter]}
          onChange={handleFilterChange}
        />
        <DatePickerInput type="range" clearable placeholder="Show matches between dates" value={dateRange} onChange={handleDateChange} />
      </Group>
      <Space h="md" />
      <Divider />
      <Space h="md" />
      <Suspense fallback={<Loader />}>
        {filteredUniqueDates.map((dateString) => (
          <MemoizedMatchDateGroup
            key={dateString}
            dateString={dateString}
            dateRange={dateRange}
            teamFilter={teamFilter}
            playerFilter={playerFilter}
            mapFilter={mapFilter}
          />
        ))}
      </Suspense>
    </div>
  );
};


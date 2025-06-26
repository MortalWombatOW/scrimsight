import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Trophy, Users, Zap } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { useScrimsightData } from "../hooks/useScrimsightData";
import {
  PlayerStatsNumerical,
  PlayerStatsNumericalKeys,
  PLAYER_STAT_RANKING_DIRECTIONS,
  Hero,
  PlayerName,
  TeamName,
  MatchID,
} from "../lib/ScrimsightDataModel";
import * as R from "remeda";
import ScrimsightPage from "../components/ScrimsightPage";
import PageHeader from "../components/PageHeader";
import PageSection from "../components/PageSection";
import BreadCrumbs from "../components/BreadCrumbs";
import MatchHeader from "../components/MatchHeader";
import DataTable from "../components/DataTable";
import TeamfightCard from "../components/TeamfightCard";
import EmptyState from "../components/EmptyState";
import TimelineBar, { Segment } from "../components/TimelineBar";
import HeroIcon from "../icons/HeroIcon";
import RoleIcon from "../icons/RoleIcon";
import { prettyFormat } from "../lib/format";
import { getRoleFromHero } from "../lib/hero";
import { getRoute } from "../lib/route";

const MatchDetailsPage = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const dataModel = useScrimsightData();

  const {
    matches,
    playerStatBreakdown,
    teamfights
  } = dataModel;

  // Helper function to calculate performance indicator
  const getPerformanceIndicator = (
    value: number,
    averageValue: number,
    metricKey: PlayerStatsNumericalKeys
  ): string => {
    const higherIsBetter =
      PLAYER_STAT_RANKING_DIRECTIONS[metricKey] === "higher";
    
    const deviation = ((value - averageValue) / averageValue) * 100;
    
    if (Math.abs(deviation) < 10) return "●"; // Near average
    
    if (higherIsBetter) {
      return deviation > 10 ? "↗" : "↘"; // Above/below average
    } else {
      return deviation > 10 ? "↘" : "↗"; // Above/below average (inverted)
    }
  };

  // Compute global averages for player stats
  const playerAverageStats = useMemo(() => {
    const allPlayers = playerStatBreakdown.byTeamAndPlayerAndMatch;
    if (allPlayers.length === 0) return null;

    // Get all numeric keys from PlayerStatsNumerical
    const numericKeys = Object.keys(allPlayers[0]).filter(
      (key) =>
        !['playerName', 'playerTeam', 'matchId', 'playerHero'].includes(key) &&
        typeof allPlayers[0][key as keyof typeof allPlayers[0]] === "number"
    ) as PlayerStatsNumericalKeys[];

    // Compute average for each metric
    const averages = Object.fromEntries(
      numericKeys.map((key) => [
        key,
        R.pipe(
          allPlayers,
          R.map((player) => player[key] as number),
          R.mean()
        ),
      ])
    ) as PlayerStatsNumerical;

    return averages;
  }, [playerStatBreakdown.byTeamAndPlayerAndMatch]);

  // Get match details
  const matchDetails = useMemo(() => {
    if (!matchId) return null;
    return matches.find((match) => match.match === matchId) || null;
  }, [matches, matchId]);

  // Get player stats for this match with hero information
  const matchPlayerStats = useMemo(() => {
    if (!matchId) return [];
    
    // Get aggregated stats
    const aggregatedStats = playerStatBreakdown.byTeamAndPlayerAndMatch.filter(
      (stat) => stat.matchId === matchId
    );
    
    // Get hero information from raw playerStat events
    const playerStatEvents = dataModel.playerStat.filter(
      (event) => event.matchId === matchId
    );
    
    // Create map of player -> primary hero (most played)
    const playerHeroMap = new Map<string, Hero>();
    const playerPlaytimeMap = new Map<string, Map<Hero, number>>();
    
    playerStatEvents.forEach(event => {
      const key = `${event.playerName}-${event.playerTeam}`;
      if (!playerPlaytimeMap.has(key)) {
        playerPlaytimeMap.set(key, new Map());
      }
      const heroMap = playerPlaytimeMap.get(key)!;
      const currentTime = heroMap.get(event.playerHero) || 0;
      heroMap.set(event.playerHero, currentTime + (event.eliminations + event.deaths + 1)); // Use activity as proxy for playtime
    });
    
    // Find primary hero for each player
    playerPlaytimeMap.forEach((heroMap, playerKey) => {
      let maxTime = 0;
      let primaryHero: Hero = 'Soldier: 76'; // Default fallback
      heroMap.forEach((time, hero) => {
        if (time > maxTime) {
          maxTime = time;
          primaryHero = hero;
        }
      });
      playerHeroMap.set(playerKey, primaryHero);
    });
    
    // Enrich aggregated stats with hero information
    return aggregatedStats.map(stat => {
      const key = `${stat.playerName}-${stat.playerTeam}`;
      const primaryHero = playerHeroMap.get(key) || 'Soldier: 76';
      return {
        ...stat,
        playerHero: primaryHero
      };
    });
  }, [playerStatBreakdown.byTeamAndPlayerAndMatch, matchId, dataModel.playerStat]);

  // Get teamfights for this match
  const matchTeamfights = useMemo(() => {
    if (!matchId) return [];
    return teamfights.filter((tf) => tf.matchId === matchId);
  }, [teamfights, matchId]);

  // Player scoreboard columns
  type PlayerStatEntry = { playerName: PlayerName; playerTeam: TeamName; matchId: MatchID; playerHero: Hero } & PlayerStatsNumerical;

  const scoreboardColumns: ColumnDef<PlayerStatEntry>[] = [
    {
      accessorKey: "playerName",
      header: "Player",
      enableSorting: true,
      cell: ({ getValue, row }) => (
        <div className="flex items-center gap-2">
          <RoleIcon role={getRoleFromHero(row.original.playerHero)} />
          <span className="font-medium">{getValue() as string}</span>
        </div>
      ),
    },
    {
      accessorKey: "eliminations",
      header: "Elims",
      enableSorting: true,
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2">
          <span>{prettyFormat(getValue() as number)}</span>
          {playerAverageStats && (
            <span className="text-xs opacity-70">
              {getPerformanceIndicator(
                getValue() as number,
                playerAverageStats.eliminations || 0,
                "eliminations"
              )}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "finalBlows",
      header: "Final Blows",
      enableSorting: true,
      cell: ({ getValue }) => prettyFormat(getValue() as number),
    },
    {
      accessorKey: "deaths",
      header: "Deaths",
      enableSorting: true,
      cell: ({ getValue }) => prettyFormat(getValue() as number),
    },
    {
      accessorKey: "heroDamageDealt",
      header: "Damage",
      enableSorting: true,
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2">
          <span>{prettyFormat(getValue() as number)}</span>
          {playerAverageStats && (
            <span className="text-xs opacity-70">
              {getPerformanceIndicator(
                getValue() as number,
                playerAverageStats.heroDamageDealt || 0,
                "heroDamageDealt"
              )}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "healingDealt",
      header: "Healing",
      enableSorting: true,
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2">
          <span>{prettyFormat(getValue() as number)}</span>
          {playerAverageStats && (
            <span className="text-xs opacity-70">
              {getPerformanceIndicator(
                getValue() as number,
                playerAverageStats.healingDealt || 0,
                "healingDealt"
              )}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "ultimatesUsed",
      header: "Ults",
      enableSorting: true,
      cell: ({ getValue }) => getValue() as number,
    },
    {
      accessorKey: "playerHero",
      header: "Hero",
      enableSorting: true,
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2">
          <HeroIcon hero={getValue() as Hero} size={24} showTooltip />
          <span>{getValue() as string}</span>
        </div>
      ),
    },
  ];

  // Team composition analysis
  const teamCompositions = useMemo(() => {
    if (!matchPlayerStats.length || !matchDetails) return null;

    const team1Players = matchPlayerStats.filter(
      (stat) => stat.playerTeam === matchDetails.teams[0]
    );
    const team2Players = matchPlayerStats.filter(
      (stat) => stat.playerTeam === matchDetails.teams[1]
    );

    const getTeamComp = (players: PlayerStatEntry[]) => {
      const roleCount = players.reduce((acc, player) => {
        const role = getRoleFromHero(player.playerHero);
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        tank: roleCount.tank || 0,
        damage: roleCount.damage || 0,
        support: roleCount.support || 0,
        heroes: players.map(p => p.playerHero),
        players: players.map(p => ({ name: p.playerName, hero: p.playerHero }))
      };
    };

    return {
      team1: {
        name: matchDetails.teams[0],
        composition: getTeamComp(team1Players),
        totalDamage: team1Players.reduce((sum, p) => sum + p.heroDamageDealt, 0),
        totalHealing: team1Players.reduce((sum, p) => sum + p.healingDealt, 0),
        totalElims: team1Players.reduce((sum, p) => sum + p.eliminations, 0),
      },
      team2: {
        name: matchDetails.teams[1],
        composition: getTeamComp(team2Players),
        totalDamage: team2Players.reduce((sum, p) => sum + p.heroDamageDealt, 0),
        totalHealing: team2Players.reduce((sum, p) => sum + p.healingDealt, 0),
        totalElims: team2Players.reduce((sum, p) => sum + p.eliminations, 0),
      }
    };
  }, [matchPlayerStats, matchDetails]);

  // Create timeline segments
  const timelineSegments = useMemo(() => {
    if (!matchDetails || !matchTeamfights.length) return [];

    const segments: Segment[] = [];
    const matchDuration = matchDetails.duration;

    // Add teamfight segments
    matchTeamfights.forEach((teamfight, index) => {
      const team1Won = teamfight.winner === matchDetails.teams[0];
      segments.push({
        id: `teamfight-${index}`,
        start: teamfight.startTime,
        end: teamfight.endTime,
        color: team1Won ? '#22c55e' : '#ef4444', // green for team1 wins, red for team2 wins
        icon: <Zap size={12} />
      });
    });

    // Add round markers if available
    if (matchDetails.rounds && matchDetails.rounds.length > 1) {
      const roundDuration = matchDuration / matchDetails.rounds.length;
      matchDetails.rounds.forEach((round, index) => {
        if (index > 0) { // Skip first round start
          segments.push({
            id: `round-${round}`,
            start: roundDuration * index,
            end: roundDuration * index + 1, // 1 second marker
            color: '#6b7280', // gray for round boundaries
            icon: <div className="text-xs font-bold">{round}</div>
          });
        }
      });
    }

    return segments.sort((a, b) => a.start - b.start);
  }, [matchDetails, matchTeamfights]);

  if (!matchId || !matchDetails) {
    return (
      <ScrimsightPage>
        <EmptyState
          icon={Trophy}
          title="Match not found"
          description="The requested match could not be found in the dataset"
          size="lg"
        />
      </ScrimsightPage>
    );
  }

  const breadcrumbs = [
    { label: "Home", path: getRoute("/") },
    { label: "Matches", path: getRoute("/matches") },
    { label: matchId }
  ];

  // Sort players by team for scoreboard
  const team1Players = matchPlayerStats.filter(
    (stat) => stat.playerTeam === matchDetails.teams[0]
  );
  const team2Players = matchPlayerStats.filter(
    (stat) => stat.playerTeam === matchDetails.teams[1]
  );

  return (
    <ScrimsightPage>
      <PageHeader>
        <BreadCrumbs items={breadcrumbs} />
        <PageHeader.Icon>
          <Trophy size={32} />
        </PageHeader.Icon>
        <PageHeader.Title>Match Details</PageHeader.Title>
      </PageHeader>

      <MatchHeader
        matchId={matchDetails.match}
        mapName={matchDetails.map}
        gameMode={matchDetails.gameMode}
        team1Name={matchDetails.teams[0]}
        team2Name={matchDetails.teams[1]}
        winningTeam={matchDetails.winningTeam}
        team1Score={matchDetails.team1Score}
        team2Score={matchDetails.team2Score}
      />

      {/* Scoreboard */}
      <PageSection variant="card">
        <PageSection.Title>Scoreboard</PageSection.Title>
        <PageSection.Content>
          {team1Players.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3 text-success">
                {matchDetails.teams[0]} {matchDetails.winningTeam === matchDetails.teams[0] && "👑"}
              </h4>
              <DataTable
                columns={scoreboardColumns}
                data={team1Players}
                rowKey={(row) => `${row.playerName}-${row.playerHero}`}
                defaultSort="eliminations"
              />
            </div>
          )}

          {team2Players.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-3 text-error">
                {matchDetails.teams[1]} {matchDetails.winningTeam === matchDetails.teams[1] && "👑"}
              </h4>
              <DataTable
                columns={scoreboardColumns}
                data={team2Players}
                rowKey={(row) => `${row.playerName}-${row.playerHero}`}
                defaultSort="eliminations"
              />
            </div>
          )}
        </PageSection.Content>
      </PageSection>

      {/* Match Timeline */}
      <PageSection>
        <PageSection.Title>Match Timeline</PageSection.Title>
        <PageSection.Description>
          Visual timeline showing teamfights, round transitions, and key events during the match
        </PageSection.Description>
        <PageSection.Content>
          {timelineSegments.length > 0 ? (
            <div className="space-y-4">
              <TimelineBar
                segments={timelineSegments}
                total={matchDetails.duration}
                onSegmentClick={(segmentId) => {
                  // Could scroll to teamfight section or show details
                  console.log('Clicked segment:', segmentId);
                }}
              />
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>{matchDetails.teams[0]} teamfight wins</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>{matchDetails.teams[1]} teamfight wins</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-500 rounded"></div>
                  <span>Round boundaries</span>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={Zap}
              title="No timeline data available"
              description="Unable to generate timeline for this match"
              size="sm"
            />
          )}
        </PageSection.Content>
      </PageSection>

      {/* Team Compositions */}
      {teamCompositions && (
        <PageSection>
          <PageSection.Title>Team Compositions</PageSection.Title>
          <PageSection.Description>
            Team composition breakdown and effectiveness analysis
          </PageSection.Description>
          <PageSection.Content>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Team 1 */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-success">
                    {teamCompositions.team1.name}
                    {matchDetails.winningTeam === teamCompositions.team1.name && " 👑"}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold mb-2">Role Distribution</p>
                      <div className="flex gap-4 text-sm">
                        <span>Tank: {teamCompositions.team1.composition.tank}</span>
                        <span>Damage: {teamCompositions.team1.composition.damage}</span>
                        <span>Support: {teamCompositions.team1.composition.support}</span>
                      </div>
                    </div>

                    <div>
                      <p className="font-semibold mb-2">Heroes</p>
                      <div className="flex flex-wrap gap-2">
                        {teamCompositions.team1.composition.heroes.map((hero, index) => (
                          <div key={`${hero}-${index}`} className="flex items-center gap-1">
                            <HeroIcon hero={hero} size={20} showTooltip />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="stats stats-vertical text-xs">
                      <div className="stat py-2">
                        <div className="stat-title text-xs">Total Damage</div>
                        <div className="stat-value text-sm">{prettyFormat(teamCompositions.team1.totalDamage)}</div>
                      </div>
                      <div className="stat py-2">
                        <div className="stat-title text-xs">Total Healing</div>
                        <div className="stat-value text-sm">{prettyFormat(teamCompositions.team1.totalHealing)}</div>
                      </div>
                      <div className="stat py-2">
                        <div className="stat-title text-xs">Total Eliminations</div>
                        <div className="stat-value text-sm">{teamCompositions.team1.totalElims}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team 2 */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-error">
                    {teamCompositions.team2.name}
                    {matchDetails.winningTeam === teamCompositions.team2.name && " 👑"}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold mb-2">Role Distribution</p>
                      <div className="flex gap-4 text-sm">
                        <span>Tank: {teamCompositions.team2.composition.tank}</span>
                        <span>Damage: {teamCompositions.team2.composition.damage}</span>
                        <span>Support: {teamCompositions.team2.composition.support}</span>
                      </div>
                    </div>

                    <div>
                      <p className="font-semibold mb-2">Heroes</p>
                      <div className="flex flex-wrap gap-2">
                        {teamCompositions.team2.composition.heroes.map((hero, index) => (
                          <div key={`${hero}-${index}`} className="flex items-center gap-1">
                            <HeroIcon hero={hero} size={20} showTooltip />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="stats stats-vertical text-xs">
                      <div className="stat py-2">
                        <div className="stat-title text-xs">Total Damage</div>
                        <div className="stat-value text-sm">{prettyFormat(teamCompositions.team2.totalDamage)}</div>
                      </div>
                      <div className="stat py-2">
                        <div className="stat-title text-xs">Total Healing</div>
                        <div className="stat-value text-sm">{prettyFormat(teamCompositions.team2.totalHealing)}</div>
                      </div>
                      <div className="stat py-2">
                        <div className="stat-title text-xs">Total Eliminations</div>
                        <div className="stat-value text-sm">{teamCompositions.team2.totalElims}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </PageSection.Content>
        </PageSection>
      )}

      {/* Teamfights */}
      <PageSection>
        <PageSection.Title>Teamfights</PageSection.Title>
        <PageSection.Description>
          Detailed breakdown of all teamfights that occurred during this match
        </PageSection.Description>
        <PageSection.Content>
          {matchTeamfights.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {matchTeamfights
                .sort((a, b) => a.startTime - b.startTime)
                .map((teamfight, index) => (
                  <TeamfightCard key={`${teamfight.matchId}-${index}`} teamfight={teamfight} />
                ))}
            </div>
          ) : (
            <EmptyState
              icon={Zap}
              title="No teamfights recorded"
              description="No teamfight data is available for this match"
              size="sm"
            />
          )}
        </PageSection.Content>
      </PageSection>

      {/* Player Performance */}
      <PageSection>
        <PageSection.Title>Player Performance</PageSection.Title>
        <PageSection.Description>
          Individual player statistics and performance metrics for this match
        </PageSection.Description>
        <PageSection.Content>
          {matchPlayerStats.length > 0 ? (
            <DataTable
              columns={scoreboardColumns}
              data={matchPlayerStats}
              rowKey={(row) => `${row.playerName}-${row.playerHero}`}
              defaultSort="eliminations"
            />
          ) : (
            <EmptyState
              icon={Users}
              title="No player stats available"
              description="No player statistics are available for this match"
              size="sm"
            />
          )}
        </PageSection.Content>
      </PageSection>
    </ScrimsightPage>
  );
};

export default MatchDetailsPage;

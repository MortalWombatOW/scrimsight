import { useMemo, type ReactNode } from "react";
import { useTimelineContext } from "./TimelineContext";
import { formatDuration } from "../../lib";

export const TimelineTable = (): ReactNode => {
  const { loadedData, currentTimeRange, timeRangeLabel } = useTimelineContext();

  const playerStats = useMemo(() => {
    if (!loadedData?.events) return [];

    // Filter events within current time range
    const filteredEvents = loadedData.events.filter(
      (event) =>
        event.time >= currentTimeRange.start &&
        event.time <= currentTimeRange.end
    );

    // Create a map to store stats for each player
    const playerStatsMap = new Map();

    // Process each event to calculate stats
    filteredEvents.forEach((event) => {
      // Initialize player entry if it doesn't exist
      const playerKey = `${event.playerName}-${event.teamName}`;
      if (!playerStatsMap.has(playerKey)) {
        playerStatsMap.set(playerKey, {
          playerName: event.playerName,
          teamName: event.teamName,
          hero: event.playerHero,
          role: event.playerRole,
          isTeam1: event.isTeam1,
          kills: 0,
          deaths: 0,
          damageDealt: 0,
          damageReceived: 0,
          healingDealt: 0,
          healingReceived: 0,
          ultimatesUsed: 0,
          resurrections: 0,
          assists: 0,
        });
      }

      const playerStats = playerStatsMap.get(playerKey);

      // Update stats based on event type
      if (
        event.type === "playerInteractionEvent" &&
        event.playerInteractionEvent
      ) {
        const {
          playerInteractionEventType,
          direction,
        } = event.playerInteractionEvent;

        if (
          playerInteractionEventType === "Killed player" &&
          direction === "outgoing"
        ) {
          playerStats.kills += 1;
        }

        if (playerInteractionEventType === "Died" && direction === "incoming") {
          playerStats.deaths += 1;
        }

        if (playerInteractionEventType === "Dealt Damage") {
          playerStats.damageDealt += 1;
        }

        if (playerInteractionEventType === "Received Damage") {
          playerStats.damageReceived += 1;
        }

        if (playerInteractionEventType === "Dealt Healing") {
          playerStats.healingDealt += 1;
        }

        if (playerInteractionEventType === "Received Healing") {
          playerStats.healingReceived += 1;
        }

        if (playerInteractionEventType === "Resurrected Player") {
          playerStats.resurrections += 1;
        }
      }

      if (event.type === "playerEvent" && event.playerEvent) {
        const { playerEventType } = event.playerEvent;

        if (
          playerEventType === "defensiveAssist" ||
          playerEventType === "offensiveAssist"
        ) {
          playerStats.assists += 1;
        }
      }

      if (event.type === "ultimateEvent") {
        playerStats.ultimatesUsed += 1;
      }

      playerStatsMap.set(playerKey, playerStats);
    });

    // Convert map to array and sort by team then player name
    return Array.from(playerStatsMap.values()).sort((a, b) => {
      if (a.isTeam1 !== b.isTeam1) {
        return a.isTeam1 ? -1 : 1;
      }
      return a.playerName.localeCompare(b.playerName);
    });
  }, [loadedData?.events, currentTimeRange]);

  // Calculate team totals
  const teamStats = useMemo(() => {
    const team1 = {
      name: playerStats.find((p) => p.isTeam1)?.teamName || "Team 1",
      kills: 0,
      deaths: 0,
      damageDealt: 0,
      healingDealt: 0,
      ultimatesUsed: 0,
    };

    const team2 = {
      name: playerStats.find((p) => !p.isTeam1)?.teamName || "Team 2",
      kills: 0,
      deaths: 0,
      damageDealt: 0,
      healingDealt: 0,
      ultimatesUsed: 0,
    };

    playerStats.forEach((player) => {
      const team = player.isTeam1 ? team1 : team2;
      team.kills += player.kills;
      team.deaths += player.deaths;
      team.damageDealt += player.damageDealt;
      team.healingDealt += player.healingDealt;
      team.ultimatesUsed += player.ultimatesUsed;
    });

    return { team1, team2 };
  }, [playerStats]);

  if (!loadedData?.events || playerStats.length === 0) {
    return (
      <div className="p-4 text-center">
        No data available for the selected time range
      </div>
    );
  }

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-lg font-semibold mb-2">
        Totals during {timeRangeLabel} (
        {formatDuration(currentTimeRange.end - currentTimeRange.start)})
      </h2>

      {/* Team Summary Section */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="p-3 border rounded-lg shadow-sm bg-base-200">
          <h3 className="font-medium text-base-content">
            {teamStats.team1.name}
          </h3>
          <div className="grid grid-cols-5 gap-2 mt-2 text-sm">
            <div className="text-center">
              <div className="font-bold">{teamStats.team1.kills}</div>
              <div className="text-xs opacity-70">Kills</div>
            </div>
            <div className="text-center">
              <div className="font-bold">{teamStats.team1.deaths}</div>
              <div className="text-xs opacity-70">Deaths</div>
            </div>
            {/* <div className="text-center">
              <div className="font-bold">{teamStats.team1.damageDealt}</div>
              <div className="text-xs opacity-70">Damage</div>
            </div>
            <div className="text-center">
              <div className="font-bold">{teamStats.team1.healingDealt}</div>
              <div className="text-xs opacity-70">Healing</div>
            </div> */}
            <div className="text-center">
              <div className="font-bold">{teamStats.team1.ultimatesUsed}</div>
              <div className="text-xs opacity-70">Ultimates</div>
            </div>
          </div>
        </div>

        <div className="p-3 border rounded-lg shadow-sm bg-base-200">
          <h3 className="font-medium text-base-content">
            {teamStats.team2.name}
          </h3>
          <div className="grid grid-cols-5 gap-2 mt-2 text-sm">
            <div className="text-center">
              <div className="font-bold">{teamStats.team2.kills}</div>
              <div className="text-xs opacity-70">Kills</div>
            </div>
            <div className="text-center">
              <div className="font-bold">{teamStats.team2.deaths}</div>
              <div className="text-xs opacity-70">Deaths</div>
            </div>
            {/* /   <div className="text-center">
              <div className="font-bold">{teamStats.team2.damageDealt}</div>
              <div className="text-xs opacity-70">Damage</div>
            </div>
            <div className="text-center">
              <div className="font-bold">{teamStats.team2.healingDealt}</div>
              <div className="text-xs opacity-70">Healing</div>
            </div>/ */}
            <div className="text-center">
              <div className="font-bold">{teamStats.team2.ultimatesUsed}</div>
              <div className="text-xs opacity-70">Ultimates</div>
            </div>
          </div>
        </div>
      </div>

      {/* Player Stats Table */}
      <div className="overflow-x-auto">
        <table className="table table-compact w-full">
          <thead>
            <tr>
              <th>Team</th>
              <th>Player</th>
              <th>Hero</th>
              <th>Role</th>
              <th>K</th>
              <th>D</th>
              {/* <th>DMG</th>
              <th>HEAL</th> */}
              <th>ULT</th>
              <th>AST</th>
              <th>RES</th>
            </tr>
          </thead>
          <tbody>
            {playerStats.map((player, index) => (
              <tr
                key={`${player.playerName}-${player.teamName}-${index}`}
                className={player.isTeam1 ? "bg-base-200/20" : "bg-base-300/20"}
              >
                <td>{player.teamName}</td>
                <td>{player.playerName}</td>
                <td>{player.hero}</td>
                <td>{player.role}</td>
                <td>{player.kills}</td>
                <td>{player.deaths}</td>
                {/* <td>{player.damageDealt}</td>
                <td>{player.healingDealt}</td> */}
                <td>{player.ultimatesUsed}</td>
                <td>{player.assists}</td>
                <td>{player.resurrections}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

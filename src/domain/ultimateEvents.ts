import { UltimateEvent, MatchEvents } from '../data/types';

export function calculateUltimateEvents(events: MatchEvents): UltimateEvent[] {
  const chargedEvents = events.ultimateCharged;
  const startEvents = events.ultimateStart;
  const endEvents = events.ultimateEnd;

  return chargedEvents.flatMap((charged) => {
    const start = startEvents.find(
      (s) =>
        s.matchId === charged.matchId &&
        s.playerName === charged.playerName &&
        s.playerTeam === charged.playerTeam &&
        s.playerHero === charged.playerHero &&
        s.ultimateId === charged.ultimateId &&
        s.matchTime >= charged.matchTime
    );

    if (!start) return [];

    const end = endEvents.find(
      (e) =>
        e.matchId === charged.matchId &&
        e.playerName === charged.playerName &&
        e.playerTeam === charged.playerTeam &&
        e.playerHero === charged.playerHero &&
        e.ultimateId === charged.ultimateId &&
        e.matchTime >= start.matchTime
    );

    if (!end) return [];

    return [
      {
        id: `${charged.matchId}-${charged.matchTime}-${charged.playerName}-${charged.playerHero}-ultimateCharged`,
        matchId: charged.matchId,
        playerName: charged.playerName,
        playerTeam: charged.playerTeam,
        playerHero: charged.playerHero,
        ultimateId: charged.ultimateId.toString(),
        ultimateChargedTime: charged.matchTime,
        ultimateStartTime: start.matchTime,
        ultimateEndTime: end.matchTime,
        ultimateHoldTime: start.matchTime - charged.matchTime,
      },
    ];
  });
}

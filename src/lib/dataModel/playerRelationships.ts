
import * as ScrimsightDataModel from "../ScrimsightDataModel";
import { getRoleFromHero } from "../hero";
import * as R from "remeda";

export const buildPlayerRelationships = (dataModel: ScrimsightDataModel.ScrimsightDataModel): ScrimsightDataModel.PlayerRelationships[] => {
  const allPlayerEvents = [
    ...R.map(dataModel.heroSpawn, e => ({ playerName: e.playerName, playerTeam: e.playerTeam })),
    ...R.map(dataModel.heroSwap, e => ({ playerName: e.playerName, playerTeam: e.playerTeam })),
    ...R.map(dataModel.kill, e => ({ playerName: e.attackerName, playerTeam: e.attackerTeam })),
    ...R.map(dataModel.kill, e => ({ playerName: e.victimName, playerTeam: e.victimTeam })),
    ...R.map(dataModel.damage, e => ({ playerName: e.attackerName, playerTeam: e.attackerTeam })),
    ...R.map(dataModel.damage, e => ({ playerName: e.victimName, playerTeam: e.victimTeam }))
  ];

  const allPlayers = R.pipe(
    allPlayerEvents,
    R.map(event => event.playerName),
    R.unique()
  );

  return R.map(allPlayers, playerName => {
    const playerTeams = R.pipe(
      allPlayerEvents,
      R.filter(event => event.playerName === playerName),
      R.map(event => event.playerTeam),
      R.unique()
    );

    const playerScrims = R.pipe(
      dataModel.scrims,
      R.filter(scrim => scrim.teams.some(team => playerTeams.includes(team))),
      R.map(scrim => scrim.scrim)
    );

    const playerMatches = R.pipe(
      dataModel.matches,
      R.filter(match => match.teams.some(team => playerTeams.includes(team))),
      R.map(match => match.match)
    );

    // Calculate heroes with playtime directly from playerLives
    const playerLivesForPlayer = R.filter(dataModel.playerLives, life => life.player === playerName);
    
    const heroesWithPlaytime = R.pipe(
      playerLivesForPlayer,
      R.groupBy(life => life.hero),
      R.entries(),
      R.map(([hero, lives]) => ({
        hero: hero as ScrimsightDataModel.Hero,
        playtime: R.sumBy(lives, life => life.duration)
      })),
      R.sortBy(item => -item.playtime) // Sort by playtime descending
    );

    // Calculate roles with playtime from the hero playtime data
    const rolesWithPlaytime = R.pipe(
      heroesWithPlaytime,
      R.map(heroEntry => ({
        role: getRoleFromHero(heroEntry.hero),
        playtime: heroEntry.playtime
      })),
      R.sortBy(item => -item.playtime) // Sort by playtime descending
    );

    return {
      player: playerName,
      teams: playerTeams,
      scrims: playerScrims,
      matches: playerMatches,
      heroes: heroesWithPlaytime,
      roles: rolesWithPlaytime
    };
  });
};
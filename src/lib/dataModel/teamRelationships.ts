
import * as ScrimsightDataModel from "../ScrimsightDataModel";
import * as R from "remeda";

export const buildTeamRelationships = (dataModel: ScrimsightDataModel.ScrimsightDataModel): ScrimsightDataModel.TeamRelationships[] => {
  const allTeams = R.pipe(
    dataModel.scrims,
    R.flatMap(scrim => scrim.teams),
    R.unique()
  );

  return R.map(allTeams, teamName => {
    const teamScrims = R.pipe(
      dataModel.scrims,
      R.filter(scrim => scrim.teams.includes(teamName)),
      R.map(scrim => scrim.scrim)
    );

    const teamPlayers = R.pipe(
      dataModel.playerStat,
      R.filter(event => event.playerTeam === teamName),
      R.map(event => event.playerName),
      R.unique()
    );

    return {
      team: teamName,
      players: teamPlayers,
      scrims: teamScrims
    };
  });
};
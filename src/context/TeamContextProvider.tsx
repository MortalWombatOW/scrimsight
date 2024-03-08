import React from 'react';
import {TeamContext, TeamContextState} from './TeamContext';

export const TeamContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [team1Name, setTeam1Name] = React.useState('Team 1');
  const [team2Name, setTeam2Name] = React.useState('Team 2');

  const setTeamNames = (team1Name: string, team2Name: string) => {
    setTeam1Name(team1Name);
    setTeam2Name(team2Name);
  };

  const contextValue: TeamContextState = {
    team1Name,
    team2Name,
    setTeamNames,
  };

  return (
    <TeamContext.Provider value={contextValue}>{children}</TeamContext.Provider>
  );
};

import React from 'react';

export interface TeamContext {
  team1Name: string;
  team2Name: string;
}

export interface TeamContextState {
  team1Name: string;
  team2Name: string;
  setTeamNames: (team1Name: string, team2Name: string) => void;
}

const defaultState: TeamContextState = {
  team1Name: 'Team 1',
  team2Name: 'Team 2',
  setTeamNames: (team1Name: string, team2Name: string) => {
    console.error('setTeamNames context not initialized', team1Name, team2Name);
  },
};

export const TeamContext = React.createContext<TeamContextState>(defaultState);

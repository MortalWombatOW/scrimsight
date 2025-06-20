import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { dataModelAtom } from './scrimsight';
import type { 
  ScrimID, 
  MatchID, 
  PlayerName, 
  TeamName,
  ScrimRelationships,
  MatchRelationships,
  PlayerStats,
  Teamfight
} from '@library/ScrimsightDataModel';

// All scrims sorted by date (newest first)
export const scrimsListAtom = atom((get) => {
  const dataModel = get(dataModelAtom);
  if (!dataModel) return [];
  
  return [...dataModel.scrims].sort((a, b) => b.date.getTime() - a.date.getTime());
});

// Scrim info by scrimId
export const scrimAtom = atomFamily((scrimId: ScrimID) =>
  atom((get) => {
    const dataModel = get(dataModelAtom);
    if (!dataModel) return null;
    
    return dataModel.scrims.find(scrim => scrim.scrim === scrimId) || null;
  })
);

// Last 5 scrims
export const recentScrimsAtom = atom((get) => {
  const scrims = get(scrimsListAtom);
  return scrims.slice(0, 5);
});

// All matches
export const matchesAtom = atom((get) => {
  const dataModel = get(dataModelAtom);
  if (!dataModel) return [];
  
  return dataModel.matches;
});

// Match info by matchId
export const matchAtom = atomFamily((matchId: MatchID) =>
  atom((get) => {
    const dataModel = get(dataModelAtom);
    if (!dataModel) return null;
    
    return dataModel.matches.find(match => match.match === matchId) || null;
  })
);

// Player stats by playerName
export const playerStatsAtom = atomFamily((playerName: PlayerName) =>
  atom((get) => {
    const dataModel = get(dataModelAtom);
    if (!dataModel) return [];
    
    return dataModel.playerStats.filter(stats => stats.playerName === playerName);
  })
);

// Teamfights by matchId or scrimId
export const teamfightsAtom = atomFamily((id: MatchID | ScrimID) =>
  atom((get) => {
    const dataModel = get(dataModelAtom);
    if (!dataModel) return [];
    
    // Check if it's a matchId first
    const match = dataModel.matches.find(m => m.match === id);
    if (match) {
      return dataModel.teamfights.filter(tf => tf.matchId === id);
    }
    
    // Otherwise, treat as scrimId and get all teamfights for matches in that scrim
    const scrim = dataModel.scrims.find(s => s.scrim === id);
    if (scrim) {
      return dataModel.teamfights.filter(tf => scrim.matches.includes(tf.matchId));
    }
    
    return [];
  })
);

// Players in a team by teamName
export const teamPlayersAtom = atomFamily((teamName: TeamName) =>
  atom((get) => {
    const dataModel = get(dataModelAtom);
    if (!dataModel) return [];
    
    const team = dataModel.teams.find(t => t.team === teamName);
    return team ? team.players : [];
  })
);
import * as ScrimsightDataModel from "../ScrimsightDataModel";

const rankValues = <T extends Record<string, number | string>>(
  records: T[], 
  metrics: ScrimsightDataModel.PlayerStatsNumericalKeys[]
): T[] => {
  if (records.length === 0) return [];
  
  const rankedRecords = records.map(record => ({ ...record })) as (T & Record<ScrimsightDataModel.PlayerStatsNumericalKeys, number>)[];

  metrics.forEach(metric => {
    const direction = ScrimsightDataModel.PLAYER_STAT_RANKING_DIRECTIONS[metric];

    // Create a list of { value, originalIndex } pairs
    const indexedValues = records.map((record, index) => ({
      value: record[metric] as number,
      originalIndex: index,
    }));

    // Sort these pairs based on the value and direction
    indexedValues.sort((a, b) => {
      if (direction === 'higher') {
        return b.value - a.value;
      } else { // 'lower'
        return a.value - b.value;
      }
    });

    // Assign ranks, handling ties and skipping ranks
    let currentRank = 1;
    for (let i = 0; i < indexedValues.length; i++) {
      if (i > 0 && indexedValues[i].value !== indexedValues[i - 1].value) {
        currentRank = i + 1;
      }
      rankedRecords[indexedValues[i].originalIndex][metric] = currentRank;
    }
  });
  
  return rankedRecords;
};

export const buildPlayerStatBreakdownRanks = (playerStatBreakdown: ScrimsightDataModel.PlayerStatBreakdown): ScrimsightDataModel.PlayerStatBreakdown => {
  const metrics = ScrimsightDataModel.playerStatsNumericalKeys;
  
  return {
    // Total ranking (all metrics get rank 1 since there's only one total)
    total: Object.fromEntries(metrics.map(metric => [metric, 1])) as Record<ScrimsightDataModel.PlayerStatsNumericalKeys, number>,
    
    // Rank each breakdown type
    byPlayer: rankValues(playerStatBreakdown.byPlayer, metrics),
    byTeam: rankValues(playerStatBreakdown.byTeam, metrics),
    byTeamAndPlayer: rankValues(playerStatBreakdown.byTeamAndPlayer, metrics),
    byTeamAndPlayerAndMatch: rankValues(playerStatBreakdown.byTeamAndPlayerAndMatch, metrics),
    byTeamAndPlayerAndScrim: rankValues(playerStatBreakdown.byTeamAndPlayerAndScrim, metrics),
    byPlayerAndHero: rankValues(playerStatBreakdown.byPlayerAndHero, metrics),
    byRole: rankValues(playerStatBreakdown.byRole, metrics),
    byHero: rankValues(playerStatBreakdown.byHero, metrics),
    byTeamAndMatch: rankValues(playerStatBreakdown.byTeamAndMatch, metrics),
    byTeamAndScrim: rankValues(playerStatBreakdown.byTeamAndScrim, metrics)
  };
};

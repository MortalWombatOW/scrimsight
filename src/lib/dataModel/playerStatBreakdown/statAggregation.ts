import * as ScrimsightDataModel from "../../ScrimsightDataModel";
import * as R from "remeda";

export const aggregateBaseStats = (records: ScrimsightDataModel.PlayerStatsBase[]): ScrimsightDataModel.PlayerStatsAggregatedBase => {
    const allKeys = [...ScrimsightDataModel.playerStatsBaseNumericalKeys, ...ScrimsightDataModel.playerStatsDerivedMeasuresKeys];
    return R.pipe(
        allKeys,
        R.map(key => [key, R.sumBy(records, record => record[key] as number)] as const),
        R.fromEntries()
    ) as ScrimsightDataModel.PlayerStatsAggregatedBase;
    }

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {ReactNode, useContext, useEffect} from 'react';
import {AlaSQLNode} from '../../../WombatDataFramework/DataTypes';
import {useDataNodes} from '../../../hooks/useData';
import TuneIcon from '@mui/icons-material/Tune';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Popover,
  Grid,
} from '@mui/material';
import {
  getHeroImage,
  getRankForRole,
  getRoleFromHero,
} from '../../../lib/data/hero';
import IconAndText from '../../../components/Common/IconAndText';
import {getIcon} from '../../../components/Common/RoleIcons';
import {heroNameToNormalized} from '../../../lib/string';
import {ColorKey} from '../../../theme';
import {useMapContext} from '../context/MapContext';

type PlayerStat = {
  name: string;
  abbreviation: string;
  description: string;
  alignRight: boolean;
  accessor: (player: any, per10Mode: boolean) => string | number;
  formatter: (value: string | number, player: any) => ReactNode;
};

function FormattedTableCell({
  sx,
  children,
  colorKey,
}: {
  sx?: any;
  children?: React.ReactNode;
  colorKey: ColorKey;
}) {
  return (
    <TableCell
      sx={{
        borderLeft: 'none',
        borderRight: 'none',
        borderBottomColor: `${colorKey}.dark`,
        ...sx,
      }}>
      <div style={{paddingRight: '8px', paddingLeft: '8px'}}>{children}</div>
    </TableCell>
  );
}

function MetricCell({
  metric,
  submetric,
  submetricDesc,
  alignedRight,
  colorKey,
}: {
  metric: string;
  alignedRight?: boolean;
  submetric?: string;
  submetricDesc?: string;
  colorKey: ColorKey;
}) {
  return (
    <FormattedTableCell
      sx={alignedRight ? {textAlign: 'right'} : {}}
      colorKey={colorKey}>
      {metric}
      {submetric && (
        <Typography
          variant="caption"
          sx={{color: 'text.secondary', display: 'block'}}>
          {submetric} {submetricDesc}
        </Typography>
      )}
    </FormattedTableCell>
  );
}

function PlayerHeroesList({playerHeroes}) {
  return (
    <>
      {/* <ul
      style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
      }}> */}
      {Array.from(new Set(playerHeroes)).map((hero: string) => (
        <span
          key={hero}
          //  style={{width: 28, overflowX: 'visible'}}
        >
          <IconAndText
            variant="contained"
            icon={
              <Avatar
                src={getHeroImage(hero, false)}
                sx={{
                  width: 24,
                  height: 24,
                }}
              />
            }
            text={hero}
            padding="2px"
            borderRadius="14px"
            dynamic
            colorKey={heroNameToNormalized(hero) as ColorKey}
          />
        </span>
      ))}
    </>
  );
}

const MapPlayerTable = () => {
  const {mapId, roundId} = useMapContext();
  const data = useDataNodes([
    new AlaSQLNode<{
      playerTeam: string;
      playerName: string;
      id: string;
      playerHeroes: string[];
      eliminations: number;
      finalBlows: number;
      deaths: number;
      objectiveKills: number;
      allDamageDealt: number;
      heroDamageDealt: number;
      barrierDamageDealt: number;
      healingDealt: number;
      damageBlocked: number;
      damageReceived: number;
      healingReceived: number;
      shotsFired: number;
      shotsHit: number;
      shotsMissed: number;
      criticalHits: number;
      offensiveAssists: number;
      defensiveAssists: number;
    }>(
      'MapPlayerTable_stats_' + mapId + '_' + roundId,
      'Player Stats',
      `SELECT
        player_stat.playerTeam,
        player_stat.playerName,
        player_stat.playerName + '_' + player_stat.playerTeam as id,
        ARRAY(player_stat.playerHero) as playerHeroes,
        SUM(player_stat.eliminations) as eliminations,
        SUM(player_stat.finalBlows) as finalBlows,
        SUM(player_stat.deaths) as deaths,
        SUM(player_stat.objectiveKills) as objectiveKills,
        FLOOR(SUM(player_stat.allDamageDealt)) as allDamageDealt,
        FLOOR(SUM(player_stat.heroDamageDealt)) as heroDamageDealt,
        FLOOR(SUM(player_stat.barrierDamageDealt)) as barrierDamageDealt,
        FLOOR(SUM(player_stat.healingDealt)) as healingDealt,
        FLOOR(SUM(player_stat.damageBlocked)) as damageBlocked,
        FLOOR(SUM(player_stat.damageReceived)) as damageReceived,
        FLOOR(SUM(player_stat.healingReceived)) as healingReceived,
        SUM(player_stat.shotsFired) as shotsFired,
        SUM(player_stat.shotsHit) as shotsHit,
        SUM(player_stat.shotsMissed) as shotsMissed,
        SUM(player_stat.criticalHits) as criticalHits,
        SUM(player_stat.offensiveAssists) as offensiveAssists,
        SUM(player_stat.defensiveAssists) as defensiveAssists
      FROM ? AS player_stat
      WHERE
        player_stat.mapId = ${mapId}
        ${
          roundId && roundId > 0
            ? `AND player_stat.roundNumber = ${roundId}`
            : ''
        }
      GROUP BY
        player_stat.playerTeam,
        player_stat.playerName,
        player_stat.playerName + '_' + player_stat.playerTeam
      ORDER BY
        player_stat.playerTeam,
        player_stat.playerName
      `,
      ['player_stat_object_store'],
      [
        'playerTeam',
        'playerName',
        'id',
        'playerHeroes',
        'eliminations',
        'finalBlows',
        'deaths',
        'objectiveKills',
        'allDamageDealt',
        'heroDamageDealt',
        'barrierDamageDealt',
        'healingDealt',
        'damageBlocked',
        'damageReceived',
        'healingReceived',
        'shotsFired',
        'shotsHit',
        'shotsMissed',
        'criticalHits',
        'offensiveAssists',
        'defensiveAssists',
      ],
    ),
    new AlaSQLNode<{
      duration: number;
    }>(
      'MapPlayerTable_map_duration_' + mapId + '_' + roundId,
      'Map Duration',
      `SELECT
        sum(round_end.matchTime - round_start.matchTime) as duration
      FROM
        ? AS round_start
        JOIN
        ? AS round_end
        ON
          round_start.mapId = round_end.mapId
          AND round_start.roundNumber = round_end.roundNumber
      WHERE
        round_start.mapId = ${mapId}
        ${
          roundId && roundId > 0
            ? `AND round_start.roundNumber = ${roundId}`
            : ''
        }
      `,
      ['round_start_object_store', 'round_end_object_store'],
      ['duration'],
    ),
    new AlaSQLNode<{
      team1Name: string;
      team2Name: string;
    }>(
      'MapPlayerTable_team_order_' + mapId,
      'Team Order',
      `SELECT
        match_start.team1Name,
        match_start.team2Name
      FROM ? AS match_start
      WHERE
        match_start.mapId = ${mapId}
      `,
      ['match_start_object_store'],
      ['team1Name', 'team2Name'],
    ),
  ]);

  const player_map_stats =
    data['MapPlayerTable_stats_' + mapId + '_' + roundId];
  const map_duration =
    data['MapPlayerTable_map_duration_' + mapId + '_' + roundId];
  const map_teams = data['MapPlayerTable_team_order_' + mapId];

  const [player_stats_timed, setPlayerStatsTimed] = React.useState<any[]>([]);

  useEffect(() => {
    if (!player_map_stats || !map_duration || !map_teams) {
      return;
    }

    // console.log('player_map_stats', player_map_stats);
    // console.log('map_duration', map_duration);

    const durationMins = map_duration[0].duration / 60;

    const player_stats_timed_ = player_map_stats.map((player: any) => {
      const role = getRoleFromHero(
        player.playerHeroes[player.playerHeroes.length - 1],
      );
      return {
        ...player,
        role: role,
        roleRank: getRankForRole(role),
        teamRank: player.playerTeam === map_teams[0].team1Name ? 1 : 2,
        colorKey:
          player.playerTeam === map_teams[0].team1Name ? 'team1' : 'team2',
        eliminationsPerTen: (player.eliminations / durationMins) * 10,
        finalBlowsPerTen: (player.finalBlows / durationMins) * 10,
        deathsPerTen: (player.deaths / durationMins) * 10,
        objectiveKillsPerTen: (player.objectiveKills / durationMins) * 10,
        allDamageDealtPerTen: Math.floor(
          (player.allDamageDealt / durationMins) * 10,
        ),
        heroDamageDealtPerTen: Math.floor(
          (player.heroDamageDealt / durationMins) * 10,
        ),
        barrierDamageDealtPerTen: Math.floor(
          (player.barrierDamageDealt / durationMins) * 10,
        ),
        healingDealtPerTen: Math.floor(
          (player.healingDealt / durationMins) * 10,
        ),
        damageBlockedPerTen: Math.floor(
          (player.damageBlocked / durationMins) * 10,
        ),
        damageReceivedPerTen: Math.floor(
          (player.damageReceived / durationMins) * 10,
        ),
        healingReceivedPerTen: Math.floor(
          (player.healingReceived / durationMins) * 10,
        ),
        accuracy:
          player.shotsFired > 0 ? player.shotsHit / player.shotsFired : 0,
        criticalHitRate:
          player.shotsFired > 0 ? player.criticalHits / player.shotsHit : 0,
      };
    });

    // // sort by roleRank, then by team
    // player_stats_timed_.sort((a: any, b: any) => {
    //   if (a.teamRank < b.teamRank) {
    //     return -1;
    //   }
    //   if (a.teamRank > b.teamRank) {
    //     return 1;
    //   }
    //   if (a.roleRank < b.roleRank) {
    //     return -1;
    //   }
    //   if (a.roleRank > b.roleRank) {
    //     return 1;
    //   }
    //   return 0;
    // });

    setPlayerStatsTimed(player_stats_timed_);
  }, [
    JSON.stringify(player_map_stats),
    JSON.stringify(map_duration),
    JSON.stringify(map_teams),
  ]);

  const [sortedData, setSortedData] = React.useState<any[]>([]);
  const [sortBy, setSortBy] = React.useState<string>('K');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    if (player_stats_timed.length === 0) {
      return;
    }

    const metric: PlayerStat | undefined = playerMetrics.find(
      (metric) => metric.abbreviation === sortBy,
    );

    if (!metric) {
      return;
    }

    console.error('sorting by', sortBy, sortOrder);

    const newData = [...player_stats_timed];

    newData.sort((a: any, b: any) => {
      const a_ = metric?.accessor(a, per10Mode);
      const b_ = metric?.accessor(b, per10Mode);

      if (typeof a_ === 'string' && typeof b_ === 'string') {
        return sortOrder === 'asc'
          ? a_.localeCompare(b_)
          : b_.localeCompare(a_);
      }

      if (typeof a_ === 'number' && typeof b_ === 'number') {
        return sortOrder === 'asc' ? a_ - b_ : b_ - a_;
      }

      return 0;
    });

    setSortedData(newData);
  }, [sortBy, sortOrder, JSON.stringify(player_stats_timed)]);

  const [per10Mode, setPer10Mode] = React.useState(false);
  const [smallHeader, setSmallHeader] = React.useState(false);

  const defaultFormatter = (value: string | number, player: any) => (
    <MetricCell
      metric={
        typeof value === 'string'
          ? value
          : value > 50
          ? Math.floor(value).toLocaleString()
          : Math.floor(value) == value
          ? value.toFixed(0)
          : value.toFixed(2)
      }
      colorKey={player.colorKey}
      alignedRight
    />
  );

  const playerMetrics: PlayerStat[] = [
    {
      name: 'Role',
      abbreviation: 'Role',
      description: 'The role of the player',
      alignRight: false,
      accessor: (player: any, per10Mode: boolean) =>
        getRankForRole(player.role),
      formatter: (value: string, player: any) => (
        <FormattedTableCell colorKey={player.colorKey}>
          <Typography
            sx={{
              fontSize: '1.5em',
              color: `${player.colorKey}.light`,
            }}>
            {getIcon(player.role)}
          </Typography>
        </FormattedTableCell>
      ),
    },
    {
      name: 'Team Name',
      abbreviation: 'Team',
      description: 'The team the player is on',
      alignRight: false,
      accessor: (player: any, per10Mode: boolean) => player.playerTeam,
      formatter: (value: string, player: any) => (
        <FormattedTableCell colorKey={player.colorKey}>
          <Typography variant="h6" sx={{color: `${player.colorKey}.light`}}>
            {value}
          </Typography>
        </FormattedTableCell>
      ),
    },
    {
      name: 'Player Name',
      abbreviation: 'Player',
      description: 'The name of the player',
      alignRight: false,
      accessor: (player: any, per10Mode: boolean) => player.playerName,
      formatter: (value: string, player: any) => (
        <FormattedTableCell colorKey={player.colorKey}>
          {/* <IconAndText
            icon={getIcon(player.role)}
            text={value}
            backgroundColor={getColorgorical(player.playerTeam)}
            textBorder={true}
          /> */}
          {value}
        </FormattedTableCell>
      ),
    },
    {
      name: 'Heroes Played',
      alignRight: false,
      abbreviation: 'Heroes',
      description: 'The heroes the player played this map',
      accessor: (player: any, per10Mode: boolean) => player.playerHeroes,
      formatter: (value: string, player: any) => (
        <FormattedTableCell colorKey={player.colorKey}>
          <div style={{display: 'flex', flexWrap: 'wrap'}}>
            <PlayerHeroesList playerHeroes={player.playerHeroes} />
          </div>
        </FormattedTableCell>
      ),
    },
    {
      name: 'Kills',
      abbreviation: 'K',
      description: 'The number of kills the player had this map',
      alignRight: true,
      accessor: (player: any, per10Mode: boolean) =>
        per10Mode ? player.finalBlowsPerTen : player.finalBlows,
      formatter: defaultFormatter,
    },
    {
      name: 'Eliminations',
      abbreviation: 'E',
      description: 'The number of eliminations the player had this map',
      alignRight: true,
      accessor: (player: any, per10Mode: boolean) =>
        per10Mode ? player.eliminationsPerTen : player.eliminations,
      formatter: defaultFormatter,
    },
    {
      name: 'Deaths',
      abbreviation: 'D',
      description: 'The number of deaths the player had this map',
      alignRight: true,
      accessor: (player: any, per10Mode: boolean) =>
        per10Mode ? player.deathsPerTen : player.deaths,
      formatter: defaultFormatter,
    },
    {
      name: 'Kill / Death Ratio',
      abbreviation: 'KDR',
      description: 'The ratio of kills to deaths the player had this map',
      alignRight: true,
      accessor: (player: any, per10Mode: boolean) =>
        player.deaths > 0
          ? player.finalBlows / player.deaths
          : player.finalBlows > 0
          ? '∞'
          : 0,
      formatter: defaultFormatter,
    },
    {
      name: 'Damage Dealt',
      abbreviation: 'DMG',
      description: 'The amount of damage the player dealt this map',
      alignRight: true,
      accessor: (player: any, per10Mode: boolean) =>
        per10Mode ? player.allDamageDealtPerTen : player.allDamageDealt,
      formatter: defaultFormatter,
    },
    {
      name: 'Healing Dealt',
      abbreviation: 'H',
      description: 'The amount of healing the player did this map',
      alignRight: true,
      accessor: (player: any, per10Mode: boolean) =>
        per10Mode ? player.healingDealtPerTen : player.healingDealt,
      formatter: defaultFormatter,
    },
    {
      name: 'Damage Mitigated',
      abbreviation: 'MIT',
      description: 'The amount of damage the player blocked this map',
      alignRight: true,
      accessor: (player: any, per10Mode: boolean) =>
        per10Mode ? player.damageBlockedPerTen : player.damageBlocked,
      formatter: defaultFormatter,
    },
    {
      name: 'Assists',
      abbreviation: 'A',
      description: 'The number of assists the player had this map',
      alignRight: true,
      accessor: (player: any, per10Mode: boolean) =>
        player.offensiveAssists + player.defensiveAssists,
      formatter: defaultFormatter,
    },
    {
      name: 'Offensive Assists',
      abbreviation: 'OA',
      description: 'The number of assists the player had this map',
      alignRight: true,
      accessor: (player: any, per10Mode: boolean) => player.offensiveAssists,
      formatter: defaultFormatter,
    },
    {
      name: 'Defensive Assists',
      abbreviation: 'DA',
      description: 'The number of assists the player had this map',
      alignRight: true,
      accessor: (player: any, per10Mode: boolean) => player.defensiveAssists,
      formatter: defaultFormatter,
    },

    {
      name: 'Accuracy',
      abbreviation: 'Acc',
      description: 'Shots hit / shots fired',
      alignRight: true,
      accessor: (player: any, per10Mode: boolean) =>
        player.shotsFired > 0 ? (player.shotsHit / player.shotsFired) * 100 : 0,
      formatter: (value: string | number, player: any) => (
        <MetricCell
          metric={(value as number).toFixed(0) + '%'}
          submetric={player.shotsHit}
          submetricDesc="hits"
          alignedRight
          colorKey={player.colorKey}
        />
      ),
    },

    {
      name: 'Critical Hit Rate',
      abbreviation: 'CR',
      description: 'Critical hits / shots hit',
      alignRight: true,
      accessor: (player: any, per10Mode: boolean) =>
        player.shotsHit > 0 ? (player.criticalHits / player.shotsHit) * 100 : 0,
      formatter: (value: string | number, player: any) => (
        <MetricCell
          metric={(value as number).toFixed(0) + '%'}
          submetric={player.criticalHits}
          submetricDesc="crits"
          alignedRight
          colorKey={player.colorKey}
        />
      ),
    },
  ];

  const defaultMetrics = [
    'Role',
    'Team',
    'Player',
    'Heroes',
    'K',
    'E',
    'D',
    'DMG',
    'H',
    'MIT',
  ];

  const [enabledMetrics, setEnabledMetrics] =
    React.useState<string[]>(defaultMetrics);

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  return (
    <Paper
      sx={{
        padding: '1em',
        paddingTop: '1.5em',
      }}>
      <Grid container>
        <Grid item xs={11}>
          <Typography variant="h4" sx={{color: 'info.main'}}>
            Player Stats
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Button
            color="secondary"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{float: 'right'}}>
            <TuneIcon />
          </Button>
        </Grid>
      </Grid>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{fontWeight: 'bold'}}>
              {playerMetrics
                .filter((metric) =>
                  enabledMetrics.includes(metric.abbreviation),
                )
                .map((metric) => (
                  <TableCell
                    key={metric.name}
                    sx={{
                      textAlign: metric.alignRight ? 'right' : 'left',
                      borderLeft: 'none',
                      borderRight: 'none',
                      borderTop: 'none',
                      borderBottomColor: 'info.dark',
                    }}>
                    <Button
                      variant="text"
                      color="info"
                      sx={{
                        // backgroundColor: 'transparent',
                        // border: 'none',
                        // color: 'inherit',
                        ...(metric.alignRight
                          ? {justifyContent: 'right'}
                          : {justifyContent: 'left'}),
                        ...(sortBy === metric.abbreviation
                          ? {fontWeight: 'bold'}
                          : {}),
                      }}
                      startIcon={
                        sortBy === metric.abbreviation && metric.alignRight ? (
                          sortOrder === 'asc' ? (
                            <ArrowDropUpIcon />
                          ) : (
                            <ArrowDropDownIcon />
                          )
                        ) : undefined
                      }
                      endIcon={
                        sortBy === metric.abbreviation && !metric.alignRight ? (
                          sortOrder === 'asc' ? (
                            <ArrowDropUpIcon />
                          ) : (
                            <ArrowDropDownIcon />
                          )
                        ) : undefined
                      }
                      onClick={() => {
                        if (sortBy === metric.abbreviation) {
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortBy(metric.abbreviation);
                          setSortOrder('desc');
                        }
                      }}>
                      <Typography variant="h5">
                        {smallHeader ? metric.abbreviation : metric.name}
                      </Typography>
                    </Button>
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((player: any) => (
              <TableRow key={player.id}>
                {playerMetrics
                  .filter((metric) =>
                    enabledMetrics.includes(metric.abbreviation),
                  )
                  .map((metric) =>
                    metric.formatter(
                      metric.accessor(player, per10Mode),
                      player,
                    ),
                  )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}>
        <Paper
          sx={{
            padding: '1em',
            border: 1,
            borderRadius: '10px',
            borderColor: 'secondary.main',
          }}>
          <Typography
            variant="h6"
            sx={{marginBottom: '1em', color: 'info.main'}}>
            Select Metrics
          </Typography>
          <Grid container sx={{maxWidth: '750px', marginBottom: '1em'}}>
            {playerMetrics.map((metric) => (
              <Grid item key={metric.name} xs={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={enabledMetrics.includes(metric.abbreviation)}
                      onChange={() =>
                        setEnabledMetrics((prev) =>
                          prev.includes(metric.abbreviation)
                            ? prev.filter((m) => m !== metric.abbreviation)
                            : [...prev, metric.abbreviation],
                        )
                      }
                    />
                  }
                  label={
                    <Typography variant="caption">
                      {smallHeader ? metric.abbreviation : metric.name}
                    </Typography>
                  }
                  labelPlacement="top"
                  sx={{
                    // color: 'info.main',
                    fontSize: '0.8em',
                    margin: 0,
                    padding: 0,
                  }}
                />
              </Grid>
            ))}
          </Grid>

          <Button
            variant="contained"
            sx={{marginRight: '2em'}}
            onClick={() => setEnabledMetrics(defaultMetrics)}>
            Reset Metrics
          </Button>

          <FormControlLabel
            control={
              <Switch
                checked={per10Mode}
                onChange={() => setPer10Mode(!per10Mode)}
              />
            }
            label={
              <Typography variant="caption" color="info">
                Show averages per 10 minutes
              </Typography>
            }
          />
          <FormControlLabel
            control={
              <Switch
                checked={smallHeader}
                onChange={() => setSmallHeader(!smallHeader)}
              />
            }
            label={
              <Typography variant="caption" color="info">
                Condense header
              </Typography>
            }
          />
        </Paper>
      </Popover>
    </Paper>
  );
};

export default MapPlayerTable;

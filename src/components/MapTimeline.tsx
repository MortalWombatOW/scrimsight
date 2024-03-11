/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';

import {Grid, Paper} from '@mui/material';
import {getColorForHero, getColorgorical} from '../lib/color';
import {getSvgIcon} from './Common/RoleIcons';
import {heroNameToNormalized} from '../lib/string';
import usePlayerLives from '../hooks/data/usePlayerLives';
import useMapTimes from '../hooks/data/useMapTimes';
import useMapRosters from '../hooks/data/useMapRosters';
import useGlobalMapEvents from '../hooks/data/useGlobalMapEvents';
import usePlayerEvents, {PlayerEvents} from '../hooks/data/usePlayerEvents';
import {formatTime} from '../lib/format';
import useLegibleTextSvg from '../hooks/useLegibleTextSvg';
import useTeamfights from '../hooks/data/useTeamfights';
import useUltimateTimes from '../hooks/data/useUltimateTimes';
import {getHeroImage} from '../lib/data/data';
import SvgArcBetween from './SvgArcBetween';
import SvgWrapText from './SvgWrapText';
import TimelineControls from './TimelineControls';

const MapTimeline = ({mapId, roundId}: {mapId: number; roundId: number}) => {
  const mapEvents = useGlobalMapEvents(mapId);

  // holds the players for columns
  const [players, setPlayers] = useState<
    {
      playerName: string;
      playerTeam: string;
      role: string;
    }[]
  >([]);

  const roster = useMapRosters(mapId);

  // console.log('roster', roster);

  useEffect(() => {
    if (!roster) {
      return;
    }

    const reversedTeam1 = roster.team1.roster.map(
      (_, i) => roster.team1.roster[roster.team1.roster.length - 1 - i],
    );

    const players = [
      ...reversedTeam1.map((player) => ({
        playerName: player.name,
        playerTeam: roster.team1.name,
        role: player.role,
      })),
      ...roster.team2.roster.map((player) => ({
        playerName: player.name,
        playerTeam: roster.team2.name,
        role: player.role,
      })),
    ];

    setPlayers(players);
  }, [JSON.stringify(roster)]);

  const ref = React.useRef<SVGSVGElement | null>(null);
  const [width, setWidth] = useState(1000);

  useEffect(() => {
    if (ref.current) {
      setWidth(ref.current.clientWidth);
    }
  }, [JSON.stringify(players)]);

  const {startTime, endTime} = useMapTimes(mapId)?.[roundId] || {
    startTime: null,
    endTime: null,
  };
  const [pixelsPerSecond, setPixelsPerSecond] = useState(5);
  // const height = (endTime - startTime) * pixelsPerSecond;
  const height = 900;

  const xPadding = 50;
  const topPadding = 10;
  const bottomPadding = 50;
  const axisWidth = 75;
  const [majorTickInterval, minorTickInterval] = [60, 10];

  const [startTimeFilter, setStartTimeFilter] = useState(0);
  const [endTimeFilter, setEndTimeFilter] = useState(9999);
  const numMajorTicks = Math.floor(
    (endTimeFilter - startTimeFilter) / majorTickInterval,
  );
  const numMinorTicks = Math.floor(
    (endTimeFilter - startTimeFilter) / minorTickInterval,
  );
  const timeToY = (time: number) => {
    return Math.floor(
      ((Math.max(Math.min(time, endTimeFilter), startTimeFilter) -
        startTimeFilter) /
        (endTimeFilter - startTimeFilter)) *
        (height - topPadding - bottomPadding) +
        topPadding,
    );
  };
  const columnIdxToX = (idx: number) => {
    return Math.floor(
      ((idx + 1) / (players.length + 1)) * (width - 2 * xPadding - axisWidth) +
        xPadding +
        axisWidth,
    );
  };

  const playerLives = usePlayerLives(mapId, roundId);
  const playerEvents: PlayerEvents | null = usePlayerEvents(mapId);
  const ultTimes = useUltimateTimes(mapId);

  // console.log('ultTimes', ultTimes);

  const loaded =
    !!players && !!mapEvents && !!playerLives && !!playerEvents && !!ultTimes;

  // console.log('loaded', loaded);

  const teamfights = useTeamfights(mapId);

  // console.log('teamfights', teamfights);

  useEffect(() => {
    if (startTime === null || endTime === null) {
      return;
    }
    if (endTimeFilter > endTime) {
      setEndTimeFilter(endTime);
    }
    if (startTimeFilter < startTime) {
      setStartTimeFilter(startTime);
    }
    if (startTimeFilter > endTimeFilter) {
      setStartTimeFilter(endTimeFilter);
    }
  }, [endTime, startTime, endTimeFilter, startTimeFilter]);

  useEffect(() => {
    if (startTime === null) {
      return;
    }

    setStartTimeFilter(startTime);
    setEndTimeFilter(startTime + 60 * 3);
  }, [startTime]);

  const eventFilter = (event: any) => {
    if (startTimeFilter > endTimeFilter) {
      return false;
    }
    return (
      event.matchTime >= startTimeFilter && event.matchTime <= endTimeFilter
    );
  };

  const iters = useLegibleTextSvg(ref, [
    loaded,
    startTimeFilter,
    endTimeFilter,
  ]);
  // console.log('iters', iters);

  const [ticksPerSecond, setTicksPerSecond] = useState(1);
  const [ticksPerFrame, setTicksPerFrame] = useState(5);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    console.log('playing', playing);
    if (
      playing &&
      startTimeFilter !== null &&
      endTimeFilter !== null &&
      startTime !== null &&
      endTime
    ) {
      console.log('playing', playing);
      const interval = setInterval(() => {
        setStartTimeFilter((time) => {
          if (time === null) {
            return startTimeFilter;
          }

          return time + ticksPerFrame;
        });
        setEndTimeFilter((time) => {
          if (time === null) {
            return endTimeFilter;
          }
          if (time >= endTime) {
            setPlaying(false);
            return endTime;
          }
          console.log('time', time);
          return time + ticksPerFrame;
        });
      }, 1000 / ticksPerSecond);
      return () => clearInterval(interval);
    }
  }, [playing, startTimeFilter, endTimeFilter, ticksPerSecond]);

  return (
    <Paper sx={{padding: '1em', borderRadius: '5px', marginTop: '1em'}}>
      <Grid container spacing={2}>
        <Grid item xs={1}>
          <TimelineControls
            startTime={startTime}
            endTime={endTime}
            ticksPerFrame={ticksPerFrame}
            setTicksPerFrame={setTicksPerFrame}
            startTimeFilter={startTimeFilter}
            setStartTimeFilter={setStartTimeFilter}
            endTimeFilter={endTimeFilter}
            setEndTimeFilter={setEndTimeFilter}
            loaded={loaded}
            playing={playing}
            setPlaying={setPlaying}
            kills={
              Object.values(playerEvents || {})
                .flat()
                .filter((e) => e.eventType === 'kill') || []
            }
          />
        </Grid>
        <Grid item xs={11}>
          <svg width="100%" height={100}>
            <defs>
              <linearGradient id="grad1" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="25%" stopColor="#7deefd" />
                <stop offset="50%" stopColor="white" />
                <stop offset="75%" stopColor="#7deefd" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>

            {players.map((player: any, i: number) => (
              <g key={player.playerName}>
                {getSvgIcon(player.role, columnIdxToX(i), 25)}
                <text
                  x={columnIdxToX(i)}
                  y={50}
                  textAnchor="middle"
                  fill="white"
                  data-x={columnIdxToX(i)}
                  data-y={50}>
                  {player.playerName}
                </text>
                <text
                  x={columnIdxToX(i)}
                  y={67}
                  textAnchor="middle"
                  fill={getColorgorical(player.playerTeam)}
                  fontSize={10}
                  data-x={columnIdxToX(i)}
                  data-y={67}>
                  {player.playerTeam}
                </text>
              </g>
            ))}
          </svg>
          <div
            style={{
              height: 1000,
              overflowY: 'auto',
              overflowX: 'hidden',
            }}>
            <svg
              width="100%"
              height={height}
              ref={ref}
              viewBox={`0 0 ${width} ${height}`}>
              <line
                x1={xPadding + axisWidth}
                y1={topPadding}
                x2={xPadding + axisWidth}
                y2={height - bottomPadding}
                style={{
                  stroke: '#cccccc',
                }}
              />
              {Array.from({length: numMajorTicks + 1}).map((_, i) => {
                const time = startTimeFilter + i * majorTickInterval;
                return (
                  <g key={time}>
                    <line
                      x1={xPadding + axisWidth - 5}
                      y1={timeToY(time)}
                      x2={xPadding + axisWidth + 5}
                      y2={timeToY(time)}
                      style={{
                        stroke: '#cccccc',
                      }}
                    />
                    <SvgWrapText
                      x={xPadding + axisWidth - 10}
                      y={timeToY(time)}
                      color="white"
                      size={10}>
                      {formatTime(time)}
                    </SvgWrapText>
                  </g>
                );
              })}
              {Array.from({length: numMinorTicks + 1}).map((_, i) => {
                const time = startTimeFilter + i * minorTickInterval;
                return (
                  <g key={time}>
                    <line
                      x1={xPadding + axisWidth - 2.5}
                      y1={timeToY(time)}
                      x2={xPadding + axisWidth + 2.5}
                      y2={timeToY(time)}
                      style={{
                        stroke: '#cccccc',
                      }}
                    />
                  </g>
                );
              })}
              {teamfights &&
                teamfights
                  .filter((teamfight: any) => {
                    return (
                      teamfight.start >= startTimeFilter &&
                      teamfight.end <= endTimeFilter
                    );
                  })

                  .map((teamfight: any, i: number) => (
                    <g key={teamfight.start + teamfight.end + i}>
                      <rect
                        x={0}
                        y={timeToY(teamfight.start) - 5}
                        width={xPadding + axisWidth}
                        height={
                          timeToY(teamfight.end) - timeToY(teamfight.start) + 10
                        }
                        fill={getColorgorical(teamfight.winningTeam)}
                        fillOpacity={0.2}
                      />

                      <text
                        x={xPadding + axisWidth - 5}
                        y={timeToY(teamfight.start)}
                        textAnchor="end"
                        fill={getColorgorical(teamfight.winningTeam)}
                        fontSize={10}
                        dy={3}
                        data-x={xPadding + axisWidth - 5}
                        data-y={timeToY(teamfight.start)}>
                        {formatTime(teamfight.start)}
                      </text>
                      <text
                        x={xPadding + axisWidth - 5}
                        y={timeToY(teamfight.end)}
                        textAnchor="end"
                        fill={getColorgorical(teamfight.winningTeam)}
                        fontSize={10}
                        dy={3}
                        data-x={xPadding + axisWidth - 5}
                        data-y={timeToY(teamfight.end)}>
                        {formatTime(teamfight.end)}
                      </text>
                      <SvgWrapText
                        x={10}
                        y={timeToY((teamfight.start + teamfight.end) / 2)}
                        color={getColorgorical(teamfight.winningTeam)}
                        size={10}>
                        Teamfight {i + 1} - {teamfight.winningTeam} win
                      </SvgWrapText>
                    </g>
                  ))}
              {mapEvents &&
                mapEvents.filter(eventFilter).map((event: any, i: number) => (
                  <g key={event.matchTime + event.eventMessage + i}>
                    <line
                      x1={xPadding + axisWidth - 5}
                      y1={timeToY(event.matchTime)}
                      x2={xPadding + axisWidth + 5}
                      y2={timeToY(event.matchTime)}
                      style={{
                        stroke: 'white',
                        // strokeDasharray: '5,5',
                      }}
                    />
                    <SvgWrapText
                      x={10}
                      y={timeToY(event.matchTime)}
                      color="white"
                      size={10}>
                      {event.eventMessage}
                    </SvgWrapText>
                  </g>
                ))}
              {players.map((player: any, i: number) => (
                <g key={player.playerName}>
                  {ultTimes
                    ?.filter(
                      (ult: any) =>
                        ult.usedTime >= startTimeFilter &&
                        ult.chargedTime <= endTimeFilter,
                    )
                    ?.filter((ult: any) => ult.playerName === player.playerName)
                    .map((ult: any, j: number) => (
                      <rect
                        key={`${ult.playerName}_${ult.chargedTime}_${j}`}
                        x={columnIdxToX(i) - 4}
                        y={timeToY(ult.chargedTime)}
                        width={8}
                        height={
                          timeToY(ult.usedTime) - timeToY(ult.chargedTime)
                        }
                        fill="url(#grad1)"
                      />
                    ))}
                  {playerLives[player.playerName] &&
                    playerLives[player.playerName]
                      .filter(
                        (life: any) =>
                          life.endTime >= startTimeFilter &&
                          life.startTime <= endTimeFilter,
                      )
                      .map((life: any) => (
                        <g key={`${life.playerName}_${life.startTime}`}>
                          <circle
                            cx={columnIdxToX(i)}
                            cy={timeToY(life.startTime)}
                            r={16}
                            fill={getColorForHero(
                              heroNameToNormalized(life.playerHero),
                            )}
                          />

                          {life.startMessage && (
                            <SvgWrapText
                              x={columnIdxToX(i) + 20}
                              y={timeToY(life.startTime)}
                              color={getColorForHero(
                                heroNameToNormalized(life.playerHero),
                              )}
                              size={10}>
                              {life.startMessage}
                            </SvgWrapText>
                          )}
                          {life.violentEnd ? (
                            <>
                              <line
                                x1={columnIdxToX(i) - 5}
                                y1={timeToY(life.endTime) - 5}
                                x2={columnIdxToX(i) + 5}
                                y2={timeToY(life.endTime) + 5}
                                style={{
                                  stroke: getColorForHero(
                                    heroNameToNormalized(life.playerHero),
                                  ),
                                }}
                              />
                              <line
                                x1={columnIdxToX(i) + 5}
                                y1={timeToY(life.endTime) - 5}
                                x2={columnIdxToX(i) - 5}
                                y2={timeToY(life.endTime) + 5}
                                style={{
                                  stroke: getColorForHero(
                                    heroNameToNormalized(life.playerHero),
                                  ),
                                }}
                              />
                            </>
                          ) : (
                            <line
                              x1={columnIdxToX(i) - 2}
                              y1={timeToY(life.endTime)}
                              x2={columnIdxToX(i) + 2}
                              y2={timeToY(life.endTime)}
                              style={{
                                stroke: getColorForHero(
                                  heroNameToNormalized(life.playerHero),
                                ),
                              }}
                            />
                          )}
                          {life.endMessage && (
                            <SvgWrapText
                              x={columnIdxToX(i) + 7}
                              y={timeToY(life.endTime)}
                              color={getColorForHero(
                                heroNameToNormalized(life.playerHero),
                              )}
                              size={10}>
                              {life.endMessage}
                            </SvgWrapText>
                          )}
                          <line
                            x1={columnIdxToX(i)}
                            y1={timeToY(life.startTime)}
                            x2={columnIdxToX(i)}
                            y2={timeToY(life.endTime)}
                            style={{
                              stroke: getColorForHero(
                                heroNameToNormalized(life.playerHero),
                              ),
                            }}
                          />
                          <image
                            clipPath="inset(0% round 15px)"
                            x={columnIdxToX(i) - 15}
                            y={timeToY(life.startTime) - 15}
                            width={30}
                            height={30}
                            href={getHeroImage(life.playerHero)}
                          />
                        </g>
                      ))}

                  {playerEvents?.[player.playerName] &&
                    playerEvents[player.playerName]
                      .filter(eventFilter)
                      .map((event: any, j: number) => {
                        return (
                          <g
                            key={`${event.eventMessage}_${event.matchTime}_${j}`}>
                            <circle
                              cx={columnIdxToX(i)}
                              cy={timeToY(event.matchTime)}
                              r={5}
                              fill={
                                event.eventType === 'kill'
                                  ? getColorgorical(player.playerTeam)
                                  : 'transparent'
                              }
                              stroke={getColorgorical(player.playerTeam)}
                            />
                            {event.targetPlayer && (
                              <SvgArcBetween
                                x1={columnIdxToX(i)}
                                y1={timeToY(event.matchTime)}
                                x2={columnIdxToX(
                                  players.findIndex(
                                    (p) => p.playerName === event.targetPlayer,
                                  ),
                                )}
                                y2={timeToY(event.matchTime)}
                                color={getColorgorical(player.playerTeam)}
                                width={2}
                              />
                            )}
                            {event.eventMessage && (
                              <SvgWrapText
                                x={columnIdxToX(i) + 7}
                                y={timeToY(event.matchTime)}
                                color={'white'}
                                size={10}>
                                {event.eventMessage}
                              </SvgWrapText>
                            )}
                          </g>
                        );
                      })}
                </g>
              ))}
            </svg>
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default MapTimeline;

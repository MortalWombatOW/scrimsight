/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {useDataNodes} from '../hooks/useData';
import {AlaSQLNode} from '../WombatDataFramework/DataTypes';
import {Grid, Paper, Typography} from '@mui/material';
import {getColorgorical} from '../lib/color';
import useTeamfights from '../hooks/data/useTeamfights';
import useMapTimes from '../hooks/data/useMapTimes';
import useLegibleTextSvg from '../hooks/useLegibleTextSvg';

const getElementWidth = (element: SVGSVGElement) => {
  const rect = element.getBoundingClientRect();
  return rect.width;
};

type BBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const generateRoundBBoxes = (totalWidth: number, roundWinners: string[]) => {
  // calculate the width of each round
  const roundWidth = Math.floor(totalWidth / roundWinners.length);

  // map each roundWinner to its respective bounding box
  const roundBBoxes = roundWinners.map((_, i) => ({
    x: roundWidth * i,
    y: 100, // constant y value
    width: roundWidth,
    height: 100, // constant height value
  }));

  return roundBBoxes;
};

const generateTeamfightBBoxesForRound = (
  roundBBox: BBox,
  teamfightWinners: string[],
): BBox[] => {
  const tfWidth = roundBBox.width / teamfightWinners.length;

  return teamfightWinners.map((_, i) => ({
    x: roundBBox.x + tfWidth * i,
    y: 200,
    width: tfWidth,
    height: 100,
  }));
};

const MapScorecard = ({mapId}: {mapId: number}) => {
  const data = useDataNodes([
    new AlaSQLNode(
      'map_scorecard_' + mapId,
      `SELECT
        match_start.team1Name,
        match_start.team2Name,
        match_start.mapName,
        match_start.mapType,
        match_end.team1Score,
        match_end.team2Score,
        IF(match_end.team1Score > match_end.team2Score, match_start.team1Name, match_start.team2Name) as winner
      FROM ? AS match_start
      JOIN
      ? AS match_end
      ON
        match_start.mapId = match_end.mapId
      WHERE
        match_start.mapId = ${mapId}
      `,
      ['match_start_object_store', 'match_end_object_store'],
    ),
    new AlaSQLNode(
      'MapScorecard_round_results_' + mapId,
      `SELECT
        round_end.team1Score,
        round_end.team2Score,
        round_end.roundNumber
      FROM ? AS round_end
      WHERE
        round_end.mapId = ${mapId}
      `,
      ['round_end_object_store'],
    ),
  ]);

  const map_scorecard = data['map_scorecard_' + mapId];
  const round_results = data['MapScorecard_round_results_' + mapId];

  const teamfights = useTeamfights(mapId);
  const mapTimes = useMapTimes(mapId);

  const [roundWinners, setRoundWinners] = React.useState<string[]>([]);
  const [teamfightWinners, setTeamfightWinners] = React.useState<
    {
      roundNumber: number;
      winner: string;
    }[]
  >([]);

  React.useEffect(() => {
    if (!round_results || !map_scorecard) return;

    const team1Name = map_scorecard[0].team1Name;
    const team2Name = map_scorecard[0].team2Name;

    const prevScore = {
      team1: 0,
      team2: 0,
    };
    const roundWinners_: string[] = [];
    for (const round of round_results) {
      const team1Score = round.team1Score;
      const team2Score = round.team2Score;
      if (team1Score > prevScore.team1) {
        roundWinners_.push(team1Name);
      } else if (team2Score > prevScore.team2) {
        roundWinners_.push(team2Name);
      }
      prevScore.team1 = team1Score;
      prevScore.team2 = team2Score;
    }

    setRoundWinners(roundWinners_);
  }, [JSON.stringify(round_results), JSON.stringify(map_scorecard)]);

  React.useEffect(() => {
    if (!teamfights || !mapTimes) {
      console.error('returning', teamfights, mapTimes);
      return;
    }
    console.error('not returning', teamfights, mapTimes);
    // set the round id for each teamfight as the round containing the teamfight start time
    const teamfightWinners_ = teamfights.map((tf: any) => {
      const roundNumber =
        mapTimes
          .slice(1)
          .findIndex(
            (mt) => mt.startTime <= tf.start && tf.start <= mt.endTime,
          ) + 1;
      return {
        roundNumber,
        winner: tf.winningTeam,
      };
    });
    setTeamfightWinners(teamfightWinners_);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(teamfights), JSON.stringify(mapTimes)]);

  const mapInfo = map_scorecard?.[0];

  const team1Color = getColorgorical(mapInfo?.team1Name);
  const team2Color = getColorgorical(mapInfo?.team2Name);
  const winnerColor = getColorgorical(mapInfo?.winner);

  const ref = React.useRef<SVGSVGElement | null>(null);
  const [roundBBoxes, setRoundBBoxes] = React.useState<BBox[] | null>(null);
  const [tfBBoxes, setTFBBoxes] = React.useState<{
    [key: number]: BBox[];
  } | null>(null);
  const [width, setWidth] = React.useState<number | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const svg = ref.current;
    const totalWidth = getElementWidth(svg);
    setWidth(totalWidth);
    console.error('totalWidth', totalWidth);
    console.error('roundWinners', roundWinners);

    const roundBBoxes = generateRoundBBoxes(totalWidth, roundWinners);
    const tfBBoxes = roundBBoxes.map((roundBBox, i) => {
      const teamfightWinnersForRound = teamfightWinners.filter(
        (tf) => tf.roundNumber === i + 1,
      );
      return generateTeamfightBBoxesForRound(
        roundBBox,
        teamfightWinnersForRound.map((tf) => tf.winner),
      );
    });

    console.log('roundBBoxes', roundBBoxes);
    console.log('tfBBoxes', tfBBoxes);
    setRoundBBoxes(roundBBoxes);
    const tfBBoxes_ = {};
    tfBBoxes.forEach((tfBBox, i) => {
      tfBBoxes_[i + 1] = tfBBox;
    });
    setTFBBoxes(tfBBoxes_);
  }, [
    JSON.stringify(roundWinners),
    JSON.stringify(teamfightWinners),
    ref,
    ref.current,
  ]);

  return (
    <Paper sx={{padding: '1em', borderColor: winnerColor}}>
      <Typography variant="h2">{mapInfo?.mapName}</Typography>
      <Typography variant="h5">{mapInfo?.mapType}</Typography>
      <Typography variant="h3">
        <span style={{color: team1Color}}>{mapInfo?.team1Name}</span>{' '}
        {mapInfo?.team1Score} -{'  '}
        {mapInfo?.team2Score}{' '}
        <span style={{color: team2Color}}>{mapInfo?.team2Name}</span>
      </Typography>

      <svg
        width="100%"
        height="300"
        ref={ref}
        viewBox={`0 0 ${width || 100} 300`}>
        <g>
          <text
            x="50%"
            y="40"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={winnerColor}
            fontSize={20}>
            {mapInfo?.winner}
          </text>
          <text
            x="50%"
            y="60"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize={15}>
            Map Winner
          </text>
        </g>
        <g>
          {roundWinners &&
            roundBBoxes &&
            roundBBoxes.length > 0 &&
            roundWinners?.map((winner, i) => {
              const roundNumber = i + 1;
              const roundBBox = roundBBoxes[i];
              return (
                <g key={i}>
                  <text
                    x={roundBBox.x + roundBBox.width / 2}
                    y={roundBBox.y + roundBBox.height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={getColorgorical(winner)}
                    fontSize={18}>
                    {winner}
                  </text>
                  <text
                    x={roundBBox.x + roundBBox.width / 2}
                    y={roundBBox.y + roundBBox.height / 2 + 20}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={'white'}
                    fontSize={12}>
                    Round {roundNumber} Winner
                  </text>
                </g>
              );
            })}
        </g>

        <g>
          {tfBBoxes &&
            Object.keys(tfBBoxes).map((roundNumber) => {
              const tfBBox = tfBBoxes[roundNumber];
              return tfBBox.map((tf, i) => {
                return (
                  <g key={i}>
                    <text
                      x={tf.x + tf.width / 2}
                      y={tf.y + tf.height / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={getColorgorical(teamfightWinners[i].winner)}
                      fontSize={12}>
                      {teamfightWinners[i].winner}
                    </text>
                    <text
                      x={tf.x + tf.width / 2}
                      y={tf.y + tf.height / 2 + 20}
                      textAnchor="middle"
                      fill={'white'}
                      dominantBaseline="middle"
                      fontSize={10}>
                      TF {i + 1}
                    </text>
                  </g>
                );
              });
            })}
        </g>
      </svg>
    </Paper>
  );
};

export default MapScorecard;

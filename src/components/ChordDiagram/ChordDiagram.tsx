import React, { useState, useRef } from 'react';
import { useWombatData } from 'wombat-data-framework';
import { getColorgorical } from '../../lib/color';
import { MatchData } from '../../WombatDataFrameworkSchema';
import { PathTooltip } from 'react-path-tooltip';
import { Container } from '@mui/material';
import { PlayerInteractionEvent } from '../MapTimeline/types/timeline.types';
import { useWidgetRegistry } from '~/WidgetProvider';

interface ChordDataEntry {
  sourcePlayerName: string;
  sourceTeamName: string;
  targetPlayerName: string;
  value: number;
}

const transformDataToChordFormat = (data: PlayerInteractionEvent[]): ChordDataEntry[] => {
  const interactions: {
    [key: string]: ChordDataEntry;
  } = {};

  const kills = data.filter((row) => row.playerInteractionEventType === 'Killed player');

  kills.forEach((row) => {
    const sourcePlayer = row.playerName;
    const targetPlayer = row.otherPlayerName;
    const interactionKey = `${sourcePlayer}-${targetPlayer}`;
    if (sourcePlayer === targetPlayer) {
      return;
    }
    if (!interactions[interactionKey]) {
      interactions[interactionKey] = {
        sourcePlayerName: sourcePlayer,
        sourceTeamName: row.playerTeam,
        targetPlayerName: targetPlayer,
        value: 0,
      };
    }
    interactions[interactionKey].value += 1;
  });

  const transformedData: ChordDataEntry[] = Array.from(Object.values(interactions));

  return transformedData;
};

const getArcPath = (sourceStartAngle: number, sourceEndAngle: number, targetStartAngle: number, targetEndAngle: number, innerRadius: number, getCoords: (angle: number, radius: number) => { x: number; y: number }) => {
  const { x: sourceStartX, y: sourceStartY } = getCoords(sourceStartAngle, innerRadius);
  const { x: sourceEndX, y: sourceEndY } = getCoords(sourceEndAngle, innerRadius);
  const { x: targetStartX, y: targetStartY } = getCoords(targetStartAngle, innerRadius);
  const { x: targetEndX, y: targetEndY } = getCoords(targetEndAngle, innerRadius);

  const averageAngle = (sourceStartAngle + sourceEndAngle + targetStartAngle + targetEndAngle) / 4;

  const { x: sourceEndToTargetStartControlPointX, y: sourceEndToTargetStartControlPointY } = getCoords(averageAngle, innerRadius / 6);
  const { x: targetStartToTargetEndControlPointX, y: targetStartToTargetEndControlPointY } = getCoords(averageAngle, innerRadius / 6);

  let path = '';
  // path components
  // 1. start at the source start point
  path += `M${sourceStartX},${sourceStartY}`;
  // // 2. draw a line to the source arrow point and then a line to the source end point
  // path += ` L${sourceArrowX},${sourceArrowY} L${sourceEndX},${sourceEndY}`;
  // 2. draw an arc to the source end point
  path += ` A${innerRadius},${innerRadius} 0 0,1 ${sourceEndX},${sourceEndY}`;
  // 3. draw a quadratic curve to the target start point
  path += ` Q${sourceEndToTargetStartControlPointX},${sourceEndToTargetStartControlPointY} ${targetStartX},${targetStartY}`;
  // // 4. draw an line to the target arrow point and then a line to the target end point
  // path += ` L${targetArrowX},${targetArrowY} L${targetEndX},${targetEndY}`;
  // 4. draw an arc to the target end point
  path += ` A${innerRadius},${innerRadius} 0 0,1 ${targetEndX},${targetEndY}`;
  // 5. draw a quadratic curve back to the source start point
  path += ` Q${targetStartToTargetEndControlPointX},${targetStartToTargetEndControlPointY} ${sourceStartX},${sourceStartY}`;

  return path;
};

const PlayerArc: React.FC<{
  playerName: string;
  playerTeam: string;
  otherTeam: string;
  innerRadius: number;
  killsStartAngle: number;
  killsEndAngle: number;
  deathsStartAngle: number;
  deathsEndAngle: number;
  handleArcHover: (event: React.MouseEvent<SVGPathElement>) => void;
  handleArcLeave: (event: React.MouseEvent<SVGPathElement>) => void;
  isHovering: boolean;
  isInteractionHovering: boolean;
  hoveredSource: string | null;
  hoveredTarget: string | null;
  svgRef: React.RefObject<SVGSVGElement>;
  totalKills: number;
  totalDeaths: number;
  getCoords: (angle: number, radius: number) => { x: number; y: number };
}> = ({
  playerName,
  playerTeam,
  otherTeam,
  innerRadius,
  killsStartAngle,
  killsEndAngle,
  deathsStartAngle,
  deathsEndAngle,
  handleArcHover,
  handleArcLeave,
  isHovering,
  hoveredSource,
  hoveredTarget,
  svgRef,
  totalKills,
  totalDeaths,
  getCoords,
}) => {
    const strokeWidth = 5;
    const paddedRadius = innerRadius + strokeWidth / 2;

    const { x: killsStartX, y: killsStartY } = getCoords(killsStartAngle, paddedRadius);
    const { x: killsEndX, y: killsEndY } = getCoords(killsEndAngle, paddedRadius);
    const { x: deathsStartX, y: deathsStartY } = getCoords(deathsStartAngle, paddedRadius);
    const { x: deathsEndX, y: deathsEndY } = getCoords(deathsEndAngle, paddedRadius);

    // Calculate center angle for the combined label
    const centerAngle = (killsStartAngle + deathsEndAngle) / 2;
    const labelOffset = 30;
    const { x: labelX, y: labelY } = getCoords(centerAngle, paddedRadius + labelOffset);

    const killsArcRef = useRef<SVGPathElement>(null);
    const deathsArcRef = useRef<SVGPathElement>(null);

    return (
      <g key={playerName}>
        <g data-source={playerName} onMouseEnter={handleArcHover} onMouseLeave={handleArcLeave} opacity={isHovering ? (hoveredSource === playerName ? 1 : 0.3) : 1}>
          <path ref={killsArcRef} d={`M${killsStartX},${killsStartY} A${paddedRadius},${paddedRadius} 0 0,1 ${killsEndX},${killsEndY}`} fill="none" stroke={getColorgorical(playerTeam)} strokeWidth={strokeWidth} />
        </g>
        <g data-target={playerName} onMouseEnter={handleArcHover} onMouseLeave={handleArcLeave} opacity={isHovering ? (hoveredTarget === playerName ? 1 : 0.3) : 1}>
          <path ref={deathsArcRef} d={`M${deathsStartX},${deathsStartY} A${paddedRadius},${paddedRadius} 0 0,1 ${deathsEndX},${deathsEndY}`} fill="none" stroke={getColorgorical(otherTeam)} strokeWidth={strokeWidth} />
        </g>

        {/* Combined label group */}
        <g>
          <text x={labelX} y={labelY - 5} textAnchor="middle" dominantBaseline="central" fill={getColorgorical(playerTeam)} fontSize="0.6em">
            {playerName}
          </text>
          <text x={labelX} y={labelY + 5} textAnchor="middle" dominantBaseline="central" fill={getColorgorical(playerTeam)} fontSize="0.6em">
            {totalKills}K / {totalDeaths}D
          </text>
        </g>

        <PathTooltip svgRef={svgRef} pathRef={killsArcRef} tip={`${playerName} kills: ${totalKills}`} />
        <PathTooltip svgRef={svgRef} pathRef={deathsArcRef} tip={`${playerName} deaths: ${totalDeaths}`} />
      </g>
    );
  };

const Chord: React.FC<{
  interaction: ChordDataEntry;
  sourceStart: number;
  sourceEnd: number;
  sourceValue: number;
  getSourceCurrentValue: () => number;
  addSourceCurrentValue: (value: number) => void;
  targetStart: number;
  targetEnd: number;
  targetValue: number;
  getTargetCurrentValue: () => number;
  addTargetCurrentValue: (value: number) => void;
  innerRadius: number;
  handleArcHover: (event: React.MouseEvent<SVGPathElement>) => void;
  handleArcLeave: (event: React.MouseEvent<SVGPathElement>) => void;
  isHovering: boolean;
  isInteractionHovering: boolean;
  hoveredSource: string | null;
  hoveredTarget: string | null;
  svgRef: React.RefObject<SVGSVGElement>;
  getCoords: (angle: number, radius: number) => { x: number; y: number };
}> = ({
  interaction,
  sourceStart,
  sourceEnd,
  sourceValue,
  getSourceCurrentValue,
  addSourceCurrentValue,
  targetStart,
  targetEnd,
  targetValue,
  getTargetCurrentValue,
  addTargetCurrentValue,
  innerRadius,
  handleArcHover,
  handleArcLeave,
  isHovering,
  isInteractionHovering,
  hoveredSource,
  hoveredTarget,
  svgRef,
  getCoords,
}) => {
    const color = getColorgorical(interaction.sourceTeamName);

    const sourceCurrentValue = getSourceCurrentValue();
    const targetCurrentValue = getTargetCurrentValue();

    const interactionSourceStartAngle = sourceStart + (sourceCurrentValue / sourceValue) * (sourceEnd - sourceStart);
    const interactionSourceEndAngle = sourceStart + ((sourceCurrentValue + interaction.value) / sourceValue) * (sourceEnd - sourceStart);
    const interactionTargetStartAngle = targetStart + (targetCurrentValue / targetValue) * (targetEnd - targetStart);
    const interactionTargetEndAngle = targetStart + ((targetCurrentValue + interaction.value) / targetValue) * (targetEnd - targetStart);

    addSourceCurrentValue(interaction.value);
    addTargetCurrentValue(interaction.value);

    const source = interaction.sourcePlayerName;
    const target = interaction.targetPlayerName;

    const arcRef = useRef<SVGPathElement>(null);

    return (
      <g>
        <path
          ref={arcRef}
          d={getArcPath(interactionSourceStartAngle, interactionSourceEndAngle, interactionTargetStartAngle, interactionTargetEndAngle, innerRadius, getCoords)}
          fill={color}
          stroke="white"
          strokeWidth={1}
          data-source={source}
          data-target={interaction.targetPlayerName}
          onMouseEnter={handleArcHover}
          onMouseLeave={handleArcLeave}
          opacity={isHovering ? ((isInteractionHovering ? hoveredSource === source && hoveredTarget === target : hoveredSource === source || hoveredTarget === interaction.targetPlayerName) ? 1 : 0.) : 0}
        />

        <PathTooltip svgRef={svgRef} pathRef={arcRef} tip={`${interaction.value} kills on ${interaction.targetPlayerName} by ${interaction.sourcePlayerName}`} />
      </g>
    );
  };

const ChordDiagram: React.FC<{ matchId: string }> = ({ matchId }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const matchData = useWombatData<MatchData>('match_data', { initialFilter: { matchId } }).data[0];
  const playerInteractionEventsData = useWombatData<PlayerInteractionEvent>('player_interaction_events', { initialFilter: { matchId } }).data;

  console.log('matchData', matchData);

  const team1Name = matchData?.team1Name || '';
  const team2Name = matchData?.team2Name || '';
  const team1Players = matchData?.team1Players || [];
  const team2Players = matchData?.team2Players || [];


  const chordData = transformDataToChordFormat(playerInteractionEventsData);

  console.log('chordData', chordData);

  const widgetRegistry = useWidgetRegistry();
  const size = Math.min(widgetRegistry.widgetGridWidth, widgetRegistry.widgetGridHeight);

  const padding = size / 8;

  const arcThickness = 2;
  const outerRadius = size / 4;
  const innerRadius = outerRadius - arcThickness;
  const [hoveredSource, setHoveredSource] = useState<string | null>(null);
  const [hoveredTarget, setHoveredTarget] = useState<string | null>(null);
  const isHovering = hoveredSource !== null || hoveredTarget !== null;
  const isInteractionHovering = hoveredSource !== null && hoveredTarget !== null;


  console.log('size', size);
  console.log('padding', padding);
  console.log('outerRadius', outerRadius);
  console.log('innerRadius', innerRadius);

  const getCoords = (angle: number, radius: number) => {
    return {
      x: size / 2 + radius * Math.cos(Math.PI * (angle / 180)),
      y: size / 2 + radius * Math.sin(Math.PI * (angle / 180)),
    };
  };

  const players = [...team1Players, ...team2Players];

  const groupedData = chordData.reduce(
    (acc, entry) => {
      if (!acc[entry.sourcePlayerName]) {
        acc[entry.sourcePlayerName] = [];
      }
      if (!acc[entry.targetPlayerName]) {
        acc[entry.targetPlayerName] = [];
      }
      acc[entry.sourcePlayerName].push(entry);
      return acc;
    },
    {} as { [source: string]: ChordDataEntry[] },
  );

  Object.entries(groupedData).forEach(([, interactions]) => interactions.sort((a, b) => a.value - b.value).sort((a, b) => players.indexOf(b.targetPlayerName) - players.indexOf(a.targetPlayerName)));
  const playerAngles: {
    [player: string]: {
      killsStartAngle: number;
      killsEndAngle: number;
      totalKills: number;
      currentKills: number;
      deathsStartAngle: number;
      deathsEndAngle: number;
      totalDeaths: number;
      currentDeaths: number
    };
  } = {};



  const numPlayers = players.length;
  const totalValue = chordData.reduce((sum, entry) => sum + entry.value, 0) * 2;
  const angleSpacing = 8; // Add spacing between segments
  const totalAngle = 360 - (numPlayers * angleSpacing);

  let currentAngle = 0;
  players.forEach((player) => {
    const playerValue = groupedData[player]?.reduce<number>((sum, interaction: ChordDataEntry) => sum + interaction.value, 0) ?? 0;
    const toPlayerValue = Object.values(groupedData).reduce(
      (sum, interactions) => sum + interactions.filter((interaction: ChordDataEntry) => interaction.targetPlayerName === player).reduce<number>((sum2, interaction) => sum2 + interaction.value, 0),
      0,
    );

    // Adjust angle calculations to prevent overlap
    const killsAngleSpan = (playerValue / totalValue) * totalAngle;
    const deathsAngleSpan = (toPlayerValue / totalValue) * totalAngle;

    playerAngles[player] = {
      killsStartAngle: currentAngle,
      killsEndAngle: currentAngle + killsAngleSpan,
      totalKills: playerValue,
      currentKills: 0,
      deathsStartAngle: currentAngle + killsAngleSpan,
      deathsEndAngle: currentAngle + killsAngleSpan + deathsAngleSpan,
      totalDeaths: toPlayerValue,
      currentDeaths: 0,
    };

    currentAngle += killsAngleSpan + deathsAngleSpan + angleSpacing;
  });


  const averageAngle = players.length > 0 ? players.reduce((sum, player) => sum + playerAngles[player].killsStartAngle, 0) / players.length : 0;

  console.log('averageAngle', averageAngle);

  const nudgeAngle = averageAngle - 270;

  Object.values(playerAngles).forEach((playerAngle) => {
    playerAngle.killsStartAngle += nudgeAngle;
    playerAngle.killsEndAngle += nudgeAngle;
    playerAngle.deathsStartAngle += nudgeAngle;
    playerAngle.deathsEndAngle += nudgeAngle;
  });

  console.log('playerAngles', playerAngles);


  const handleArcHover = (event: React.MouseEvent<SVGPathElement>) => {
    if (svgRef.current) {
      const path = event.currentTarget;
      const sourcePlayerName = path.dataset.source as string;
      const targetPlayerName = path.dataset.target as string;

      if (sourcePlayerName) {
        setHoveredSource(sourcePlayerName);
      }
      if (targetPlayerName) {
        setHoveredTarget(targetPlayerName);
      }
    }
  };

  const handleArcLeave = () => {
    if (svgRef.current) {
      setHoveredSource(null);
      setHoveredTarget(null);
    }
  };


  return (
    <Container>
      <svg ref={svgRef} width={widgetRegistry.widgetGridWidth} height={widgetRegistry.widgetGridHeight} style={{ display: 'block', margin: '0 auto' }}>
        {Object.entries(playerAngles).map(([playerName, angles]) => {
          const { killsStartAngle, killsEndAngle, deathsStartAngle, deathsEndAngle } = angles;
          return (
            <PlayerArc
              key={playerName}
              playerName={playerName}
              innerRadius={innerRadius}
              playerTeam={team1Players.includes(playerName) ? team1Name : team2Name}
              otherTeam={team1Players.includes(playerName) ? team2Name : team1Name}
              killsStartAngle={killsStartAngle}
              killsEndAngle={killsEndAngle}
              deathsStartAngle={deathsStartAngle}
              deathsEndAngle={deathsEndAngle}
              handleArcHover={handleArcHover}
              handleArcLeave={handleArcLeave}
              isHovering={isHovering}
              isInteractionHovering={isInteractionHovering}
              hoveredSource={hoveredSource}
              hoveredTarget={hoveredTarget}
              svgRef={svgRef}
              totalKills={angles.totalKills}
              totalDeaths={angles.totalDeaths}
              getCoords={getCoords}
            />
          );
        })}

        {players.length > 0 && Object.entries(groupedData).map(([source, interactions]) =>
          interactions.map((interaction, index) => (
            <Chord
              key={`${source}-${interaction.targetPlayerName}-${index}`}
              interaction={interaction}
              sourceStart={playerAngles[source].killsStartAngle}
              sourceEnd={playerAngles[source].killsEndAngle}
              sourceValue={playerAngles[source].totalKills}
              getSourceCurrentValue={() => playerAngles[source].currentKills}
              addSourceCurrentValue={(value) => (playerAngles[source].currentKills += value)}
              targetStart={playerAngles[interaction.targetPlayerName].deathsStartAngle}
              targetEnd={playerAngles[interaction.targetPlayerName].deathsEndAngle}
              targetValue={playerAngles[interaction.targetPlayerName].totalDeaths}
              getTargetCurrentValue={() => playerAngles[interaction.targetPlayerName].currentDeaths}
              addTargetCurrentValue={(value) => (playerAngles[interaction.targetPlayerName].currentDeaths += value)}
              innerRadius={innerRadius}
              handleArcHover={handleArcHover}
              handleArcLeave={handleArcLeave}
              isHovering={isHovering}
              isInteractionHovering={isInteractionHovering}
              hoveredSource={hoveredSource}
              hoveredTarget={hoveredTarget}
              svgRef={svgRef}
              getCoords={getCoords}
            />
          )),
        )}
      </svg>
    </Container>
  );
};

export default ChordDiagram;

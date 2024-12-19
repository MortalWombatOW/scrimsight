import React, { useState, useRef } from 'react';
import { useWombatData } from 'wombat-data-framework';
import { getColorgorical } from '../../lib/color';
import { MatchData } from '../../WombatDataFrameworkSchema';
import { PathTooltip } from 'react-path-tooltip'; // import the package
import useWindowSize from '../../hooks/useWindowSize';
import { Card, CardContent, Container } from '@mui/material';
import { Typography } from '@mui/material';
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

const getArcPath = (sourceStartAngle: number, sourceEndAngle: number, targetStartAngle: number, targetEndAngle: number, outerRadius: number, innerRadius: number, padding: number) => {
  const sourceStartX = outerRadius + innerRadius * Math.cos(Math.PI * (sourceStartAngle / 180)) + padding;
  const sourceStartY = outerRadius + innerRadius * Math.sin(Math.PI * (sourceStartAngle / 180)) + padding;
  const sourceEndX = outerRadius + innerRadius * Math.cos(Math.PI * (sourceEndAngle / 180)) + padding;
  const sourceEndY = outerRadius + innerRadius * Math.sin(Math.PI * (sourceEndAngle / 180)) + padding;

  const targetStartX = outerRadius + innerRadius * Math.cos(Math.PI * (targetStartAngle / 180)) + padding;
  const targetStartY = outerRadius + innerRadius * Math.sin(Math.PI * (targetStartAngle / 180)) + padding;
  const targetEndX = outerRadius + innerRadius * Math.cos(Math.PI * (targetEndAngle / 180)) + padding;
  const targetEndY = outerRadius + innerRadius * Math.sin(Math.PI * (targetEndAngle / 180)) + padding;

  const averageX = (sourceStartX + sourceEndX + targetStartX + targetEndX) / 4;
  const averageY = (sourceStartY + sourceEndY + targetStartY + targetEndY) / 4;

  const sourceEndToTargetStartControlPointX = outerRadius / 2 + averageX / 2 + padding / 2;
  const sourceEndToTargetStartControlPointY = outerRadius / 2 + averageY / 2 + padding / 2;

  const targetStartToTargetEndControlPointX = outerRadius / 2 + averageX / 2 + padding / 2;
  const targetStartToTargetEndControlPointY = outerRadius / 2 + averageY / 2 + padding / 2;

  let path = '';
  // path components
  // 1. start at the source start point
  path += `M${sourceStartX},${sourceStartY}`;
  // // 2. draw a line to the source arrow point and then a line to the source end point
  // path += ` L${sourceArrowX},${sourceArrowY} L${sourceEndX},${sourceEndY}`;
  // 2. draw an arc to the source end point
  path += ` A${outerRadius},${outerRadius} 0 0,1 ${sourceEndX},${sourceEndY}`;
  // 3. draw a quadratic curve to the target start point
  path += ` Q${sourceEndToTargetStartControlPointX},${sourceEndToTargetStartControlPointY} ${targetStartX},${targetStartY}`;
  // // 4. draw an line to the target arrow point and then a line to the target end point
  // path += ` L${targetArrowX},${targetArrowY} L${targetEndX},${targetEndY}`;
  // 4. draw an arc to the target end point
  path += ` A${outerRadius},${outerRadius} 0 0,1 ${targetEndX},${targetEndY}`;
  // 5. draw a quadratic curve back to the source start point
  path += ` Q${targetStartToTargetEndControlPointX},${targetStartToTargetEndControlPointY} ${sourceStartX},${sourceStartY}`;

  return path;
};

const PlayerArc: React.FC<{
  playerName: string;
  playerTeam: string;
  otherTeam: string;
  innerRadius: number;
  outerRadius: number;
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
  padding: number;
  totalKills: number;
  totalDeaths: number;
}> = ({
  playerName,
  playerTeam,
  otherTeam,
  innerRadius,
  outerRadius,
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
  padding,
  totalKills,
  totalDeaths,
}) => {
    const paddedRadius = innerRadius + 22;

    const killsStartX = outerRadius + paddedRadius * Math.cos(Math.PI * (killsStartAngle / 180)) + padding;
    const killsStartY = outerRadius + paddedRadius * Math.sin(Math.PI * (killsStartAngle / 180)) + padding;
    const killsEndX = outerRadius + paddedRadius * Math.cos(Math.PI * (killsEndAngle / 180)) + padding;
    const killsEndY = outerRadius + paddedRadius * Math.sin(Math.PI * (killsEndAngle / 180)) + padding;

    const deathsStartX = outerRadius + paddedRadius * Math.cos(Math.PI * (deathsStartAngle / 180)) + padding;
    const deathsStartY = outerRadius + paddedRadius * Math.sin(Math.PI * (deathsStartAngle / 180)) + padding;
    const deathsEndX = outerRadius + paddedRadius * Math.cos(Math.PI * (deathsEndAngle / 180)) + padding;
    const deathsEndY = outerRadius + paddedRadius * Math.sin(Math.PI * (deathsEndAngle / 180)) + padding;

    const labelOffset = 40;
    const killsLabelAngle = (killsStartAngle + killsEndAngle) / 2;
    const killsLabelX = (killsStartX + killsEndX) / 2 + labelOffset * Math.cos(Math.PI * (killsLabelAngle / 180));
    const killsLabelY = (killsStartY + killsEndY) / 2 + labelOffset * Math.sin(Math.PI * (killsLabelAngle / 180));
    const deathsLabelAngle = (deathsStartAngle + deathsEndAngle) / 2;
    const deathsLabelX = (deathsStartX + deathsEndX) / 2 + labelOffset * Math.cos(Math.PI * (deathsLabelAngle / 180));
    const deathsLabelY = (deathsStartY + deathsEndY) / 2 + labelOffset * Math.sin(Math.PI * (deathsLabelAngle / 180));

    const killsArcRef = useRef<SVGPathElement>(null);
    const deathsArcRef = useRef<SVGPathElement>(null);

    return (
      <g key={playerName}>
        <g data-source={playerName} onMouseEnter={handleArcHover} onMouseLeave={handleArcLeave} opacity={isHovering ? (hoveredSource === playerName ? 1 : 0.3) : 1}>
          <path ref={killsArcRef} d={`M${killsStartX},${killsStartY} A${paddedRadius},${paddedRadius} 0 0,1 ${killsEndX},${killsEndY}`} fill="none" stroke={getColorgorical(playerTeam)} strokeWidth={40} />

          <text x={killsLabelX} y={killsLabelY} textAnchor="middle" dominantBaseline="central" fill={getColorgorical(playerTeam)} fontSize="0.6em">
            {totalKills} kills
          </text>
        </g>
        <g data-target={playerName} onMouseEnter={handleArcHover} onMouseLeave={handleArcLeave} opacity={isHovering ? (hoveredTarget === playerName ? 1 : 0.3) : 1}>
          <path ref={deathsArcRef} d={`M${deathsStartX},${deathsStartY} A${paddedRadius},${paddedRadius} 0 0,1 ${deathsEndX},${deathsEndY}`} fill="none" stroke={getColorgorical(otherTeam)} strokeWidth={40} />

          <text x={deathsLabelX} y={deathsLabelY} textAnchor="middle" dominantBaseline="central" fill={getColorgorical(playerTeam)} fontSize="0.6em">
            {totalDeaths} deaths
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
  outerRadius: number;
  innerRadius: number;
  handleArcHover: (event: React.MouseEvent<SVGPathElement>) => void;
  handleArcLeave: (event: React.MouseEvent<SVGPathElement>) => void;
  isHovering: boolean;
  isInteractionHovering: boolean;
  hoveredSource: string | null;
  hoveredTarget: string | null;
  svgRef: React.RefObject<SVGSVGElement>;
  padding: number;
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
  outerRadius,
  innerRadius,
  handleArcHover,
  handleArcLeave,
  isHovering,
  isInteractionHovering,
  hoveredSource,
  hoveredTarget,
  svgRef,
  padding,
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
          d={getArcPath(interactionSourceStartAngle, interactionSourceEndAngle, interactionTargetStartAngle, interactionTargetEndAngle, outerRadius, innerRadius, padding)}
          fill={color}
          stroke="white"
          strokeWidth={1}
          data-source={source}
          data-target={interaction.targetPlayerName}
          onMouseEnter={handleArcHover}
          onMouseLeave={handleArcLeave}
          opacity={isHovering ? ((isInteractionHovering ? hoveredSource === source && hoveredTarget === target : hoveredSource === source || hoveredTarget === interaction.targetPlayerName) ? 1 : 0.3) : 0.7}
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
  const width = widgetRegistry.widgetGridWidth;

  // const { width } = useWindowSize();

  const padding = width / 8;

  const outerRadius = width / 4;
  const innerRadius = outerRadius * 0.8;
  const [hoveredSource, setHoveredSource] = useState<string | null>(null);
  const [hoveredTarget, setHoveredTarget] = useState<string | null>(null);
  const isHovering = hoveredSource !== null || hoveredTarget !== null;
  const isInteractionHovering = hoveredSource !== null && hoveredTarget !== null;

  const getLabelPosition = (angle: number) => {
    const labelRadius = outerRadius + 50;
    return {
      x: outerRadius + labelRadius * Math.cos(Math.PI * (angle / 180)) + padding,
      y: outerRadius + labelRadius * Math.sin(Math.PI * (angle / 180)) + padding,
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
    [player: string]: { killsStartAngle: number; killsEndAngle: number; totalKills: number; currentKills: number; deathsStartAngle: number; deathsEndAngle: number; totalDeaths: number; currentDeaths: number };
  } = {};
  let currentAngle = 0;
  const totalValue = chordData.reduce((sum, entry) => sum + entry.value, 0) * 2;

  players.forEach((player) => {
    const playerValue = groupedData[player]?.reduce<number>((sum, interaction: ChordDataEntry) => sum + interaction.value, 0) ?? 0;
    const toPlayerValue = Object.values(groupedData).reduce(
      (sum, interactions) => sum + interactions.filter((interaction: ChordDataEntry) => interaction.targetPlayerName === player).reduce<number>((sum2, interaction) => sum2 + interaction.value, 0),
      0,
    );

    const killsAngleSpan = (playerValue / totalValue) * 360;
    const deathsAngleSpan = (toPlayerValue / totalValue) * 360;

    playerAngles[player] = {
      killsStartAngle: currentAngle + killsAngleSpan / 2,
      killsEndAngle: currentAngle + killsAngleSpan,
      totalKills: playerValue,
      currentKills: 0,
      deathsStartAngle: currentAngle + killsAngleSpan,
      deathsEndAngle: currentAngle + killsAngleSpan + (1 * deathsAngleSpan) / 2,
      totalDeaths: toPlayerValue,
      currentDeaths: 0,
    };
    currentAngle += killsAngleSpan;
    currentAngle += deathsAngleSpan;
  });

  console.log('playerAngles', playerAngles);

  const averageAngle = players.length > 0 ? players.reduce((sum, player) => sum + playerAngles[player].killsStartAngle, 0) / players.length : 0;

  console.log('averageAngle', averageAngle);

  const nudgeAngle = averageAngle - 270;

  Object.values(playerAngles).forEach((playerAngle) => {
    playerAngle.killsStartAngle += nudgeAngle;
    playerAngle.killsEndAngle += nudgeAngle;
    playerAngle.deathsStartAngle += nudgeAngle;
    playerAngle.deathsEndAngle += nudgeAngle;
  });

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

  // const team1AverageAngle = team1Players.reduce((sum, player) => sum + playerAngles[player].killsStartAngle, 0) / team1Players.length;
  // const team2AverageAngle = team2Players.reduce((sum, player) => sum + playerAngles[player].deathsEndAngle, 0) / team2Players.length;

  const team1LabelAngle = 70;
  const team2LabelAngle = 110;

  const teamLabelScale = 1.7;
  const team1LabelX = outerRadius + padding + teamLabelScale * (innerRadius * Math.cos(Math.PI * (team1LabelAngle / 180)));
  const team1LabelY = outerRadius + padding + teamLabelScale * (innerRadius * Math.sin(Math.PI * (team1LabelAngle / 180)));
  const team2LabelX = outerRadius + padding + teamLabelScale * (innerRadius * Math.cos(Math.PI * (team2LabelAngle / 180)));

  const team2LabelY = outerRadius + padding + teamLabelScale * (innerRadius * Math.sin(Math.PI * (team2LabelAngle / 180)));

  const team1TotalKills = team1Players.reduce((sum, player) => sum + playerAngles[player].totalKills, 0);
  const team2TotalKills = team2Players.reduce((sum, player) => sum + playerAngles[player].totalKills, 0);

  const teamsAverageY = (team1LabelY + team2LabelY) / 2;
  const xDistBetweenTeams = Math.abs(team1LabelX - team2LabelX);

  return (
    <Container>
      <svg ref={svgRef} width={outerRadius * 2 + padding * 2} height={outerRadius * 2 + padding * 2} style={{ display: 'block', margin: '0 auto' }}>
        {Object.entries(playerAngles).map(([playerName, angles]) => {
          const { killsStartAngle, killsEndAngle, deathsStartAngle, deathsEndAngle } = angles;
          return (
            <PlayerArc
              key={playerName}
              playerName={playerName}
              innerRadius={innerRadius}
              playerTeam={team1Players.includes(playerName) ? team1Name : team2Name}
              otherTeam={team1Players.includes(playerName) ? team2Name : team1Name}
              outerRadius={outerRadius}
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
              padding={padding}
              totalKills={angles.totalKills}
              totalDeaths={angles.totalDeaths}
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
              outerRadius={outerRadius}
              innerRadius={innerRadius}
              handleArcHover={handleArcHover}
              handleArcLeave={handleArcLeave}
              isHovering={isHovering}
              isInteractionHovering={isInteractionHovering}
              hoveredSource={hoveredSource}
              hoveredTarget={hoveredTarget}
              svgRef={svgRef}
              padding={padding}
            />
          )),
        )}

        {players.map((player) => {
          const { killsStartAngle: startAngle, deathsEndAngle: endAngle } = playerAngles[player];
          const labelAngle = (startAngle + endAngle) / 2;
          const { x, y } = getLabelPosition(labelAngle);
          return (
            <g
              key={player}
              onMouseEnter={() => {
                setHoveredSource(player);
                setHoveredTarget(player);
              }}
              onMouseLeave={() => {
                setHoveredSource(null);
                setHoveredTarget(null);
              }}>
              <text x={x} y={y} fontSize="0.7em" textAnchor="middle" dominantBaseline="central" fill={getColorgorical(team2Players.includes(player) ? team2Name : team1Name)}>
                {player}
              </text>
              {/* <text x={x} y={y + 10} fontSize="0.5em" textAnchor="middle" dominantBaseline="central" fill={getColorgorical(team2Players.includes(player) ? team2Name : team1Name)}>
                {playerRoleMap[player]}
              </text> */}
            </g>
          );
        })}
        <g key="team1Label">
          <text x={team1LabelX} y={team1LabelY} fontSize="0.7em" textAnchor="middle" dominantBaseline="central" fill={getColorgorical(team1Name)}>
            {team1Name}
          </text>
          <text x={team1LabelX} y={team1LabelY + 20} fontSize="0.5em" textAnchor="middle" dominantBaseline="central" fill={getColorgorical(team1Name)}>
            {team1TotalKills} kills
          </text>
        </g>
        <g key="team2Label">
          <text x={team2LabelX} y={team2LabelY} fontSize="0.7em" textAnchor="middle" dominantBaseline="central" fill={getColorgorical(team2Name)}>
            {team2Name}
          </text>
          <text x={team2LabelX} y={team2LabelY + 20} fontSize="0.5em" textAnchor="middle" dominantBaseline="central" fill={getColorgorical(team2Name)}>
            {team2TotalKills} kills
          </text>
        </g>
        <g key="teamsKillBalance">
          <rect x={team2LabelX + xDistBetweenTeams / 3 + 50} y={teamsAverageY} width={((team2TotalKills / (team1TotalKills + team2TotalKills)) * xDistBetweenTeams) / 3} height={30} fill={getColorgorical(team2Name)} />
          <rect
            x={team2LabelX + xDistBetweenTeams / 6 + ((team2TotalKills / (team1TotalKills + team2TotalKills)) * xDistBetweenTeams) / 3 + 50}
            y={teamsAverageY}
            width={((team1TotalKills / (team1TotalKills + team2TotalKills)) * xDistBetweenTeams) / 3}
            height={30}
            fill={getColorgorical(team1Name)}
          />
        </g>
      </svg>
    </Container>
  );
};

export default ChordDiagram;

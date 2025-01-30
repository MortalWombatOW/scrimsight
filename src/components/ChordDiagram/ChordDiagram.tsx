import React, { useState, useRef } from 'react';
import { useWombatData } from 'wombat-data-framework';
import { getColorgorical } from '../../lib/color';
import { MatchData } from '../../WombatDataFrameworkSchema';
import { PlayerInteractionEvent } from '../MapTimeline/types/timeline.types';

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

  // const averageAngle = (sourceStartAngle + sourceEndAngle + targetStartAngle + targetEndAngle) / 4;

  // const { x: sourceEndToTargetStartControlPointX, y: sourceEndToTargetStartControlPointY } = getCoords(averageAngle, 0);
  // const { x: targetStartToTargetEndControlPointX, y: targetStartToTargetEndControlPointY } = getCoords(averageAngle, 0);

  const arrowAngle = (targetStartAngle + targetEndAngle) / 2;
  const arrowWingSetback = 1.5 * (targetEndAngle - targetStartAngle);

  const { x: arrowTipX, y: arrowTipY } = getCoords(arrowAngle, innerRadius);
  const { x: arrowStartWingX, y: arrowStartWingY } = getCoords(targetStartAngle, innerRadius - arrowWingSetback);
  const { x: arrowEndWingX, y: arrowEndWingY } = getCoords(targetEndAngle, innerRadius - arrowWingSetback);

  const origin = getCoords(0, 0);

  const controlPointX = (sourceEndX + arrowTipX + origin.x) / 3;
  const controlPointY = (sourceEndY + arrowTipY + origin.y) / 3;

  const sourceEndToTargetStartControlPointX = controlPointX;
  const sourceEndToTargetStartControlPointY = controlPointY;

  const targetStartToTargetEndControlPointX = controlPointX;
  const targetStartToTargetEndControlPointY = controlPointY;





  let path = '';
  // path components
  // 1. start at the source start point
  path += `M${sourceStartX},${sourceStartY}`;
  // // 2. draw a line to the source arrow point and then a line to the source end point
  // path += ` L${sourceArrowX},${sourceArrowY} L${sourceEndX},${sourceEndY}`;
  // 2. draw an arc to the source end point
  path += ` A${innerRadius},${innerRadius} 0 0,1 ${sourceEndX},${sourceEndY}`;
  // 3. draw a quadratic curve to the target start point
  path += ` Q${sourceEndToTargetStartControlPointX},${sourceEndToTargetStartControlPointY} ${arrowStartWingX},${arrowStartWingY}`;
  // 4. draw the arrow
  path += ` L${arrowTipX},${arrowTipY} L${arrowEndWingX},${arrowEndWingY}`;

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
  highlight: boolean;
  onMouseOver: () => void;
  onMouseLeave: () => void;
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
  totalKills,
  totalDeaths,
  getCoords,
  highlight,
  onMouseOver,
  onMouseLeave,
}) => {
    const strokeWidth = 5;
    const paddedRadius = innerRadius + strokeWidth / 2;

    const outerArcWidth = 5;
    const outerArcRadius = paddedRadius + strokeWidth / 2 + outerArcWidth / 2;

    const { x: killsStartX, y: killsStartY } = getCoords(killsStartAngle, paddedRadius);
    const { x: killsEndX, y: killsEndY } = getCoords(killsEndAngle, paddedRadius);
    const { x: deathsStartX, y: deathsStartY } = getCoords(deathsStartAngle, paddedRadius);
    const { x: deathsEndX, y: deathsEndY } = getCoords(deathsEndAngle, paddedRadius);
    const { x: outerArcStartX, y: outerArcStartY } = getCoords(killsStartAngle, outerArcRadius);
    const { x: outerArcEndX, y: outerArcEndY } = getCoords(deathsEndAngle, outerArcRadius);

    // Calculate center angle for the combined label
    const centerAngle = (killsStartAngle + deathsEndAngle) / 2;
    const labelOffset = 50;
    const { x: labelX, y: labelY } = getCoords(centerAngle, paddedRadius + labelOffset);
    const { x: labelAnchorX, y: labelAnchorY } = getCoords(centerAngle, paddedRadius + labelOffset - 25);
    const { x: arcOutsideCenterX, y: arcOutsideCenterY } = getCoords(centerAngle, innerRadius + strokeWidth + 5);

    const totalAngle = deathsEndAngle - killsStartAngle;
    const numTicks = totalKills + totalDeaths;
    const anglePerTick = totalAngle / numTicks;
    const ticks = Array.from({ length: numTicks }).map((_, index) => killsStartAngle + index * anglePerTick).map((angle) => {
      const { x: innerCoordX, y: innerCoordY } = getCoords(angle, innerRadius);
      const { x: outerCoordX, y: outerCoordY } = getCoords(angle, innerRadius + strokeWidth);
      return {
        innerCoord: { x: innerCoordX, y: innerCoordY },
        outerCoord: { x: outerCoordX, y: outerCoordY },
      };
    });



    return (
      <g key={playerName} onMouseEnter={onMouseOver} onMouseLeave={onMouseLeave}>
        <g>
          <path d={`M${killsStartX},${killsStartY} A${paddedRadius},${paddedRadius} 0 0,1 ${killsEndX},${killsEndY}`} fill="none" stroke={getColorgorical(playerTeam)} strokeWidth={strokeWidth} />
        </g>
        <g>
          <path d={`M${deathsStartX},${deathsStartY} A${paddedRadius},${paddedRadius} 0 0,1 ${deathsEndX},${deathsEndY}`} fill="none" stroke={getColorgorical(otherTeam)} strokeWidth={strokeWidth} />
        </g>

        {ticks.map((tick, index) => (
          <g key={index}>
            <line x1={tick.innerCoord.x} y1={tick.innerCoord.y} x2={tick.outerCoord.x} y2={tick.outerCoord.y} stroke="black" strokeWidth={1} opacity={0.8} />
          </g>
        ))}

        <g>
          <path d={`M${outerArcStartX},${outerArcStartY} A${outerArcRadius},${outerArcRadius} 0 0,1 ${outerArcEndX},${outerArcEndY}`} fill="none" stroke={getColorgorical(playerTeam)} strokeWidth={outerArcWidth} />
        </g>

        {/* Combined label group */}
        <g>
          <text x={labelX} y={labelY - 7} textAnchor="middle" dominantBaseline="central" fill={getColorgorical(playerTeam)} fontSize="0.7em" fontWeight={highlight ? 'bold' : 'normal'}>
            {playerName}
          </text>
          <text x={labelX} y={labelY + 7} textAnchor="middle" dominantBaseline="central" fill={getColorgorical(playerTeam)} fontSize="0.7em" fontWeight={highlight ? 'bold' : 'normal'}>
            {totalKills}K / {totalDeaths}D
          </text>
        </g>
        <line x1={labelAnchorX} y1={labelAnchorY} x2={arcOutsideCenterX} y2={arcOutsideCenterY} stroke={getColorgorical(playerTeam)} strokeWidth={1} />
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
  highlightState: 'highlight' | 'normal' | 'hidden';
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
  highlightState,
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

    const arcRef = useRef<SVGPathElement>(null);

    const startCoords = getCoords((interactionSourceStartAngle + interactionSourceEndAngle) / 2, innerRadius - 35);
    const endCoords = getCoords((interactionTargetStartAngle + interactionTargetEndAngle) / 2, innerRadius - 35);

    return (
      <g>
        <path
          ref={arcRef}
          d={getArcPath(interactionSourceStartAngle, interactionSourceEndAngle, interactionTargetStartAngle, interactionTargetEndAngle, innerRadius, getCoords)}
          // fill={`${color}30`}
          // stroke={`${color}80`}
          style={{
            fill: highlightState === 'highlight' ? `${color}90` : highlightState === 'normal' ? `${color}30` : `${color}00`,
            stroke: highlightState === 'highlight' ? `${color}` : highlightState === 'normal' ? `${color}80` : `${color}00`,
            transition: 'all 0.3s ease',
          }}
          strokeWidth={1}
          opacity={1}
        />
        <text
          x={startCoords.x}
          y={startCoords.y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="0.7em"
          style={{
            fill: highlightState === 'highlight' ? `#ffffff` : `#ffffff00`,
            transition: 'all 0.3s ease',
          }}
        >
          {interaction.value} kills on {interaction.targetPlayerName}
        </text>
        <text
          x={endCoords.x}
          y={endCoords.y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="0.7em"
          style={{
            fill: highlightState === 'highlight' ? `#ffffff` : `#ffffff00`,
            transition: 'all 0.3s ease',
          }}
        >
          {interaction.value} deaths from {interaction.sourcePlayerName}
        </text>
      </g>
    );
  };

// Add new Legend component
const Legend: React.FC<{
  team1Name: string,
  team2Name: string,
  centerX: number,
  bottomY: number
}> = ({ team1Name, team2Name, centerX, bottomY }) => {
  const legendY = bottomY + 40;
  const legendWidth = 300; // Width for text wrapping
  const itemSpacing = 20; // Vertical spacing between items

  return (
    <g className="legend">
      <g transform={`translate(${centerX - legendWidth / 2}, ${legendY})`}>
        {/* Team 1 kills */}
        <rect
          x="0"
          y="0"
          width="15"
          height="8"
          fill={getColorgorical(team1Name)}
        />
        <text
          x="25"
          y="7"
          fontSize="12"
          fill="#8F9BA8"
        >
          Kills by {team1Name}
        </text>

        {/* Team 2 kills */}
        <rect
          x="0"
          y={itemSpacing}
          width="15"
          height="8"
          fill={getColorgorical(team2Name)}
        />
        <text
          x="25"
          y={itemSpacing + 7}
          fontSize="12"
          fill="#8F9BA8"
        >
          Kills by {team2Name}
        </text>

        {/* Interaction lines */}
        <g transform={`translate(0, ${itemSpacing * 2})`}>
          <path
            d="M0,4 C10,4 20,12 30,12"
            stroke={`${getColorgorical(team1Name)}80`}
            fill="none"
            strokeWidth="2"
          />
          <path
            d="M0,4 C10,4 20,-4 30,-4"
            stroke={`${getColorgorical(team2Name)}80`}
            fill="none"
            strokeWidth="2"
          />
          <text
            x="40"
            y="7"
            fontSize="12"
            fill="#8F9BA8"
          >
            <tspan x="40" dy="0">Connecting killed player and killer</tspan>
            <tspan x="40" dy="14">(thickness indicates number of kills between those players)</tspan>
          </text>
        </g>

        {/* Tick marks */}
        <g transform={`translate(0, ${itemSpacing * 4})`}>
          <line x1="0" y1="0" x2="0" y2="8" stroke="#8F9BA8" strokeWidth="1" />
          <line x1="5" y1="0" x2="5" y2="8" stroke="#8F9BA8" strokeWidth="1" />
          <line x1="10" y1="0" x2="10" y2="8" stroke="#8F9BA8" strokeWidth="1" />
          <text
            x="25"
            y="7"
            fontSize="12"
            fill="#8F9BA8"
          >
            Each tick represents one kill
          </text>
        </g>
      </g>
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
  const gridRowCount = 2;
  const gridColumnCount = 2;
  const size = Math.min(widgetRegistry.widgetGridWidth * gridColumnCount, widgetRegistry.widgetGridHeight * gridRowCount);

  const radius = size / 3;

  const [highlightedPlayer, setHighlightedPlayer] = useState<string | null>(null);


  const getCoords = (angle: number, radius: number) => {
    return {
      x: widgetRegistry.widgetGridWidth * gridColumnCount / 2 + radius * Math.cos(Math.PI * (angle / 180)),
      y: widgetRegistry.widgetGridHeight * gridRowCount / 2 - 40 + radius * Math.sin(Math.PI * (angle / 180)),
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
  const anglePaddingBetweenTeams = 30;
  const anglePaddingBetweenPlayerArcs = 8;
  const totalAngle = 360 - (numPlayers * anglePaddingBetweenPlayerArcs) - anglePaddingBetweenTeams * 2;

  let currentAngle = 0;
  let currentTeam = team1Name;
  players.forEach((player) => {
    const playerValue = groupedData[player]?.reduce<number>((sum, interaction: ChordDataEntry) => sum + interaction.value, 0) ?? 0;
    const toPlayerValue = Object.values(groupedData).reduce(
      (sum, interactions) => sum + interactions.filter((interaction: ChordDataEntry) => interaction.targetPlayerName === player).reduce<number>((sum2, interaction) => sum2 + interaction.value, 0),
      0,
    );

    const playerTeam = team1Players.includes(player) ? team1Name : team2Name;
    if (playerTeam !== currentTeam) {
      currentTeam = playerTeam;
      currentAngle += anglePaddingBetweenTeams;
    }

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

    currentAngle += killsAngleSpan + deathsAngleSpan + anglePaddingBetweenPlayerArcs;
  });


  const averageAngle = players.length > 0 ? players.reduce((sum, player) => sum + playerAngles[player].killsStartAngle, 0) / players.length : 0;

  console.log('averageAngle', averageAngle);

  const nudgeAngle = 90 + anglePaddingBetweenPlayerArcs / 2 + anglePaddingBetweenTeams / 2

  Object.values(playerAngles).forEach((playerAngle) => {
    playerAngle.killsStartAngle += nudgeAngle;
    playerAngle.killsEndAngle += nudgeAngle;
    playerAngle.deathsStartAngle += nudgeAngle;
    playerAngle.deathsEndAngle += nudgeAngle;
  });

  console.log('playerAngles', playerAngles);


  const team1LabelCoords = getCoords(225, radius + 100);
  const team2LabelCoords = getCoords(315, radius + 100);
  const totalTeam1Kills = chordData.filter((interaction) => interaction.sourceTeamName === team1Name).reduce((sum, interaction) => sum + interaction.value, 0);
  const totalTeam2Kills = chordData.filter((interaction) => interaction.sourceTeamName === team2Name).reduce((sum, interaction) => sum + interaction.value, 0);


  return (
    <svg ref={svgRef} width={widgetRegistry.widgetGridWidth * gridColumnCount} height={(widgetRegistry.widgetGridHeight * gridRowCount)}>
      {Object.entries(playerAngles).map(([playerName, angles]) => {
        const { killsStartAngle, killsEndAngle, deathsStartAngle, deathsEndAngle } = angles;
        return (
          <PlayerArc
            key={playerName}
            playerName={playerName}
            innerRadius={radius}
            playerTeam={team1Players.includes(playerName) ? team1Name : team2Name}
            otherTeam={team1Players.includes(playerName) ? team2Name : team1Name}
            killsStartAngle={killsStartAngle}
            killsEndAngle={killsEndAngle}
            deathsStartAngle={deathsStartAngle}
            deathsEndAngle={deathsEndAngle}
            highlight={highlightedPlayer === playerName}
            onMouseOver={() => setHighlightedPlayer(playerName)}
            onMouseLeave={() => setHighlightedPlayer(null)}
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
            innerRadius={radius}
            highlightState={(highlightedPlayer === interaction.targetPlayerName || highlightedPlayer === interaction.sourcePlayerName) ? 'highlight' : highlightedPlayer === null ? 'normal' : 'hidden'}
            getCoords={getCoords}
          />
        )),
      )}

      <g>
        <text x={team1LabelCoords.x} y={team1LabelCoords.y - 10} textAnchor="middle" dominantBaseline="central" fill={getColorgorical(team1Name)} fontSize="1em" fontWeight="bold">{team1Name}</text>
        <text x={team1LabelCoords.x} y={team1LabelCoords.y + 10} textAnchor="middle" dominantBaseline="central" fill={getColorgorical(team1Name)} fontSize="0.8em" fontWeight="bold">{totalTeam1Kills} kills</text>
      </g>

      <g>
        <text x={team2LabelCoords.x} y={team2LabelCoords.y - 10} textAnchor="middle" dominantBaseline="central" fill={getColorgorical(team2Name)} fontSize="1em" fontWeight="bold">{team2Name}</text>
        <text x={team2LabelCoords.x} y={team2LabelCoords.y + 10} textAnchor="middle" dominantBaseline="central" fill={getColorgorical(team2Name)} fontSize="0.8em" fontWeight="bold">{totalTeam2Kills} kills</text>
      </g>

      <Legend
        team1Name={team1Name}
        team2Name={team2Name}
        centerX={170}
        bottomY={widgetRegistry.widgetGridHeight * gridRowCount - 140}
      />
    </svg>
  );
};

export default ChordDiagram;

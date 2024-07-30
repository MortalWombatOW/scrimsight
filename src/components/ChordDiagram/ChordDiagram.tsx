import React, {useState, useEffect, useRef} from 'react';
import {useDataManager} from '../../WombatDataFramework/DataContext';
import {getColorgorical} from '../../lib/color';

interface ChordDataEntry {
  sourcePlayerName: string;
  sourceTeamName: string;
  targetPlayerName: string;
  value: number;
}

const transformDataToChordFormat = (
  data: {
    playerName: string;
    playerTeam: string;
    playerHero: string;
    otherPlayerName: string;
    playerInteractionEventTime: number;
    playerInteractionEventType: string;
  }[],
): ChordDataEntry[] => {
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

  console.log('transformedData', transformedData);

  return transformedData;
};

const ChordDiagram: React.FC<{mapId: number}> = ({mapId}) => {
  const dataManager = useDataManager();
  const [chordData, setChordData] = useState<ChordDataEntry[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const fetchDataAndTransform = async () => {
      if (!dataManager.hasNodeOutput('player_stat_expanded')) {
        return;
      }
      // sport data by player name, then team name
      const data = dataManager.getNodeOutputOrDie('player_interaction_events').filter((row) => row['mapId'] === mapId);

      const transformedData = transformDataToChordFormat(data as any);
      setChordData(transformedData);
    };

    fetchDataAndTransform();
  }, [dataManager]);

  const outerRadius = 250;
  const innerRadius = 200;
  const [hoveredArc, setHoveredArc] = useState<ChordDataEntry | null>(null);

  // produce a bezier curve path from the start and end points. It starts at the start point pointing towards the center, and ends at the end point pointing towards the center.
  const getArcPath = (sourceStartAngle: number, sourceEndAngle: number, targetStartAngle: number, targetEndAngle: number, width: number) => {
    console.log('getArcPath', sourceStartAngle, sourceEndAngle, targetStartAngle, targetEndAngle, width);
    const sourceStartX = outerRadius + innerRadius * Math.cos(Math.PI * (sourceStartAngle / 180));
    const sourceStartY = outerRadius + innerRadius * Math.sin(Math.PI * (sourceStartAngle / 180));
    const sourceEndX = outerRadius + innerRadius * Math.cos(Math.PI * (sourceEndAngle / 180));
    const sourceEndY = outerRadius + innerRadius * Math.sin(Math.PI * (sourceEndAngle / 180));

    const averageSourceAngle = (sourceStartAngle + sourceEndAngle) / 2;
    const averageTargetAngle = (targetStartAngle + targetEndAngle) / 2;

    const arrowScaling = 0.97;

    const sourceArrowX = outerRadius + arrowScaling * innerRadius * Math.cos(Math.PI * (averageSourceAngle / 180));
    const sourceArrowY = outerRadius + arrowScaling * innerRadius * Math.sin(Math.PI * (averageSourceAngle / 180));
    const targetArrowX = outerRadius + innerRadius * Math.cos(Math.PI * (averageTargetAngle / 180));
    const targetArrowY = outerRadius + innerRadius * Math.sin(Math.PI * (averageTargetAngle / 180));

    const targetStartX = outerRadius + arrowScaling * innerRadius * Math.cos(Math.PI * (targetStartAngle / 180));
    const targetStartY = outerRadius + arrowScaling * innerRadius * Math.sin(Math.PI * (targetStartAngle / 180));
    const targetEndX = outerRadius + arrowScaling * innerRadius * Math.cos(Math.PI * (targetEndAngle / 180));
    const targetEndY = outerRadius + arrowScaling * innerRadius * Math.sin(Math.PI * (targetEndAngle / 180));

    const averageX = (sourceStartX + sourceEndX + targetStartX + targetEndX) / 4;
    const averageY = (sourceStartY + sourceEndY + targetStartY + targetEndY) / 4;

    const averageAngle = (sourceStartAngle + sourceEndAngle + targetStartAngle + targetEndAngle) / 4;
    // const widthXOffset = Math.cos(Math.PI * (averageAngle / 180 - 0.5)) * width;
    // const widthYOffset = Math.sin(Math.PI * (averageAngle / 180 - 0.5)) * width;
    const widthXOffset = 0;
    const widthYOffset = 0;

    const sourceEndToTargetStartControlPointX = outerRadius / 2 + averageX / 2 + widthXOffset / 2;
    const sourceEndToTargetStartControlPointY = outerRadius / 2 + averageY / 2 + widthYOffset / 2;

    const targetStartToTargetEndControlPointX = outerRadius / 2 + averageX / 2 - widthXOffset / 2;
    const targetStartToTargetEndControlPointY = outerRadius / 2 + averageY / 2 - widthYOffset / 2;

    let path = '';
    // path components
    // 1. start at the source start point
    path += `M${sourceStartX},${sourceStartY}`;
    // 2. draw a line to the source arrow point and then a line to the source end point
    path += ` L${sourceArrowX},${sourceArrowY} L${sourceEndX},${sourceEndY}`;
    // 3. draw a quadratic curve to the target start point
    path += ` Q${sourceEndToTargetStartControlPointX},${sourceEndToTargetStartControlPointY} ${targetStartX},${targetStartY}`;
    // 4. draw an line to the target arrow point and then a line to the target end point
    path += ` L${targetArrowX},${targetArrowY} L${targetEndX},${targetEndY}`;
    // 5. draw a quadratic curve back to the source start point
    path += ` Q${targetStartToTargetEndControlPointX},${targetStartToTargetEndControlPointY} ${sourceStartX},${sourceStartY}`;

    return path;
  };

  const getLabelPosition = (angle: number) => {
    const labelRadius = outerRadius + 30;
    return {
      x: outerRadius + labelRadius * Math.cos(Math.PI * (angle / 180)),
      y: outerRadius + labelRadius * Math.sin(Math.PI * (angle / 180)),
    };
  };

  const playerTeamMap: {[playerName: string]: string} = Object.fromEntries(chordData.map((entry) => [entry.sourcePlayerName, entry.sourceTeamName]));

  const groupedData = chordData.reduce((acc, entry) => {
    if (!acc[entry.sourcePlayerName]) {
      acc[entry.sourcePlayerName] = [];
    }
    if (!acc[entry.targetPlayerName]) {
      acc[entry.targetPlayerName] = [];
    }
    acc[entry.sourcePlayerName].push(entry);
    return acc;
  }, {} as {[source: string]: ChordDataEntry[]});

  const playerAngles: {[player: string]: {startAngle: number; endAngle: number; value: number; currentValue: number}} = {};
  let currentAngle = 0;
  const totalValue = chordData.reduce((sum, entry) => sum + entry.value, 0) * 2;
  console.log('totalValue', totalValue);

  const players = Array.from(new Set([...chordData.map((entry) => entry.sourcePlayerName), ...chordData.map((entry) => entry.targetPlayerName)]));

  players.forEach((player) => {
    const playerValue = groupedData[player]?.reduce<number>((sum, interaction: ChordDataEntry) => sum + interaction.value, 0) ?? 0;
    const toPlayerValue = Object.values(groupedData).reduce(
      (sum, interactions) => sum + interactions.filter((interaction: ChordDataEntry) => interaction.targetPlayerName === player).reduce<number>((sum2, interaction) => sum2 + interaction.value, 0),
      0,
    );

    const angleSpan = ((playerValue + toPlayerValue) / totalValue) * 360;

    playerAngles[player] = {startAngle: currentAngle + angleSpan / 7, endAngle: currentAngle + (5 * angleSpan) / 7, value: playerValue + toPlayerValue, currentValue: 0};
    currentAngle += angleSpan;
  });

  console.log('playerAngles', playerAngles);

  const handleArcHover = (event: React.MouseEvent<SVGPathElement>) => {
    if (svgRef.current) {
      const path = event.currentTarget;
      const chord = JSON.parse(path.dataset.chord as string) as ChordDataEntry;
      setHoveredArc(chord);
    }
  };

  const handleArcLeave = (event: React.MouseEvent<SVGPathElement>) => {
    if (svgRef.current) {
      const path = event.currentTarget;
      setHoveredArc(null);
    }
  };

  return (
    <div className="chord-diagram-container">
      <svg ref={svgRef} width={outerRadius * 4} height={outerRadius * 4}>
        <g transform={`translate(${outerRadius},${outerRadius})`}>
          {Object.entries(playerAngles).map(([source, angles]) => {
            const {startAngle: sourceStart, endAngle: sourceEnd} = angles;
            const startAngle = sourceStart; //(4 / 5) * sourceStart + (1 / 5) * sourceEnd;
            const endAngle = sourceEnd; //(1 / 5) * sourceStart + (4 / 5) * sourceEnd;
            const startX = outerRadius + innerRadius * Math.cos(Math.PI * (startAngle / 180));
            const startY = outerRadius + innerRadius * Math.sin(Math.PI * (startAngle / 180));
            const endX = outerRadius + innerRadius * Math.cos(Math.PI * (endAngle / 180));
            const endY = outerRadius + innerRadius * Math.sin(Math.PI * (endAngle / 180));
            return (
              <path
                key={source}
                d={`M${startX},${startY} A${innerRadius},${innerRadius} 0 0,1 ${endX},${endY}`}
                fill="none"
                stroke="white"
                strokeWidth={1}
                data-chord={JSON.stringify(angles)}
                onMouseEnter={handleArcHover}
                onMouseLeave={handleArcLeave}
                opacity={hoveredArc && (hoveredArc.sourcePlayerName === source || hoveredArc.targetPlayerName === source) ? 1 : 0.5}
              />
            );
          })}

          {Object.entries(groupedData).map(([source, interactions]) =>
            interactions.map((interaction, index) => {
              console.log('interaction', interaction);
              const {startAngle: sourceStart, endAngle: sourceEnd, value: sourceValue, currentValue: sourceCurrentValue} = playerAngles[source];

              const res = playerAngles[interaction.targetPlayerName];
              const {startAngle: targetStart, endAngle: targetEnd, value: targetValue, currentValue: targetCurrentValue} = res;

              const color = getColorgorical(interaction.sourceTeamName);

              const interactionSourceStartAngle = sourceStart + (sourceCurrentValue / sourceValue) * (sourceEnd - sourceStart);
              const interactionSourceEndAngle = sourceStart + ((sourceCurrentValue + interaction.value) / sourceValue) * (sourceEnd - sourceStart);
              const interactionTargetStartAngle = targetStart + (targetCurrentValue / targetValue) * (targetEnd - targetStart);
              const interactionTargetEndAngle = targetStart + ((targetCurrentValue + interaction.value) / targetValue) * (targetEnd - targetStart);

              playerAngles[source].currentValue += interaction.value;
              playerAngles[interaction.targetPlayerName].currentValue += interaction.value;

              const arcWidth = interaction.value * 20;

              const sourceAverageAngle = (interactionSourceStartAngle + interactionSourceStartAngle) / 2;

              const sourceLabelX = outerRadius; // + 0.92 * innerRadius * Math.cos(Math.PI * (sourceAverageAngle / 180));
              const sourceLabelY = outerRadius; // + 0.92 * innerRadius * Math.sin(Math.PI * (sourceAverageAngle / 180));

              const targetAverageAngle = (interactionTargetStartAngle + interactionTargetEndAngle) / 2;

              const targetLabelX = outerRadius + 0.92 * innerRadius * Math.cos(Math.PI * (targetAverageAngle / 180));
              const targetLabelY = outerRadius + 0.92 * innerRadius * Math.sin(Math.PI * (targetAverageAngle / 180));

              return (
                <g key={`${source}-${interaction.targetPlayerName}-${index}`}>
                  <path
                    key={`${source}-${interaction.targetPlayerName}-${index}`}
                    d={getArcPath(interactionSourceStartAngle, interactionSourceEndAngle, interactionTargetStartAngle, interactionTargetEndAngle, arcWidth)}
                    fill={color}
                    stroke="white"
                    strokeWidth={1}
                    data-chord={JSON.stringify(interaction)}
                    onMouseEnter={handleArcHover}
                    onMouseLeave={handleArcLeave}
                    opacity={hoveredArc && hoveredArc.sourcePlayerName === source && hoveredArc.targetPlayerName === interaction.targetPlayerName ? 1 : 0.1}
                  />
                  {hoveredArc && hoveredArc.sourcePlayerName === source && hoveredArc.targetPlayerName === interaction.targetPlayerName && (
                    <text key={`${source}-${interaction.targetPlayerName}-${index}-label`} x={sourceLabelX} y={sourceLabelY} fontSize="0.7em" textAnchor="middle" dominantBaseline="central" fill="white">
                      {interaction.value} kills on {interaction.targetPlayerName} by {interaction.sourcePlayerName}
                    </text>
                  )}
                </g>
              );
            }),
          )}

          {Object.keys(playerAngles).map((player) => {
            const {startAngle, endAngle} = playerAngles[player];
            const labelAngle = (startAngle + endAngle) / 2;
            const {x, y} = getLabelPosition(labelAngle);
            return (
              <text key={player} x={x} y={y} textAnchor="middle" dominantBaseline="central" fill={getColorgorical(playerTeamMap[player])}>
                {player}
              </text>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default ChordDiagram;

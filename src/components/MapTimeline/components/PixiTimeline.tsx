import React, { memo } from 'react';
import { Container, Text, Graphics } from '@pixi/react';
import * as PIXI from 'pixi.js';
import { TimelineData, TimelineDimensions } from '../types/timeline.types';
import { EVENT_TYPE_TO_COLOR, INTERACTION_EVENT_TYPE_TO_COLOR, COLORS } from '../constants/timeline.constants';

interface PixiTimelineProps {
  width: number;
  height: number;
  timelineData: TimelineData;
  dimensions: TimelineDimensions;
}

const parseColor = (colorStr: string) => parseInt(colorStr.replace('#', '0x'));

const drawPlayerRow = (g: PIXI.Graphics, events: any[], interactionEvents: any[], ultimateEvents: any[], timeToX: (t: number) => number, y: number) => {
  g.clear();

  // Draw ultimate bars first (background)
  ultimateEvents.forEach(event => {
    const startX = timeToX(event.ultimateChargedTime);
    const endX = timeToX(event.ultimateEndTime);
    const width = endX - startX;

    // Charging bar
    g.beginFill(parseColor(COLORS.ultimate.color), COLORS.ultimate.alpha * 0.6);
    g.drawRect(startX, y - 5, width, 10);

    // Active bar
    if (event.ultimateStartTime) {
      const activeStartX = timeToX(event.ultimateStartTime);
      const activeWidth = endX - activeStartX;
      g.beginFill(parseColor(COLORS.ultimate.color), COLORS.ultimate.alpha);
      g.drawRect(activeStartX, y - 5, activeWidth, 10);
    }
  });

  // Draw regular events
  events.forEach(event => {
    const colorConfig = EVENT_TYPE_TO_COLOR[event.playerEventType];
    if (colorConfig) {
      const x = timeToX(event.playerEventTime);
      g.beginFill(parseColor(colorConfig.color), colorConfig.alpha);
      g.drawCircle(x, y, 3);
    }
  });

  // Draw interaction events
  interactionEvents.forEach(event => {
    const colorConfig = INTERACTION_EVENT_TYPE_TO_COLOR[event.playerInteractionEventType];
    if (colorConfig) {
      const x = timeToX(event.playerInteractionEventTime);
      g.beginFill(parseColor(colorConfig.color), colorConfig.alpha);
      g.drawCircle(x, y, 3);
    }
  });

  g.endFill();
};

const drawUltimateAdvantageChart = (g: PIXI.Graphics, data: any[], timeToX: (t: number) => number, width: number) => {
  const maxUltCount = Math.max(
    ...data.map(d => Math.max(d.team1ChargedUltimateCount, d.team2ChargedUltimateCount))
  );
  const scale = 30 / maxUltCount;

  g.clear();

  // Draw center line
  g.lineStyle(1, 0x666666, 0.2);
  g.moveTo(0, 30);
  g.lineTo(width, 30);

  // Draw bars
  data.forEach((d, i) => {
    const nextEvent = data[i + 1];
    const x = timeToX(d.matchTime);
    const width = nextEvent ? timeToX(nextEvent.matchTime) - x : 0;

    // Team 1 bar (top)
    g.beginFill(0x4caf50, 0.6);
    g.drawRect(x, 30 - d.team1ChargedUltimateCount * scale, width, d.team1ChargedUltimateCount * scale);

    // Team 2 bar (bottom)
    g.beginFill(0xf44336, 0.6);
    g.drawRect(x, 30, width, d.team2ChargedUltimateCount * scale);
  });
  g.endFill();

  // Draw advantage line
  g.lineStyle(2, 0xFFFFFF, 0.8);
  data.forEach((d, i) => {
    const x = timeToX(d.matchTime);
    const diff = d.team1ChargedUltimateCount - d.team2ChargedUltimateCount;
    const y = 30 - (diff * scale);

    if (i === 0) {
      g.moveTo(x, y);
    } else {
      g.lineTo(x, y);
    }
  });
};

const textStyle = new PIXI.TextStyle({
  fontFamily: 'Arial',
  fontSize: 14,
  fill: '#ffffff',
});

const headerStyle = new PIXI.TextStyle({
  fontFamily: 'Arial',
  fontSize: 18,
  fontWeight: 'bold',
  fill: '#ffffff',
});

const roundLabelStyle = new PIXI.TextStyle({
  fontFamily: 'Arial',
  fontSize: 12,
  fill: '#ffffff',
  align: 'center',
});

export const PixiTimeline = memo<PixiTimelineProps>(({
  width,
  height,
  timelineData,
  dimensions
}) => {
  const rowHeight = 20;
  const labelWidth = 150;
  const team1PlayerCount = Object.keys(timelineData.team1EventsByPlayer).length;
  const team2PlayerCount = Object.keys(timelineData.team2EventsByPlayer).length;
  const xAxisHeight = 100;
  const padding = 20; // Add padding between sections

  // Calculate section heights
  const team1Height = team1PlayerCount * rowHeight;
  const team2Height = team2PlayerCount * rowHeight;
  const totalContentHeight = team1Height + team2Height + xAxisHeight + (padding * 2); // Add padding

  return (
    <Container>
      {/* Team 1 Section */}
      <Container y={0}>
        {/* Team 1 Header */}
        <Text
          text={timelineData.team1Name}
          style={headerStyle}
          x={5}
          y={0}
        />

        {/* Team 1 Rows */}
        <Container y={30}>
          {Object.entries(timelineData.team1EventsByPlayer).map(([playerName, events], index) => (
            <Container key={`team1-${playerName}`} y={index * rowHeight}>
              <Text
                text={playerName}
                style={textStyle}
                x={5}
                y={0}
              />
              <Graphics
                x={labelWidth}
                draw={g => drawPlayerRow(
                  g,
                  events,
                  timelineData.team1InteractionEventsByPlayer[playerName] || [],
                  timelineData.team1UltimateEventsByPlayer[playerName] || [],
                  dimensions.timeToXWindow,
                  rowHeight / 2
                )}
              />
            </Container>
          ))}
        </Container>
      </Container>

      {/* Team 2 Section */}
      <Container y={team1Height + padding}>
        {/* Team 2 Header */}
        <Text
          text={timelineData.team2Name}
          style={headerStyle}
          x={5}
          y={0}
        />

        {/* Team 2 Rows */}
        <Container y={30}>
          {Object.entries(timelineData.team2EventsByPlayer).map(([playerName, events], index) => (
            <Container key={`team2-${playerName}`} y={index * rowHeight}>
              <Text
                text={playerName}
                style={textStyle}
                x={5}
                y={0}
              />
              <Graphics
                x={labelWidth}
                draw={g => drawPlayerRow(
                  g,
                  events,
                  timelineData.team2InteractionEventsByPlayer[playerName] || [],
                  timelineData.team2UltimateEventsByPlayer[playerName] || [],
                  dimensions.timeToXWindow,
                  rowHeight / 2
                )}
              />
            </Container>
          ))}
        </Container>
      </Container>

      {/* X-Axis Section */}
      <Container y={team1Height + team2Height + (padding * 2)}>
        {/* Round sections */}
        <Graphics
          draw={g => {
            g.clear();
            timelineData.roundTimes.forEach(round => {
              // Setup section
              g.beginFill(0x882222, 0.3);
              g.drawRect(
                dimensions.timeToX(round.roundStartTime),
                0,
                dimensions.timeToX(round.roundSetupCompleteTime) - dimensions.timeToX(round.roundStartTime),
                10
              );
              // Active section
              g.beginFill(0x4CAF50, 0.3);
              g.drawRect(
                dimensions.timeToX(round.roundSetupCompleteTime),
                0,
                dimensions.timeToX(round.roundEndTime) - dimensions.timeToX(round.roundSetupCompleteTime),
                10
              );
            });
          }}
        />

        {/* Round labels */}
        {timelineData.roundTimes.map((round, index) => (
          <Text
            key={`round-${index}`}
            text={`Round ${index + 1}`}
            style={roundLabelStyle}
            x={dimensions.timeToX(round.roundStartTime)}
            y={12}
            anchor={new PIXI.Point(0.5, 0)}
          />
        ))}

        {/* Ultimate advantage chart */}
        <Graphics
          y={30}
          draw={g => drawUltimateAdvantageChart(g, timelineData.ultimateAdvantageData, dimensions.timeToX, width)}
        />

        {/* Event markers */}
        <Graphics
          y={90}
          draw={g => {
            g.clear();
            g.beginFill(0xFFFFFF, 0.2);
            timelineData.eventTimes.forEach(time => {
              g.drawRect(dimensions.timeToX(time), 0, 1, 10);
            });
            g.endFill();
          }}
        />
      </Container>
    </Container>
  );
});

PixiTimeline.displayName = 'PixiTimeline'; 
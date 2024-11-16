import React from 'react';
import { TimelineRowConfig } from '../types/row.types';
import { PlayerTimelineRow } from '../components/rows/PlayerTimelineRow';
import { RoundTimelineRow } from '../components/rows/RoundTimelineRow';
import { UltimateAdvantageRow } from '../components/rows/UltimateAdvantageRow';
import { EventMapRow } from '../components/rows/EventMapRow';
import { HeaderRow } from '../components/rows/HeaderRow';
import { TimeLabelsRow } from '../components/rows/TimeLabelsRow';
import { TimelineData, TimelineDimensions } from '../types/timeline.types';

interface RenderTimelineRowProps {
  config: TimelineRowConfig;
  index: number;
  configs: TimelineRowConfig[];
  timelineData: TimelineData | null;
  dimensions: TimelineDimensions;
  labelWidth: number;
  setLabelWidth: (width: number) => void;
  handleDeleteRow: (id: string) => void;
}

export const renderTimelineRow = ({
  config,
  index,
  configs,
  timelineData,
  dimensions,
  labelWidth,
  setLabelWidth,
  handleDeleteRow,
}: RenderTimelineRowProps) => {
  if (!timelineData) return null;

  const y = configs.slice(0, index).reduce((sum, prevConfig) => sum + prevConfig.height, 0);

  if (config.type === 'spacing') {
    return null;
  }

  const commonProps = {
    width: dimensions.width || 0,
    height: config.height,
    y,
    dimensions,
    labelWidth,
    onLabelWidthChange: setLabelWidth,
    onDelete: () => handleDeleteRow(config.id),
  };

  switch (config.type) {
    case 'player':
      return (
        <PlayerTimelineRow
          key={config.id}
          {...commonProps}
          label={config.data.playerName}
          playerName={config.data.playerName}
          events={timelineData[`${config.data.team}EventsByPlayer`]?.[config.data.playerName] ?? []}
          interactionEvents={timelineData[`${config.data.team}InteractionEventsByPlayer`]?.[config.data.playerName] ?? []}
          ultimateEvents={timelineData[`${config.data.team}UltimateEventsByPlayer`]?.[config.data.playerName] ?? []}
          useWindowScale={config.useWindowScale}
        />
      );

    case 'round':
      return (
        <RoundTimelineRow
          key={config.id}
          {...commonProps}
          label="Rounds"
          timelineData={timelineData}
          useWindowScale={config.useWindowScale}
        />
      );

    case 'ultimateAdvantage':
      return (
        <UltimateAdvantageRow
          key={config.id}
          {...commonProps}
          label="Ultimate Advantage"
          timelineData={timelineData}
          useWindowScale={config.useWindowScale}
        />
      );

    case 'eventMap':
      return (
        <EventMapRow
          key={config.id}
          {...commonProps}
          label="Events"
          timelineData={timelineData}
          useWindowScale={config.useWindowScale}
          height={20} // Increase height for better visibility
        />
      );

    case 'header':
      return (
        <HeaderRow
          key={config.id}
          {...commonProps}
          label={config.data.text}
          text=""
        />
      );

    case 'timeLabels':
      return (
        <TimeLabelsRow
          key={config.id}
          {...commonProps}
          label=""
          useWindowScale={config.useWindowScale}
        />
      );

    default:
      return null;
  }
}; 
import React, {useRef, useState, useEffect} from 'react';
import {useDataManager} from '../../WombatDataFramework/DataContext';
import {MatchStart} from '../../WombatDataFramework/DataNodeDefinitions';
import {Grid, Tooltip, Typography} from '@mui/material';
import GrimReaperIcon from '../Icons/GrimReaperIcon';
import MacheteIcon from '../Icons/MacheteIcon';
import UpCardIcon from '../Icons/UpCardIcon';
import GhostAllyIcon from '../Icons/GhostAllyIcon';
import BeamsAuraIcon from '../Icons/BeamsAuraIcon';
import useWindowSize from '../../hooks/useWindowSize';
import ChordDiagram from '../ChordDiagram/ChordDiagram';

const ultimateColor = '#42c2f5';
const killColor = '#f44336';
const spawnColor = '#4caf50';
const assistColor = '#009688';

const interactionEventTypeToIcon: {[interactionEventType: string]: React.ReactNode} = {
  Died: <GrimReaperIcon size={16} />,
  'Killed player': <MacheteIcon size={16} />,
  Resurrected: <UpCardIcon size={16} />,
};

const eventTypeToColor: {[eventType: string]: string} = {
  Spawn: spawnColor,
  Swap: spawnColor,
  'Ability 1 Used': ultimateColor,
  'Ability 2 Used': ultimateColor,
  'Offensive Assist': assistColor,
  'Defensive Assist': assistColor,
};

const interactionEventTypeToColor: {[interactionEventType: string]: string} = {
  Died: killColor,
  'Killed player': killColor,
  Resurrected: spawnColor,
};

const eventTypeToIcon: {[eventType: string]: React.ReactNode} = {
  Spawn: <BeamsAuraIcon size={16} />,
  Swap: <GhostAllyIcon size={16} />,
  'Ability 1 Used': 'Used Ability 1',
  'Ability 2 Used': 'Used Ability 2',
  'Offensive Assist': 'A',
  'Defensive Assist': 'A',
};

const TimelineEvent: React.FC<{
  time: number;
  timeToX: (time: number) => number;
  color: string;
  icon: React.ReactNode;
  tooltipTitle: string;
}> = ({time, timeToX, color, icon, tooltipTitle}) => (
  <Tooltip title={tooltipTitle} arrow>
    <div
      style={{
        left: timeToX(time),
        top: 5,
        position: 'absolute',
        color: color || 'white',
      }}>
      {icon || '?'}
    </div>
  </Tooltip>
);

const TimelineInteractionEvent: React.FC<{
  time: number;
  timeToX: (time: number) => number;
  color: string;
  icon: React.ReactNode;
  tooltipTitle: string;
}> = ({time, timeToX, color, icon, tooltipTitle}) => (
  <Tooltip title={tooltipTitle} arrow>
    <div
      style={{
        left: timeToX(time),
        top: 2,
        position: 'absolute',
        color: color || 'white',
        fill: color || 'white',
      }}>
      {icon || '?'}
    </div>
  </Tooltip>
);

const UltimateBar: React.FC<{
  startTime: number;
  endTime: number;
  chargedTime: number;
  timeToX: (time: number) => number;
  windowStartTime: number;
  windowEndTime: number;
}> = ({startTime, endTime, chargedTime, timeToX, windowStartTime, windowEndTime}) => (
  <div>
    {startTime >= windowStartTime && (
      <div
        style={{
          left: timeToX(Math.max(chargedTime, windowStartTime)),
          width: timeToX(Math.min(startTime, windowEndTime)) - timeToX(Math.max(chargedTime, windowStartTime)),
          top: 5,
          height: 10,
          position: 'absolute',
          backgroundColor: ultimateColor + '50',
        }}
      />
    )}
    {startTime <= windowEndTime && (
      <div
        style={{
          left: timeToX(Math.max(startTime, windowStartTime)),
          width: timeToX(Math.min(endTime, windowEndTime)) - timeToX(Math.max(startTime, windowStartTime)),
          top: 5,
          height: 10,
          position: 'absolute',
          backgroundColor: ultimateColor,
        }}
      />
    )}
  </div>
);

const TimelineRow: React.FC<{
  width: number;
  events: object[];
  interactionEvents: object[];
  ultimateEvents: object[];
  timeToX: (time: number) => number;
  windowStartTime: number;
  windowEndTime: number;
}> = ({width, events, interactionEvents, ultimateEvents, timeToX, windowStartTime, windowEndTime}) => (
  <div
    style={{
      width: width,
      height: 20,
      position: 'relative',
    }}>
    <div style={{width: 1, height: 20, backgroundColor: 'grey', position: 'absolute', left: 0}} />
    {ultimateEvents
      .filter((row) => row['ultimateEndTime'] >= windowStartTime && row['ultimateChargedTime'] <= windowEndTime)
      .map((row, index) => (
        <UltimateBar
          key={index + '-ultimate'}
          startTime={row['ultimateStartTime']}
          endTime={row['ultimateEndTime']}
          chargedTime={row['ultimateChargedTime']}
          timeToX={timeToX}
          windowStartTime={windowStartTime}
          windowEndTime={windowEndTime}
        />
      ))}
    {events
      .filter((row) => row['playerEventTime'] >= windowStartTime && row['playerEventTime'] <= windowEndTime)
      .map((row, index) => (
        <TimelineEvent
          key={index + '-event'}
          time={row['playerEventTime']}
          timeToX={timeToX}
          color={eventTypeToColor[row['playerEventType']] || 'white'}
          icon={eventTypeToIcon[row['playerEventType']] || '?'}
          tooltipTitle={row['playerEventType'] + ': ' + row['playerHero']}
        />
      ))}
    {interactionEvents
      .filter((row) => row['playerInteractionEventTime'] >= windowStartTime && row['playerInteractionEventTime'] <= windowEndTime)
      .map((row, index) => (
        <TimelineInteractionEvent
          key={index + '-interaction'}
          time={row['playerInteractionEventTime']}
          timeToX={timeToX}
          color={interactionEventTypeToColor[row['playerInteractionEventType']] || 'white'}
          icon={interactionEventTypeToIcon[row['playerInteractionEventType']] || '?'}
          tooltipTitle={row['playerInteractionEventType'] + ': ' + row['otherPlayerName']}
        />
      ))}
  </div>
);

const XAxis: React.FC<{
  width: number;
  timeToX: (time: number) => number;
  xToTime: (x: number) => number;
  mapStartTime: number;
  mapEndTime: number;
  roundTimes: {roundStartTime: number; roundSetupCompleteTime: number; roundEndTime: number}[];
  windowStartTime: number;
  setWindowStartTime: (time: number) => void;
  windowEndTime: number;
  setWindowEndTime: (time: number) => void;
  eventTimes: number[];
}> = ({width, timeToX, xToTime, mapStartTime, mapEndTime, roundTimes, windowStartTime, setWindowStartTime, windowEndTime, setWindowEndTime, eventTimes}) => {
  const [dragging, setDragging] = useState<null | 'start' | 'end'>(null);
  const lastUpdateTimestamp = useRef(Date.now());
  const currentTime = useRef(0);
  const [innerWindowStartTime, setInnerWindowStartTime] = useState<number>(windowStartTime);
  const [innerWindowEndTime, setInnerWindowEndTime] = useState<number>(windowEndTime);

  useEffect(() => {
    setInnerWindowStartTime(windowStartTime);
    setInnerWindowEndTime(windowEndTime);
  }, [windowStartTime, windowEndTime]);

  const handleMouseDown = (e: React.MouseEvent, type: 'start' | 'end') => {
    setDragging(type);
    if (type === 'start') {
      currentTime.current = windowStartTime;
    } else {
      currentTime.current = windowEndTime;
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;

    const newTime = xToTime(e.movementX);

    if (dragging === 'start') {
      currentTime.current = Math.round(Math.max(mapStartTime, Math.min(windowEndTime, currentTime.current + newTime)));
      setInnerWindowStartTime(currentTime.current);
    } else {
      currentTime.current = Math.round(Math.min(mapEndTime, Math.max(windowStartTime, currentTime.current + newTime)));
      setInnerWindowEndTime(currentTime.current);
    }

    if (Date.now() - lastUpdateTimestamp.current > 50) {
      if (dragging === 'start') {
        setWindowStartTime(currentTime.current);
      } else {
        setWindowEndTime(currentTime.current);
      }
      lastUpdateTimestamp.current = Date.now();
    }
  };

  return (
    <div
      style={{
        width,
        height: 100,
        position: 'relative',
      }}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}>
      <div
        style={{
          width: timeToX(mapEndTime),
          left: timeToX(mapStartTime),
          top: 0,
          height: 1,
          backgroundColor: 'grey',
          position: 'absolute',
        }}
      />
      {roundTimes.map((round, index) => (
        <div key={index + '-round'}>
          <div
            style={{
              left: timeToX(round.roundStartTime),
              top: 0,
              width: timeToX(round.roundSetupCompleteTime) - timeToX(round.roundStartTime),
              height: 10,
              backgroundColor: '#88222250',
              position: 'absolute',
            }}
          />
          <div
            style={{
              left: timeToX(round.roundSetupCompleteTime),
              top: 0,
              width: timeToX(round.roundEndTime) - timeToX(round.roundSetupCompleteTime),
              height: 10,
              backgroundColor: '#4caf5050',
              position: 'absolute',
            }}
          />
          <Typography
            variant="body2"
            style={{
              left: timeToX(round.roundStartTime),
              top: 10,
              position: 'absolute',
              transform: 'translateX(-50%)',
            }}>
            Round {index + 1}
          </Typography>
        </div>
      ))}
      <div
        style={{
          left: timeToX(mapStartTime),
          top: 0,
          width: 1,
          height: 10,
          backgroundColor: 'grey',
          position: 'absolute',
        }}
      />
      <div
        style={{
          left: timeToX(mapEndTime),
          top: 0,
          width: 1,
          height: 10,
          backgroundColor: 'grey',
          position: 'absolute',
        }}
      />
      <div
        style={{
          left: timeToX(innerWindowStartTime),
          top: 10,
          position: 'absolute',
          cursor: 'ew-resize',
          userSelect: 'none',
          borderLeft: '1px solid grey',
          paddingLeft: 2,
        }}
        onMouseDown={(e) => handleMouseDown(e, 'start')}>
        {windowStartTime}
      </div>

      <div
        style={{
          left: timeToX(innerWindowEndTime),
          top: 10,
          position: 'absolute',
          cursor: 'ew-resize',
          userSelect: 'none',
          borderLeft: '1px solid grey',
          paddingLeft: 2,
        }}
        onMouseDown={(e) => handleMouseDown(e, 'end')}>
        {windowEndTime}
      </div>
      {eventTimes.map((time, index) => (
        <div
          key={index + '-time'}
          style={{
            left: timeToX(time),
            top: 0,
            width: 1,
            height: 10,
            backgroundColor: 'white',
            opacity: 0.2,
            position: 'absolute',
          }}
        />
      ))}
      <div
        style={{
          width: timeToX(innerWindowEndTime) - timeToX(innerWindowStartTime),
          left: timeToX(innerWindowStartTime),
          top: 0,
          height: 10,
          backgroundColor: 'grey',
          opacity: 0.2,
          position: 'absolute',
        }}
      />
    </div>
  );
};

const MapTimeline: React.FC<{mapId: number}> = ({mapId}) => {
  const dataManager = useDataManager();

  const [windowStartTime, setWindowStartTime] = useState<number>(0);
  const [windowEndTime, setWindowEndTime] = useState<number>(100);
  const gridRef = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState<number>(900); // width - 150 to account for the grid padding
  const {width: windowWidth} = useWindowSize();

  useEffect(() => {
    if (dataManager.getNodeOutput('map_times').filter((row) => row['mapId'] === mapId).length === 0) {
      return;
    }
    const {mapStartTime, mapEndTime} = dataManager.getNodeOutput('map_times').filter((row) => row['mapId'] === mapId)[0] as {mapStartTime: number; mapEndTime: number};

    setWindowStartTime(mapStartTime);
    setWindowEndTime(mapEndTime);
  }, [mapId, dataManager.hasNodeOutput('map_times')]);

  useEffect(() => {
    if (!gridRef.current) {
      return;
    }
    const grid = gridRef.current;
    const gridWidth = grid.clientWidth;
    setWidth(gridWidth - 150);
  }, [gridRef, windowWidth]);

  if (
    !dataManager.hasNodeOutput('match_start_object_store') ||
    !dataManager.hasNodeOutput('player_events') ||
    !dataManager.hasNodeOutput('player_interaction_events') ||
    !dataManager.hasNodeOutput('round_times') ||
    !dataManager.hasNodeOutput('ultimate_events') ||
    !dataManager.hasNodeOutput('map_times')
  ) {
    return <div />;
  }

  const {team1Name, team2Name} = dataManager.getNodeOutput('match_start_object_store').filter((row) => row['mapId'] === mapId)[0] as MatchStart;
  const playerEvents = dataManager.getNodeOutput('player_events').filter((row) => row['mapId'] === mapId);
  const interactionEvents = dataManager.getNodeOutput('player_interaction_events').filter((row) => row['mapId'] === mapId);
  const ultimateEvents = dataManager.getNodeOutput('ultimate_events').filter((row) => row['mapId'] === mapId);
  const roundTimes = dataManager.getNodeOutput('round_times').filter((row) => row['mapId'] === mapId);

  const team1Events = playerEvents.filter((row) => row['playerTeam'] === team1Name);
  const team2Events = playerEvents.filter((row) => row['playerTeam'] === team2Name);
  const team1InteractionEvents = interactionEvents.filter((row) => row['playerTeam'] === team1Name);
  const team2InteractionEvents = interactionEvents.filter((row) => row['playerTeam'] === team2Name);
  const team1UltimateEvents = ultimateEvents.filter((row) => row['playerTeam'] === team1Name);
  const team2UltimateEvents = ultimateEvents.filter((row) => row['playerTeam'] === team2Name);

  const {mapStartTime, mapEndTime} = dataManager.getNodeOutput('map_times').filter((row) => row['mapId'] === mapId)[0] as {mapStartTime: number; mapEndTime: number};

  const timeToX = (time: number) => {
    return ((time - mapStartTime) / (mapEndTime - mapStartTime)) * width;
  };

  const timeToXWindow = (time: number) => {
    return ((time - windowStartTime) / (windowEndTime - windowStartTime)) * width;
  };

  const xToTime = (x: number) => {
    return (x / width) * (mapEndTime - mapStartTime) + mapStartTime;
  };

  const xToTimeWindow = (x: number) => {
    return (x / width) * (windowEndTime - windowStartTime) + windowStartTime;
  };

  const eventTimes = [...playerEvents.map((row) => row['playerEventTime']), ...interactionEvents.map((row) => row['playerInteractionEventTime'])];

  const team1EventsByPlayerName: {[playerName: string]: object[]} = {};
  const team2EventsByPlayerName: {[playerName: string]: object[]} = {};
  const team1InteractionEventsByPlayerName: {[playerName: string]: object[]} = {};
  const team2InteractionEventsByPlayerName: {[playerName: string]: object[]} = {};
  const team1UltimateEventsByPlayerName: {[playerName: string]: object[]} = {};
  const team2UltimateEventsByPlayerName: {[playerName: string]: object[]} = {};

  for (const event of team1Events) {
    const playerName = event['playerName'];
    if (!team1EventsByPlayerName[playerName]) {
      team1EventsByPlayerName[playerName] = [];
    }
    team1EventsByPlayerName[playerName].push(event);
  }

  for (const event of team2Events) {
    const playerName = event['playerName'];
    if (!team2EventsByPlayerName[playerName]) {
      team2EventsByPlayerName[playerName] = [];
    }
    team2EventsByPlayerName[playerName].push(event);
  }

  for (const event of team1InteractionEvents) {
    const playerName = event['playerName'];
    if (!team1InteractionEventsByPlayerName[playerName]) {
      team1InteractionEventsByPlayerName[playerName] = [];
    }
    team1InteractionEventsByPlayerName[playerName].push(event);
  }

  for (const event of team2InteractionEvents) {
    const playerName = event['playerName'];
    if (!team2InteractionEventsByPlayerName[playerName]) {
      team2InteractionEventsByPlayerName[playerName] = [];
    }
    team2InteractionEventsByPlayerName[playerName].push(event);
  }

  for (const event of team1UltimateEvents) {
    const playerName = event['playerName'];
    if (!team1UltimateEventsByPlayerName[playerName]) {
      team1UltimateEventsByPlayerName[playerName] = [];
    }
    team1UltimateEventsByPlayerName[playerName].push(event);
  }

  for (const event of team2UltimateEvents) {
    const playerName = event['playerName'];
    if (!team2UltimateEventsByPlayerName[playerName]) {
      team2UltimateEventsByPlayerName[playerName] = [];
    }
    team2UltimateEventsByPlayerName[playerName].push(event);
  }

  const eventsToShow = playerEvents.filter((row) => row['playerEventTime'] >= windowStartTime && row['playerEventTime'] <= windowEndTime).slice(0, 10);

  return (
    <div>
      <Grid container spacing={1}>
        <Grid item xs={8} ref={gridRef}>
          <div>
            <Typography variant="h4">{team1Name}</Typography>
            {Object.entries(team1EventsByPlayerName).map(([playerName, events]) => (
              <Grid container key={playerName} spacing={1}>
                <Grid item xs={2} style={{textAlign: 'right'}}>
                  <Typography variant="h6">{playerName}</Typography>
                </Grid>
                <Grid item xs={10}>
                  <TimelineRow
                    width={width}
                    events={events}
                    interactionEvents={team1InteractionEventsByPlayerName[playerName]}
                    ultimateEvents={team1UltimateEventsByPlayerName[playerName]}
                    windowStartTime={windowStartTime}
                    windowEndTime={windowEndTime}
                    timeToX={timeToXWindow}
                  />
                </Grid>
              </Grid>
            ))}
          </div>
          <div>
            <Typography variant="h4">{team2Name}</Typography>
            {Object.entries(team2EventsByPlayerName).map(([playerName, events]) => (
              <Grid container key={playerName} spacing={1}>
                <Grid item xs={2} style={{textAlign: 'right'}}>
                  <Typography variant="h6">{playerName}</Typography>
                </Grid>
                <Grid item xs={10}>
                  <TimelineRow
                    width={width}
                    events={events}
                    interactionEvents={team2InteractionEventsByPlayerName[playerName]}
                    ultimateEvents={team2UltimateEventsByPlayerName[playerName]}
                    windowStartTime={windowStartTime}
                    windowEndTime={windowEndTime}
                    timeToX={timeToXWindow}
                  />
                </Grid>
              </Grid>
            ))}
          </div>
          <Grid container spacing={1}>
            <Grid item xs={2}></Grid>
            <Grid item xs={10}>
              <XAxis
                eventTimes={eventTimes}
                width={width}
                timeToX={timeToX}
                xToTime={xToTime}
                mapStartTime={mapStartTime}
                mapEndTime={mapEndTime}
                roundTimes={roundTimes as {roundStartTime: number; roundSetupCompleteTime: number; roundEndTime: number}[]}
                windowStartTime={windowStartTime}
                setWindowStartTime={setWindowStartTime}
                windowEndTime={windowEndTime}
                setWindowEndTime={setWindowEndTime}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h6">Recent Events:</Typography>
          <ul>
            {eventsToShow.map((event, index) => (
              <li key={index}>
                {event['playerEventTime']}: {event['playerEventType']} - {event['playerName']} ({event['playerHero']})
              </li>
            ))}
          </ul>
        </Grid>
      </Grid>
      <ChordDiagram mapId={mapId} />
    </div>
  );
};

export default MapTimeline;

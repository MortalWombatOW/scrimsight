import { useAtomValue } from "jotai";
import { Canvas } from "@react-three/fiber";
import { Text as TextThree } from "@react-three/drei";
import { useElementSize, useMouse } from "@mantine/hooks";
import { Paper, Stack } from "@mantine/core";
import {
  MatchData,
  mapTimesAtom,
  playerEventsAtom,
  playerInteractionEventsAtom,
} from "../../../../atoms";
import { PlayerEventThree } from "./PlayerEventThree";
import { PlayerInteractionEventThree } from "./PlayerInteractionEventThree";

interface TimelineProps {
  matchData: MatchData;
}

export const Timeline = ({ matchData }: TimelineProps) => {
  const mapTimes = useAtomValue(mapTimesAtom).find(
    (match) => match.matchId === matchData.matchId
  );
  const playerEvents = useAtomValue(playerEventsAtom).filter(
    (event) => event.matchId === matchData.matchId
  );
  const playerInteractionEvents = useAtomValue(
    playerInteractionEventsAtom
  ).filter((event) => event.matchId === matchData.matchId);

  const { ref, width } = useElementSize();

  const maxTime = mapTimes?.endTime ?? 0;
  const minTime = mapTimes?.startTime ?? 0;
  const timeRange = maxTime - minTime;
  const leftOffset = 90;
  const topOffset = 40;

  const playerOrder = [...matchData.team1Players, ...matchData.team2Players];
  const height = playerOrder.length * 50 + topOffset;

  const getX = (time: number) =>
    ((time - minTime) / timeRange) * (width - leftOffset) -
    width / 2 +
    leftOffset;
  const getY = (playerName: string) =>
    playerOrder.findIndex((player) => player === playerName) * 50 +
    topOffset -
    height / 2;

  const { ref: mouseRef, x: mouseX } = useMouse();

  const distanceThreshold = (5 / timeRange) * (width - leftOffset);

  const pointsInRange = (x: number, range: number) => {
    const mouseXDistance = Math.abs(mouseX - x - width / 2);
    return mouseXDistance < range;
  };

  const highlightedEvents = playerEvents.filter((event) =>
    pointsInRange(getX(event.playerEventTime), distanceThreshold)
  );

  const highlightedInteractionEvents = playerInteractionEvents.filter((event) =>
    pointsInRange(getX(event.playerInteractionEventTime), distanceThreshold)
  );

  return (
    <Paper withBorder p="md">
      <Stack
        pos="relative"
        h={playerOrder.length * 50 + topOffset}
        ref={mouseRef}
      >
        <Canvas orthographic ref={ref}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          {playerOrder.map((player) => (
            <TextThree
              key={player}
              scale={12}
              position={[getX(0) - 10, getY(player), 0]}
              color="white"
              anchorX="right"
              anchorY="middle"
            >
              {player}
            </TextThree>
          ))}
          {playerEvents.map((event) => {
            const isHighlighted = highlightedEvents.includes(event);
            return (
              <PlayerEventThree
                key={JSON.stringify(event)}
                event={event}
                getX={getX}
                getY={getY}
                isHighlighted={isHighlighted}
              />
            );
          })}
          {playerInteractionEvents.map((event) => {
            const isHighlighted = highlightedInteractionEvents.includes(event);
            return (
              <PlayerInteractionEventThree
                key={JSON.stringify(event)}
                event={event}
                getX={getX}
                getY={getY}
                matchData={matchData}
                isHighlighted={isHighlighted}
              />
            );
          })}
        </Canvas>
      </Stack>
    </Paper>
  );
};

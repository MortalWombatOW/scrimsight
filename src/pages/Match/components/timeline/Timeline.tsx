import { useAtomValue } from "jotai";
import { Canvas } from "@react-three/fiber";
import { Text as TextThree } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
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

// Custom hook to replace useElementSize from Mantine
const useElementSize = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const updateSize = () => {
      if (ref.current) {
        setWidth(ref.current.offsetWidth);
        setHeight(ref.current.offsetHeight);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  return { ref, width, height };
};

// Custom hook to replace useMouse from Mantine
const useMouse = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setX(event.clientX - rect.left);
        setY(event.clientY - rect.top);
      }
    };

    const element = ref.current;
    if (element) {
      element.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (element) {
        element.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  return { ref, x, y };
};

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

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const { ref: sizeRef, width } = useElementSize();

  // Attach sizeRef to canvasContainerRef
  useEffect(() => {
    if (canvasContainerRef.current) {
      if (sizeRef.current !== canvasContainerRef.current) {
        sizeRef.current = canvasContainerRef.current;
      }
    }
  }, [canvasContainerRef.current]);

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
    <div className="bg-white rounded-lg border border-gray-200 w-full p-4 shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div
        className="relative"
        style={{ height: `${playerOrder.length * 50 + topOffset}px` }}
        ref={mouseRef}
      >
        <div ref={canvasContainerRef} className="w-full h-full">
          <Canvas orthographic>
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
              const isHighlighted = highlightedInteractionEvents.includes(
                event
              );
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
        </div>
      </div>
    </div>
  );
};

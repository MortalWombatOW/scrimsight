import * as THREE from "three";
import { MatchData } from "../../../../atoms";
import { InteractionArrow } from "./InteractionArrow";

export interface PlayerInteractionEvent {
  playerInteractionEventTime: number;
  playerName: string;
  otherPlayerName: string;
  matchId: string;
  playerInteractionEventType: string;
}

interface PlayerInteractionEventThreeProps {
  event: PlayerInteractionEvent;
  getX: (time: number) => number;
  getY: (playerName: string) => number;
  matchData: MatchData;
  isHighlighted: boolean;
}

export const PlayerInteractionEventThree = ({
  event,
  getX,
  getY,
  matchData,
  isHighlighted,
}: PlayerInteractionEventThreeProps) => {
  const startPos = new THREE.Vector3(
    getX(event.playerInteractionEventTime),
    getY(event.playerName),
    0
  );
  const endPos = new THREE.Vector3(
    getX(event.playerInteractionEventTime),
    getY(event.otherPlayerName),
    0
  );

  const teamColor = matchData.team1Players.includes(event.playerName)
    ? "#1971c2"
    : "#e03131";

  return (
    <>
      <InteractionArrow
        startPos={startPos}
        endPos={endPos}
        color={teamColor}
        visible={true}
      />
      <mesh position={startPos}>
        <boxGeometry args={[10, 10, 1]} />
        <meshStandardMaterial
          color={isHighlighted ? teamColor : "white"}
          transparent
          opacity={isHighlighted ? 1 : 0.5}
        />
      </mesh>
      <mesh position={endPos}>
        <boxGeometry args={[10, 10, 1]} />
        <meshStandardMaterial
          color={isHighlighted ? teamColor : "white"}
          transparent
          opacity={isHighlighted ? 1 : 0.5}
        />
      </mesh>
    </>
  );
};

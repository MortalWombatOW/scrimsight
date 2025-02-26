export interface PlayerEvent {
  playerEventTime: number;
  playerName: string;
  matchId: string;
  playerEventType: string;
}

interface PlayerEventThreeProps {
  event: PlayerEvent;
  getX: (time: number) => number;
  getY: (playerName: string) => number;
  isHighlighted: boolean;
}

export const PlayerEventThree = ({
  event,
  getX,
  getY,
  isHighlighted,
}: PlayerEventThreeProps) => {
  return (
    <mesh position={[getX(event.playerEventTime), getY(event.playerName), 0]}>
      <boxGeometry args={[10, 10, 1]} />
      <meshStandardMaterial color={isHighlighted ? "red" : "white"} />
    </mesh>
  );
};

import React from 'react';
import {PlayerConnection} from './PlayerConnection';

export function Links({
  linkEntities,
  playerEntities,
  time,
  playerNameToIndex,
  currentPosition,
}) {
  // represents the current time in the animation between two states of the game
  // goes from 0 to 1
  // const [innerTime, setInnerTime] = useState(0);
  // const anim_duration = 1; // seconds
  // useFrame((_, delta) => {
  //   setInnerTime((innerTime + delta / anim_duration) % 1);
  // });
  return (
    <group>
      {linkEntities.map((entity, i) => {
        const state = entity.states[time];
        if (!state) return null;
        const sourcePlayerIdx = playerNameToIndex.get(state.player as string);
        const targetPlayerIdx = playerNameToIndex.get(state.target as string);
        if (sourcePlayerIdx === undefined || targetPlayerIdx === undefined) {
          return null;
        }
        const sourcePosition = currentPosition(playerEntities[sourcePlayerIdx]);
        const targetPosition = currentPosition(playerEntities[targetPlayerIdx]);
        if (!sourcePosition || !targetPosition) return null;
        return (
          <PlayerConnection
            key={i}
            source={sourcePosition}
            target={targetPosition}
            amount={Number(state.amount)}
            type={state.type as string}
          />
        );
      })}
    </group>
  );
}

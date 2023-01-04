import React from 'react';
import {PlayerConnection} from './PlayerConnection';

export function Links({linkEntities, time, playing, playerRefs}) {
  return (
    <group>
      {linkEntities.map((entity, i) => {
        const state = entity.states[time];
        if (!state) return null;
        const source = state.player as string;
        const target = state.target as string;
        return (
          <PlayerConnection
            key={i}
            source={playerRefs.current[source]}
            target={playerRefs.current[target]}
            amount={Number(state.amount)}
            type={state.type as string}
            playing={playing}
          />
        );
      })}
    </group>
  );
}

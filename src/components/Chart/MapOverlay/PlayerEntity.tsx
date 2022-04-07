import React from 'react';
import {useSpring, animated, to} from 'react-spring';
import {getHeroImage} from '../../../lib/data/data';

interface PlayerEntityProps {
  x: number;
  y: number;
  z: number;
  name: string;
  hero: string;
  health: number;
  maxHealth: number;
  ultCharge: number;
  incomingDamage: number[];
  incomingHealing: number[];
}

const PlayerEntity = (props: PlayerEntityProps) => {
  const [{x, y, z, health, ultCharge}, api] = useSpring(() => ({
    x: props.x,
    y: props.y,
    z: props.z,
    health: props.health,
    ultCharge: props.ultCharge,
  }));

  const size = 50;

  console.log('PlayerEntity', props);

  return (
    <animated.g transform={to([x, y, z], (x, y, z) => `translate(${x}, ${z})`)}>
      <foreignObject
        x={-size / 2}
        y={-size / 2}
        width={size}
        height={size}
        style={{
          filter: `drop-shadow(0px 0px ${size / 2}px grey)`,
        }}>
        <img
          src={getHeroImage(props.hero)}
          style={{
            borderRadius: '50%',
            width: `${size}px`,
            height: `${size}px`,
            pointerEvents: 'none',
          }}
        />
      </foreignObject>
      {/* healthbar */}
      <rect
        x={-25}
        y={35}
        width={50}
        height={10}
        fill={'transparent'}
        stroke={'black'}
        strokeWidth={1}
      />
      <animated.rect
        x={-25}
        y={35}
        width={health.to((h) => (h / props.maxHealth) * 50)}
        height={10}
        fill={'red'}
        fillOpacity={0.5}
      />
      {/* ult charge bar */}
      <rect
        x={-25}
        y={50}
        width={50}
        height={10}
        fill={'transparent'}
        stroke={'black'}
        strokeWidth={1}
      />
      <animated.rect
        x={-25}
        y={50}
        width={ultCharge.to((h) => (h / 100) * 50)}
        height={10}
        fill={'yellow'}
        fillOpacity={0.5}
      />
      <text
        x={0}
        y={80}
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize="20"
        fill="white">
        {props.name}
      </text>
    </animated.g>
  );
};

const AnimatedPlayerEntity = animated(PlayerEntity);

export default AnimatedPlayerEntity;

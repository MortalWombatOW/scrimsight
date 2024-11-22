import React from 'react';
import {Stage, Container} from '@pixi/react';
import * as PIXI from 'pixi.js';

// Configure PIXI for better performance
PIXI.settings.RESOLUTION = window.devicePixelRatio;
PIXI.settings.ROUND_PIXELS = true;

interface PixiWrapperProps {
  width: number;
  height: number;
  children: React.ReactNode;
}

export const PixiWrapper: React.FC<PixiWrapperProps> = ({width, height, children}) => {
  return (
    <div style={{border: '1px solid #333'}}>
      <Stage
        width={width}
        height={height}
        options={{
          backgroundAlpha: 0,
          antialias: true,
          autoDensity: true,
          eventMode: 'passive',
        }}>
        <Container>{children}</Container>
      </Stage>
    </div>
  );
};

import React, {memo} from 'react';
import {Container, Text, Graphics} from '@pixi/react';
import * as PIXI from 'pixi.js';
import {textStyle} from '../constants/timeline.constants';

interface LabelAreaProps {
  text: string;
  width: number;
  height: number;
  onResize?: (newWidth: number) => void;
  onDelete?: () => void;
}

export const LabelArea = memo<LabelAreaProps>(({text, width, height, onResize, onDelete}) => {
  return (
    <Container>
      {/* Background */}
      <Graphics
        draw={(g) => {
          g.clear();
          g.beginFill(0x333333);
          g.drawRect(0, 0, width, height);
          g.endFill();
        }}
      />

      {/* Delete button */}
      {onDelete && (
        <Graphics
          interactive={true}
          cursor="pointer"
          draw={(g) => {
            g.clear();
            g.beginFill(0x666666);
            g.drawRect(4, height / 2 - 8, 16, 16);
            g.endFill();

            // Draw X
            g.lineStyle(2, 0xffffff);
            g.moveTo(8, height / 2 - 4);
            g.lineTo(16, height / 2 + 4);
            g.moveTo(16, height / 2 - 4);
            g.lineTo(8, height / 2 + 4);
          }}
          pointerdown={onDelete}
        />
      )}

      {/* Label text - moved right to make room for delete button */}
      <Text text={text} style={textStyle} x={width - 10} y={height / 2} anchor={new PIXI.Point(1, 0.5)} />

      {/* Resize handle */}
      <Graphics
        interactive={true}
        cursor="ew-resize"
        draw={(g) => {
          g.clear();
          g.beginFill(0x666666);
          g.drawRect(width - 4, 0, 4, height);
          g.endFill();
        }}
        pointerdown={(e: PIXI.FederatedPointerEvent) => {
          const startClientX = e.clientX;
          const startWidth = width;

          const onMove = (moveEvent: PointerEvent) => {
            if (onResize) {
              const dx = moveEvent.clientX - startClientX;
              const newWidth = Math.max(100, Math.min(300, startWidth + dx));
              onResize(newWidth);
            }
          };

          const onEnd = () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onEnd);
          };

          window.addEventListener('pointermove', onMove);
          window.addEventListener('pointerup', onEnd);
        }}
      />
    </Container>
  );
});

LabelArea.displayName = 'LabelArea';

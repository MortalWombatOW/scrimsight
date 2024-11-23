import React from 'react';
import GrimReaperIcon from '../../Icons/GrimReaperIcon';
import MacheteIcon from '../../Icons/MacheteIcon';
import UpCardIcon from '../../Icons/UpCardIcon';
import BeamsAuraIcon from '../../Icons/BeamsAuraIcon';
import GhostAllyIcon from '../../Icons/GhostAllyIcon';
import {TextStyle} from '@pixi/text';

export const COLORS = {
  ultimate: {
    color: '#42c2f5',
    alpha: 0.5,
  },
  kill: {
    color: '#f44336',
    alpha: 0.5,
  },
  spawn: {
    color: '#4caf50',
    alpha: 0.5,
  },
  assist: {
    color: '#009688',
    alpha: 0.5,
  },
} as const;

export const INTERACTION_EVENT_TYPE_TO_ICON = {
  Died: <GrimReaperIcon size={16} />,
  'Killed player': <MacheteIcon size={16} />,
  Resurrected: <UpCardIcon size={16} />,
} as const;

export const EVENT_TYPE_TO_COLOR = {
  Spawn: COLORS.spawn,
  Swap: COLORS.spawn,
  'Ability 1 Used': COLORS.ultimate,
  'Ability 2 Used': COLORS.ultimate,
  'Offensive Assist': COLORS.assist,
  'Defensive Assist': COLORS.assist,
} as const;

export const INTERACTION_EVENT_TYPE_TO_COLOR = {
  Died: COLORS.kill,
  'Killed player': COLORS.kill,
  Resurrected: COLORS.spawn,
} as const;

export const EVENT_TYPE_TO_ICON = {
  Spawn: <BeamsAuraIcon size={16} />,
  Swap: <GhostAllyIcon size={16} />,
  'Ability 1 Used': 'Used Ability 1',
  'Ability 2 Used': 'Used Ability 2',
  'Offensive Assist': 'A',
  'Defensive Assist': 'A',
} as const;

export const textStyle: TextStyle = new TextStyle({
  fontFamily: 'Arial',
  fontSize: 14,
  fill: '#ffffff',
});

export const tooltipStyle: TextStyle = new TextStyle({
  fontFamily: 'Arial',
  fontSize: 12,
  fill: '#ffffff',
  align: 'center',
});

export const phaseStyle: TextStyle = new TextStyle({
  fontFamily: 'Arial',
  fontSize: 10,
  fill: '#ffffff',
  align: 'center',
});

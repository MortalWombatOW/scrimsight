import React from 'react';
import GrimReaperIcon from '../../Icons/GrimReaperIcon';
import MacheteIcon from '../../Icons/MacheteIcon';
import UpCardIcon from '../../Icons/UpCardIcon';
import BeamsAuraIcon from '../../Icons/BeamsAuraIcon';
import GhostAllyIcon from '../../Icons/GhostAllyIcon';

export const COLORS = {
  ultimate: '#42c2f5',
  kill: '#f44336',
  spawn: '#4caf50',
  assist: '#009688',
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
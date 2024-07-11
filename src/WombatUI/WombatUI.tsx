// Aliases for MUI components, but with a custom theme. Each component is imported from MUI and then re-exported with the same name, but with a custom theme from the WombatUI.scss file.
// Example usage: import {MenuItem, TextField, Box, Button, List, ListItem, ListItemText, IconButton, Typography, ButtonGroup} from '../../../WombatUI/WombatUI';

import './WombatUI.scss';

import {MenuItem as MuiMenuItem} from '@mui/material';
import {TextField as MuiTextField} from '@mui/material';
import {Box as MuiBox} from '@mui/material';
import {Button as MuiButton} from '@mui/material';
import {List as MuiList} from '@mui/material';
import {ListItem as MuiListItem} from '@mui/material';
import {ListItemText as MuiListItemText} from '@mui/material';
import {IconButton as MuiIconButton} from '@mui/material';
import {Typography as MuiTypography} from '@mui/material';
import {ButtonGroup as MuiButtonGroup} from '@mui/material';

export const MenuItem = MuiMenuItem;
export const TextField = MuiTextField;
export const Box = MuiBox;
export const Button = MuiButton;
export const List = MuiList;
export const ListItem = MuiListItem;
export const ListItemText = MuiListItemText;
export const IconButton = MuiIconButton;
export const Typography = MuiTypography;
export const ButtonGroup = MuiButtonGroup;

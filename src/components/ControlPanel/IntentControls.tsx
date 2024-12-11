import { Typography, Box, Button } from "@mui/material";
import { OverwatchHero, OverwatchMap, OverwatchMode } from "~/lib/data/hero";
import IconAutocomplete from "./IconAutocomplete";
import RoleControl from "./RoleControl";
import TimeRangeSlider from "./TimeRangeSlider";
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import GroupsIcon from '@mui/icons-material/Groups';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { Intent } from "~/Widget";

interface IntentControlsProps {
  intent: Intent;
  setIntent: (newIntent: Intent) => void;
  possibleValues: {
    players: string[];
    maps: string[];
    mapNames: OverwatchMap[];
    modes: OverwatchMode[];
    teams: string[];
    heroes: OverwatchHero[];
    metrics: string[];
  };
  size?: 'small' | 'large';
}

// Helper function to format time (assumes value is in seconds)
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const validateIntent = (intent: Intent): Intent => {
  if (intent.mapId && intent.mapId.length === 0) {
    delete intent.mapId;
  }
  if (intent.playerName && intent.playerName.length === 0) {
    delete intent.playerName;
  }
  if (intent.team && intent.team.length === 0) {
    delete intent.team;
  }
  if (intent.hero && intent.hero.length === 0) {
    delete intent.hero;
  }
  if (intent.metric && intent.metric.length === 0) {
    delete intent.metric;
  }
  if (intent.mode && intent.mode.length === 0) {
    delete intent.mode;
  }
  if (intent.mapName && intent.mapName.length === 0) {
    delete intent.mapName;
  }
  if (intent.mapId === undefined || intent.mapId.length > 1) {
    delete intent.time;
  }
  return intent;
};

const IntentControls: React.FC<IntentControlsProps> = ({
  intent,
  setIntent,
  possibleValues,
  size = 'large'
}) => {
  const updateIntent = <K extends keyof Intent>(key: K, value: Intent[K]) => {
    setIntent(validateIntent({ ...intent, [key]: value }));
  };

  const hasMap = intent.mapId !== undefined;
  const hasDate = intent.date !== undefined;
  const hasTime = intent.time !== undefined;

  return (
    <Box sx={{ margin: 1, display: 'flex', flexDirection: 'row', gap: 2, flexWrap: 'wrap' }}>
              <IconAutocomplete
                options={possibleValues.players}
                selected={intent.playerName || []}
                onChange={(value) => updateIntent('playerName', value)}
                icon={<PersonIcon />}
                label="Players"
                noOptionsText="No players found"
                size={size}
              />

              <IconAutocomplete
                options={possibleValues.maps}
                selected={intent.mapId || []}
                onChange={(value) => updateIntent('mapId', value)}
                icon={<LocationOnIcon />}
                label="Maps"
                noOptionsText="No maps found"
                size={size}
              />

              <IconAutocomplete
                options={possibleValues.teams}
                selected={intent.team || []}
                onChange={(value) => updateIntent('team', value)}
                icon={<GroupsIcon />}
                label="Teams"
                noOptionsText="No teams found"
                size={size}
              />

              <RoleControl
                selectedRoles={intent.playerRole || []}
                onChange={(value) => updateIntent('playerRole', value)}
                size={size}
              />

      
              <IconAutocomplete
                options={possibleValues.heroes}
                selected={intent.hero || []}
                onChange={(value) => updateIntent('hero', value as OverwatchHero[])}
                icon={<SportsEsportsIcon />}
                label="Heroes"
                noOptionsText="No heroes found"
                size={size}
              />

              <IconAutocomplete
                options={possibleValues.metrics}
                selected={intent.metric || []}
                onChange={(value) => updateIntent('metric', value)}
                icon={<ShowChartIcon />}
                label="Metrics"
                noOptionsText="No metrics found"
                size={size}
              />

          
   
              {hasDate ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, marginRight: 2 }}>
                  <Typography variant="h6">Date Range: {intent.date ? intent.date.join(' to ') : 'All time'}</Typography>
                  <TimeRangeSlider
                value={intent.date ? [
                  new Date(intent.date[0]).getTime() / (1000 * 60 * 60 * 24),
                  new Date(intent.date[1]).getTime() / (1000 * 60 * 60 * 24)
                ] : [
                  new Date().getTime() / (1000 * 60 * 60 * 24) - 30,
                  new Date().getTime() / (1000 * 60 * 60 * 24)
                ]}
                onChange={(value) => updateIntent('date', [
                  new Date(value[0] * 1000 * 60 * 60 * 24).toISOString().split('T')[0],
                  new Date(value[1] * 1000 * 60 * 60 * 24).toISOString().split('T')[0]
                ])}
                min={new Date().getTime() / (1000 * 60 * 60 * 24) - 365}
                max={new Date().getTime() / (1000 * 60 * 60 * 24)}
                minDistance={1}
                    renderLabel={(value) => new Date(value * 1000 * 60 * 60 * 24).toLocaleDateString()}
                  />
                  <Button onClick={() => updateIntent('date', undefined)}>Clear Date Range</Button>
                </Box>
              ) : (
                <Button onClick={() => updateIntent('date', [(new Date(new Date().setDate(new Date().getDate() - 30))).toISOString().split('T')[0], new Date().toISOString().split('T')[0]])}>Set Date Range</Button>
              )}

                         
{hasTime && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="h6">Time Range</Typography>
                  <TimeRangeSlider
                    value={intent.time || [0, 24 * 60 * 60]}
                    onChange={(value) => updateIntent('time', value)}
                    min={0}
                    max={24 * 60 * 60}
                    minDistance={60}
                    renderLabel={(value) => formatTime(value)}
                  />
                  <Button onClick={() => updateIntent('time', undefined)}>Clear Time Range</Button>
                </Box>
              )}
              {!hasTime && hasMap && (
                <Button onClick={() => updateIntent('time', [0, 24 * 60 * 60])}>Set Time Range</Button>
              )}

    </Box>
  );
};

export default IntentControls; 
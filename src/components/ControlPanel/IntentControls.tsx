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
import { useWombatData, useWombatDataManager } from "wombat-data-framework";
import { MatchFileInfo, PlayerMetrics } from "~/WombatDataFrameworkSchema";
import { useIntent } from '~/contexts/IntentContext';

interface IntentControlsProps {
  possibleValues: {
    players: string[];
    matches: string[];
    maps: OverwatchMap[];
    modes: OverwatchMode[];
    teams: string[];
    heroes: OverwatchHero[];
    metrics: (keyof PlayerMetrics)[];
  };
  size?: 'small' | 'large';
}

// Helper function to format time (assumes value is in seconds)
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const IntentControls: React.FC<IntentControlsProps> = ({
  possibleValues,
  size = 'large'
}) => {
  const { intent, updateIntent } = useIntent();

  const hasMap = intent.matchId !== undefined;
  const hasDate = intent.date !== undefined;

  const dataManager = useWombatDataManager();

  const hasTime = intent.time !== undefined;

  const matchData = useWombatData<MatchFileInfo>('match_object_store');

  const endDate = Math.ceil(new Date().getTime() / (1000 * 60 * 60 * 24));

  const startDate = matchData.data.length > 0 ? (matchData.data.map((match) => new Date(match.dateString)).sort()[0].getTime() / (1000 * 60 * 60 * 24)) : endDate - 365;

  console.log('startDate', startDate);
  console.log('endDate', endDate);
  console.log('matchData', matchData.data);


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
        options={possibleValues.matches}
        selected={intent.matchId || []}
        onChange={(value) => updateIntent('matchId', value)}
        icon={<LocationOnIcon />}
        label="Matches"
        noOptionsText="No matches found"
        size={size}
      />

      <IconAutocomplete
        options={possibleValues.maps}
        selected={intent.mapName || []}
        onChange={(value) => updateIntent('mapName', value)}
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
        onChange={(value) => updateIntent('metric', value as (keyof PlayerMetrics)[])}
        icon={<ShowChartIcon />}
        label="Metrics"
        noOptionsText="No metrics found"
        size={size}
        optionLabel={(option) => dataManager.getColumn(option).displayName}
        optionSubLabel={(option) => dataManager.getColumn(option).description}
      />



      {hasDate ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, marginRight: 2 }}>
          <Typography variant="h6">Date Range: {intent.date ? intent.date.join(' to ') : 'All time'}</Typography>
          <TimeRangeSlider
            value={intent.date ? [
              new Date(intent.date[0]).getTime() / (1000 * 60 * 60 * 24),
              new Date(intent.date[1]).getTime() / (1000 * 60 * 60 * 24)
            ] : [
              startDate,
              endDate
            ]}
            onChange={(value) => updateIntent('date', [
              new Date(value[0] * 1000 * 60 * 60 * 24).toISOString().split('T')[0],
              new Date(value[1] * 1000 * 60 * 60 * 24).toISOString().split('T')[0]
            ])}
            min={startDate}
            max={endDate}
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
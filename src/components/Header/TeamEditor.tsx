import {
  Box,
  Typography,
  Input,
  Chip,
  FormControl,
  Button,
  Autocomplete,
  TextField,
  createFilterOptions,
} from '@mui/material';
import React, {useEffect, useRef, useState} from 'react';
import {useQuery} from '../../hooks/useQueries';
import {storeObjectInDatabase} from '../../lib/data/database';
import {Team} from '../../lib/data/types';

const TeamEditor = ({
  team,
  setTeam,
  size,
  onClose,
  allTeams,
}: {
  team: Team | undefined;
  setTeam: (team: Team) => void;
  size: 'half' | 'full';
  onClose: () => void;
  allTeams: Team[];
}) => {
  const [teamName, setTeamName] = useState(team?.name ?? '');
  const [teamPlayers, setTeamPlayers] = useState(team?.players ?? []);
  const [teamNotes, setTeamNotes] = useState(team?.notes ?? '');
  const [editingPlayer, setEditingPlayer] = useState<number | undefined>(
    undefined,
  );
  const [newPlayerName, setNewPlayerName] = useState<string | undefined>(
    undefined,
  );
  const [editorError, setEditorError] = useState<string | undefined>(undefined);
  const isEditingPlayer =
    editingPlayer !== undefined || newPlayerName !== undefined;
  const playerNameEditorRef = useRef<HTMLInputElement>(null);
  const [allPlayers, tick] = useQuery<{player: string}>(
    {
      name: 'allPlayers',
      query: 'select distinct player from ? as player_status',
      deps: ['player_status'],
    },
    [],
  );

  useEffect(() => {
    setTeamName(team?.name ?? '');
    setTeamPlayers(team?.players ?? []);
    setTeamNotes(team?.notes ?? '');
  }, [team]);

  const OPTIONS_LIMIT = 4;
  const defaultFilterOptions = createFilterOptions();

  const filterOptions = (options, state) => {
    return defaultFilterOptions(options, state).slice(0, OPTIONS_LIMIT);
  };

  const addPlayer = (player) => {
    setTeamPlayers([...teamPlayers, player]);
  };
  const editPlayer = (index: number, value: string | undefined) => {
    const newPlayers = [...teamPlayers];

    if (value === undefined) {
      newPlayers.splice(index, 1);
    } else {
      newPlayers[index] = value;
    }

    setTeamPlayers(newPlayers);
  };
  const submitPlayer = () => {
    const playerName =
      editingPlayer !== undefined ? teamPlayers[editingPlayer] : newPlayerName;

    if (playerName?.trim() === '') {
      setEditorError('Player name cannot be empty');
      return;
    }

    // no two players can have the same name
    if (teamPlayers.some((p) => p === playerName)) {
      setEditorError(`Player ${playerName} is already in the team`);
      return;
    }

    setEditingPlayer(undefined);
    setEditorError(undefined);
    if (newPlayerName !== undefined) {
      addPlayer(newPlayerName);
      setNewPlayerName(undefined);
    } else {
      editPlayer(editingPlayer!, playerName);
    }
  };

  const submitTeam = (editedTeam: Team): boolean => {
    if (editedTeam.name === '') {
      setEditorError('Team name cannot be empty');
      return false;
    }

    // no two teams can have the same name
    // if they have the same name, then check the ids
    // if the ids are the same, then it's the same team
    if (
      allTeams.some(
        (t) =>
          t.name === editedTeam.name &&
          (t.id === undefined ||
            editedTeam.id === undefined ||
            t.id !== editedTeam.id),
      )
    ) {
      setEditorError('Team name must be unique');
      return false;
    }

    setTeam(editedTeam);
    storeObjectInDatabase<Team>(editedTeam, 'team');
    onClose();
    return true;
  };

  useEffect(() => {
    if (isEditingPlayer) {
      playerNameEditorRef.current?.focus();
    }
  }, [isEditingPlayer]);

  return (
    <Box
      component="div"
      style={{
        width: size == 'half' ? '50%' : '100%',
        borderLeft: '1px solid #9ca0ac',
        paddingLeft: '16px',
        marginLeft: size == 'half' ? '16px' : '0px',
      }}>
      <Typography variant="body1">
        {team === undefined ? 'Add New' : 'Edit'} Team
      </Typography>
      <Input
        placeholder="Team Name"
        value={teamName}
        onChange={(e) => {
          setTeamName(e.target.value);
        }}
      />
      <Box component="div">
        <Typography variant="body1">Players</Typography>
        <Box component="div">
          {teamPlayers &&
            teamPlayers.map((player, i) => (
              <Chip
                key={player + '_' + i}
                label={player}
                onClick={() => {
                  setEditingPlayer(i);
                }}
                style={
                  editingPlayer === i
                    ? {
                        backgroundColor: '#4e566c',
                        color: 'white',
                        marginRight: '3px',
                      }
                    : {marginRight: '3px'}
                }
              />
            ))}
        </Box>
        <Box
          component="div"
          style={{
            marginTop: '8px',
          }}>
          {isEditingPlayer ? (
            <Box component="div">
              <FormControl
                variant="outlined"
                style={{display: 'flex', flexDirection: 'row'}}>
                <Autocomplete
                  disablePortal
                  filterOptions={filterOptions}
                  options={allPlayers
                    .map((p) => p.player)
                    .sort((a, b) => -b.localeCompare(a))}
                  sx={{width: 300}}
                  onInputChange={(e, value) => {
                    if (editingPlayer === undefined) {
                      setNewPlayerName(value);
                    } else {
                      // editPlayer(editingPlayer, value);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={editorError !== undefined}
                      placeholder="Player Name"
                      variant="standard"
                      value={
                        newPlayerName === undefined
                          ? teamPlayers[editingPlayer!]
                          : newPlayerName
                      }
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          submitPlayer();
                        }
                      }}
                      inputRef={playerNameEditorRef}
                      fullWidth
                    />
                  )}
                />

                <Button onClick={submitPlayer} size="small">
                  {newPlayerName === undefined ? 'Save' : 'Add'}
                </Button>
                {newPlayerName === undefined && (
                  <Button
                    size="small"
                    onClick={() => {
                      editPlayer(editingPlayer!, undefined);
                      setEditingPlayer(undefined);
                    }}>
                    Delete
                  </Button>
                )}
              </FormControl>
              {editorError && (
                <Typography
                  variant="body1"
                  color="error"
                  style={{fontSize: '12px'}}>
                  {editorError}
                </Typography>
              )}
            </Box>
          ) : (
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => {
                setNewPlayerName('');
              }}>
              Add Player
            </Button>
          )}
        </Box>
      </Box>
      <Box component="div">
        <Typography variant="body1">Team Notes</Typography>
        <TextField
          placeholder="Notes"
          multiline
          rows={8}
          variant="standard"
          value={teamNotes}
          onChange={(e) => {
            setTeamNotes(e.target.value);
          }}
        />
      </Box>
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={() => {
          const newTeam: Team = {
            name: teamName.trim(),
            players: teamPlayers,
            notes: teamNotes.trim(),
          };

          if (team?.id !== undefined) {
            newTeam.id = team.id;
          }

          if (submitTeam(newTeam)) {
            onClose();
          }
        }}>
        {team === undefined ? 'Add' : 'Save'}
      </Button>
    </Box>
  );
};

export default TeamEditor;

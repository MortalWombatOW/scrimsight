import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import {Box} from '@mui/system';
import React, {useEffect, useState} from 'react';
import {Team} from '../../lib/data/types';
import {Button, Typography} from '../Common/Mui';
import {useQuery} from '../../hooks/useQueries';
import TeamEditor from './TeamEditor';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import Globals from '../../lib/data/globals';
import IconAndText from '../Common/IconAndText';
import GroupsIcon from '@mui/icons-material/Groups';
import useCookie from 'react-use-cookie';
const TeamConfigurator = () => {
  const [teamId, setTeamId] = useCookie('teamId', undefined);
  const team = Globals.getTeam();
  const [open, setOpen] = useState(false);

  const teamStr = team ? team.name : 'Select a team';
  const [editorState, setEditorState] = useState<'closed' | 'new' | 'edit'>(
    'closed',
  );
  const [teamInternal, setTeamInternal] = useState<Team | undefined>(team);

  const [allTeams, tick] = useQuery<Team>(
    {
      name: 'teams',
      query: `select * from ? as team`,
      deps: ['teams'],
    },
    [],
  );

  useEffect(() => {
    if (teamId) {
      const team = allTeams?.find((t) => t.id === Number(teamId));
      if (team) {
        setTeamInternal(team);
        Globals.setTeam(team);
      }
    }
  }, [teamId, allTeams]);

  console.log('allTeams', allTeams);

  const [teams, setTeams] = useState<Team[]>([]);

  const updateTeam = (team: Team, index: number) => {
    const newTeams = [...teams];
    newTeams[index] = team;
    setTeams(newTeams);
  };

  useEffect(() => {
    if (allTeams) {
      setTeams(allTeams);
    }
  }, [allTeams]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setEditorState('closed');
    setOpen(false);
    setTeamInternal(undefined);
  };

  const apply = () => {
    if (teamInternal) {
      Globals.setTeam(teamInternal);
      setTeamId(teamInternal.id?.toString() ?? '');
    }
    handleClose();
  };

  const loaded = allTeams !== undefined;
  const hasTeams = loaded && teams.length > 0;

  return (
    <Box
      component="div"
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
        style={{
          fontSize: '16px',
          padding: '4px 8px',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}>
        <IconAndText icon={<GroupsIcon />} text={teamStr} />
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Team editor</DialogTitle>
        <DialogContent
          style={{
            width: '800px',
            maxWidth: '90%',
            minWidth: '30%',
          }}>
          <Box
            component="form"
            sx={{display: 'flex', flexWrap: 'wrap', flexDirection: 'row'}}>
            {hasTeams && (
              <Box component="div">
                <Typography
                  variant="body1"
                  style={{
                    fontWeight: 'bold',
                  }}>
                  Select a team
                </Typography>
                {teams.map((team2) => (
                  <Box
                    key={team2.name}
                    component="div"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      backgroundColor:
                        teamInternal?.name === team2.name ? '#eee' : '#fff',
                      boxShadow:
                        teamInternal?.name === team2.name
                          ? '0 0 4px #aaa'
                          : 'none',
                    }}>
                    <IconButton
                      onClick={() => {
                        setTeamInternal(team2);
                      }}
                      size="small">
                      {teamInternal?.name === team2.name ? (
                        <CheckCircleIcon />
                      ) : (
                        <RadioButtonUncheckedIcon />
                      )}
                    </IconButton>

                    <Typography
                      variant="body1"
                      style={{
                        cursor: 'pointer',
                        color:
                          teamInternal?.name === team2.name
                            ? '#3f51b5'
                            : '#000',
                      }}
                      onClick={() => {
                        setTeamInternal(team2);
                      }}>
                      {team2.name}
                    </Typography>
                    <IconButton
                      onClick={() => {
                        setTeamInternal(team2);
                        setEditorState('edit');
                      }}
                      size="small">
                      <EditIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  onClick={() => {
                    setTeamInternal(undefined);
                    setEditorState('new');
                  }}>
                  Add Team
                </Button>
              </Box>
            )}

            {editorState !== 'closed' && (
              <TeamEditor
                team={teamInternal}
                setTeam={(team) => {
                  if (teamInternal) {
                    const index = teams.findIndex(
                      (team2) => team2.name === teamInternal.name,
                    );
                    updateTeam(team, index);
                  } else {
                    setTeams([...teams, team]);
                  }
                  setTeamInternal(team);
                }}
                size={hasTeams ? 'half' : 'full'}
                onClose={() => setEditorState('closed')}
                allTeams={teams}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          <IconButton onClick={apply}>
            <CheckIcon />
          </IconButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeamConfigurator;

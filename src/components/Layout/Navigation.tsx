import { AppShell, NavLink, Stack } from '@mantine/core';
import { useLocation, Link } from 'react-router-dom';
import { uniquePlayerNamesAtom, scrimAtom, teamNamesAtom, matchDataAtom } from '../../atoms';
import { useAtomValue } from 'jotai';
import { MdArrowBack } from "react-icons/md";
import { RiTeamLine } from "react-icons/ri";
import { MdOutlinePersonOutline } from "react-icons/md";
import { MdOutlineEmojiEvents } from "react-icons/md";
import { FaRegFileAlt } from "react-icons/fa";
import { AiOutlineHome } from "react-icons/ai";
import { useDocumentTitle } from '@mantine/hooks';
import { TbVs } from "react-icons/tb";

const getTitle = (pathname: string) => {
  if (pathname === '/') {
    return 'Scrimsight';
  }

  if (pathname.startsWith('/matches')) {
    if (pathname === '/matches') {
      return 'Matches';
    }

    return `Matches - ${pathname.split('/').pop()}`;
  }

  if (pathname.startsWith('/players')) {
    if (pathname === '/players') {
      return 'Players';
    }

    return `Players - ${pathname.split('/').pop()}`;
  }

  if (pathname.startsWith('/teams')) {
    if (pathname === '/teams') {
      return 'Teams';
    }

    return `Teams - ${pathname.split('/').pop()}`;
  }

  if (pathname.startsWith('/files')) {
    return 'Files';
  }

  return 'Scrimsight';
}

export const Navigation = () => {
  const location = useLocation();

  const scrims = useAtomValue(scrimAtom);
  const playerNames = useAtomValue(uniquePlayerNamesAtom);
  const teamNames = useAtomValue(teamNamesAtom);
  const matchData = useAtomValue(matchDataAtom);

  const isRoot = location.pathname === '/';
  const isMatches = location.pathname.startsWith('/matches');
  const isPlayers = location.pathname.startsWith('/players');
  const isTeams = location.pathname.startsWith('/teams');
  const isFiles = location.pathname.startsWith('/files');

  useDocumentTitle(getTitle(location.pathname));

  return (
    <AppShell.Navbar p="md">
      <Stack gap={0}>
        {(isRoot || isFiles) && (
          <>
            <NavLink
              component={Link}
              to="/"
              label="Home"
              leftSection={<AiOutlineHome />}
            />
            <NavLink
              component={Link}
              to="/matches"
              label="Matches"
              leftSection={<TbVs />}
            />
            <NavLink
              component={Link}
              to="/players"
              label="Players"
              leftSection={<MdOutlinePersonOutline />}
            />

            <NavLink
              component={Link}
              to="/teams"
              label="Teams"
              leftSection={<RiTeamLine />}
            />

            <NavLink
              component={Link}
              to="/files"
              label="Files"
              leftSection={<FaRegFileAlt />}
              active={isFiles}
            />
          </>
        )}
        {isMatches && (
          <>
            <NavLink
              component={Link}
              to="/"
              label="Back"
              leftSection={<MdArrowBack />}
            />
            <NavLink
              component={Link}
              to="/matches"
              label="Browse Matches"
              leftSection={<MdOutlineEmojiEvents />}
            />
            {scrims.map((scrim) => (
              <Stack gap="xs">
                <NavLink
                  disabled
                  // h={24}
                  key={scrim.dateString}
                  label={`${scrim.team1Name} vs ${scrim.team2Name}`}
                  description={`${scrim.dateString}`}
                  active={location.pathname === `/matches?teams=${encodeURIComponent(scrim.team1Name)},${encodeURIComponent(scrim.team2Name)}`}
                />
                {scrim.matchIds.map((matchId) => (
                  <NavLink
                    h={24}
                    key={matchId}
                    component={Link}
                    to={`/matches/${matchId}`}
                    label={`${matchData.find((match) => match.matchId === matchId)?.map ?? 'Unknown Map'} (${matchData.find((match) => match.matchId === matchId)?.team1Score} - ${matchData.find((match) => match.matchId === matchId)?.team2Score})`}
                    leftSection={<MdOutlineEmojiEvents />}
                    active={location.pathname === `/matches/${matchId}`}
                  />
                ))}
              </Stack>
            ))}
          </>
        )}
        {isPlayers && (
          <>
            <NavLink
              component={Link}
              to="/"
              label="Back"
              leftSection={<MdArrowBack />}
            />
            <NavLink
              component={Link}
              to="/players"
              label="Browse Players"
              leftSection={<MdOutlinePersonOutline />}
            />
            {playerNames.map((name) => (
              <NavLink
                h={24}
                key={name}
                component={Link}
                to={`/players/${name}`}
                label={name}
                leftSection={<MdOutlinePersonOutline />}
                active={location.pathname === `/players/${name}`}
              />
            ))}
          </>
        )}
        {isTeams && (
          <>
            <NavLink
              component={Link}
              to="/"
              label="Back"
              leftSection={<MdArrowBack />}
            />
            <NavLink
              component={Link}
              to="/teams"
              label="Browse Teams"
              leftSection={<RiTeamLine />}
            />
            {teamNames.map((name) => (
              <NavLink
                h={24}
                key={name}
                component={Link}
                to={`/teams/${name}`}
                label={name}
                leftSection={<RiTeamLine />}
                active={location.pathname === `/teams/${name}`}
              />
            ))}
          </>
        )}
      </Stack>
    </AppShell.Navbar>
  );
}; 
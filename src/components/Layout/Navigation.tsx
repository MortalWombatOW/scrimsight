import { AppShell, NavLink, Stack } from '@mantine/core';
import { useLocation, Link } from 'react-router-dom';
import { uniquePlayerNamesAtom, matchDataAtom, teamNamesAtom } from '../../atoms';
import { useAtomValue } from 'jotai';
import { MdArrowBack } from "react-icons/md";
import { RiTeamLine } from "react-icons/ri";
import { MdOutlinePersonOutline } from "react-icons/md";
import { MdOutlineEmojiEvents } from "react-icons/md";
import { FaRegFileAlt } from "react-icons/fa";
import { AiOutlineHome } from "react-icons/ai";
import { useDocumentTitle, useFavicon } from '@mantine/hooks';


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

  const matchData = useAtomValue(matchDataAtom);
  const playerNames = useAtomValue(uniquePlayerNamesAtom);
  const teamNames = useAtomValue(teamNamesAtom);

  const isRoot = location.pathname === '/';
  const isMatches = location.pathname.startsWith('/matches');
  const isPlayers = location.pathname.startsWith('/players');
  const isTeams = location.pathname.startsWith('/teams');
  const isFiles = location.pathname.startsWith('/files');

  useDocumentTitle(getTitle(location.pathname));

  return (
    <AppShell.Navbar p="md">
      <Stack>
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
              leftSection={<MdOutlineEmojiEvents />}
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
            {matchData.map((match) => (
              <NavLink
                key={match.matchId}
                component={Link}
                to={`/matches/${match.matchId}`}
                label={`${match.team1Name} vs ${match.team2Name}`}
                description={`${match.map} (${match.dateString})`}
                leftSection={<MdOutlineEmojiEvents />}
                active={location.pathname === `/matches/${match.matchId}`}
              />
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
            {playerNames.map((name) => (
              <NavLink
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
            {teamNames.map((name) => (
              <NavLink
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
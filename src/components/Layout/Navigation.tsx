import { useLocation, Link } from "react-router-dom";
import {
  uniquePlayerNamesAtom,
  scrimAtom,
  teamNamesAtom,
  matchDataAtom,
} from "../../atoms";
import { useAtomValue } from "jotai";
import { MdArrowBack } from "react-icons/md";
import { RiTeamLine } from "react-icons/ri";
import { MdOutlinePersonOutline } from "react-icons/md";
import { FaRegFileAlt } from "react-icons/fa";
import { AiOutlineHome } from "react-icons/ai";
import { TbVs } from "react-icons/tb";
import { useEffect } from "react";

const getTitle = (pathname: string) => {
  if (pathname === "/") {
    return "Scrimsight";
  }

  if (pathname.startsWith("/matches")) {
    if (pathname === "/matches") {
      return "Matches";
    }

    return `Matches - ${pathname.split("/").pop()}`;
  }

  if (pathname.startsWith("/players")) {
    if (pathname === "/players") {
      return "Players";
    }

    return `Players - ${pathname.split("/").pop()}`;
  }

  if (pathname.startsWith("/teams")) {
    if (pathname === "/teams") {
      return "Teams";
    }

    return `Teams - ${pathname.split("/").pop()}`;
  }

  if (pathname.startsWith("/files")) {
    return "Files";
  }

  return "Scrimsight";
};

// Navigation link component
const NavItem = ({
  to,
  label,
  icon,
  active = false,
  disabled = false,
  description = undefined,
  compact = false,
  closeMobileMenu,
}: {
  to: string;
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  description?: string;
  compact?: boolean;
  closeMobileMenu?: () => void;
}) => {
  const baseClasses =
    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors";
  const activeClasses =
    "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300";
  const inactiveClasses =
    "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800";
  const disabledClasses = "";

  const classes = `
    ${baseClasses}
    ${active ? activeClasses : inactiveClasses}
    ${disabled ? disabledClasses : ""}
    ${compact ? "py-1" : ""}
  `;

  if (disabled) {
    return (
      <div className={classes}>
        {icon && <span className="text-xl">{icon}</span>}
        <div>
          <div>{label}</div>
          {description && (
            <div className="text-xs text-gray-500">{description}</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Link to={to} className={classes} onClick={closeMobileMenu}>
      <span className="text-xl">{icon}</span>
      <div>
        <div>{label}</div>
        {description && (
          <div className="text-xs text-gray-500">{description}</div>
        )}
      </div>
    </Link>
  );
};

export const Navigation = ({
  closeMobileMenu,
}: {
  closeMobileMenu: () => void;
}) => {
  const location = useLocation();

  const scrims = useAtomValue(scrimAtom);
  const playerNames = useAtomValue(uniquePlayerNamesAtom);
  const teamNames = useAtomValue(teamNamesAtom);
  const matchData = useAtomValue(matchDataAtom);

  const isRoot = location.pathname === "/";
  const isMatches = location.pathname.startsWith("/matches");
  const isPlayers = location.pathname.startsWith("/players");
  const isTeams = location.pathname.startsWith("/teams");
  const isFiles = location.pathname.startsWith("/files");

  useEffect(() => {
    document.title = getTitle(location.pathname);
  }, [location.pathname]);

  return (
    <nav className="h-full w-full overflow-y-auto">
      <div className="flex flex-col space-y-1">
        {(isRoot || isFiles) && (
          <>
            <NavItem
              to="/"
              label="Home"
              icon={<AiOutlineHome />}
              active={location.pathname === "/"}
              closeMobileMenu={closeMobileMenu}
            />
            <NavItem
              to="/matches"
              label="Matches"
              icon={<TbVs />}
              active={location.pathname === "/matches"}
              closeMobileMenu={closeMobileMenu}
            />
            <NavItem
              to="/players"
              label="Players"
              icon={<MdOutlinePersonOutline />}
              active={location.pathname === "/players"}
              closeMobileMenu={closeMobileMenu}
            />
            <NavItem
              to="/teams"
              label="Teams"
              icon={<RiTeamLine />}
              active={location.pathname === "/teams"}
              closeMobileMenu={closeMobileMenu}
            />
            <NavItem
              to="/files"
              label="Files"
              icon={<FaRegFileAlt />}
              active={isFiles}
              closeMobileMenu={closeMobileMenu}
            />
          </>
        )}
        {isMatches && (
          <>
            <NavItem to="/" label="Back" icon={<MdArrowBack />} />
            <NavItem
              to="/matches"
              label="Browse Matches"
              active={location.pathname === "/matches"}
              closeMobileMenu={closeMobileMenu}
            />
            {scrims.map((scrim, index) => (
              <div
                key={`${scrim.dateString}-${index}`}
                className="ml-2 mt-2 flex flex-col space-y-1"
              >
                <NavItem
                  to=""
                  label={`${scrim.team1Name} vs ${scrim.team2Name}`}
                  description={`${scrim.dateString}`}
                  disabled
                  active={
                    location.pathname ===
                    `/matches?teams=${encodeURIComponent(
                      scrim.team1Name
                    )},${encodeURIComponent(scrim.team2Name)}`
                  }
                  closeMobileMenu={closeMobileMenu}
                />
                <div className="ml-2 flex flex-col space-y-1">
                  {scrim.matchIds.map((matchId) => (
                    <NavItem
                      key={matchId}
                      to={`/matches/${matchId}`}
                      label={`${
                        matchData.find((match) => match.matchId === matchId)
                          ?.map ?? "Unknown Map"
                      } (${
                        matchData.find((match) => match.matchId === matchId)
                          ?.team1Score
                      } - ${
                        matchData.find((match) => match.matchId === matchId)
                          ?.team2Score
                      })`}
                      active={location.pathname === `/matches/${matchId}`}
                      compact
                      closeMobileMenu={closeMobileMenu}
                    />
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
        {isPlayers && (
          <>
            <NavItem to="/" label="Back" icon={<MdArrowBack />} />
            <NavItem
              to="/players"
              label="Browse Players"
              icon={<MdOutlinePersonOutline />}
              active={location.pathname === "/players"}
              closeMobileMenu={closeMobileMenu}
            />
            {playerNames.map((name) => (
              <NavItem
                key={name}
                to={`/players/${name}`}
                label={name}
                active={location.pathname === `/players/${name}`}
                compact
                closeMobileMenu={closeMobileMenu}
              />
            ))}
          </>
        )}
        {isTeams && (
          <>
            <NavItem to="/" label="Back" icon={<MdArrowBack />} />
            <NavItem
              to="/teams"
              label="Browse Teams"
              icon={<RiTeamLine />}
              active={location.pathname === "/teams"}
              closeMobileMenu={closeMobileMenu}
            />
            {teamNames.map((name) => (
              <NavItem
                key={name}
                to={`/teams/${name}`}
                label={name}
                active={location.pathname === `/teams/${name}`}
                compact
                closeMobileMenu={closeMobileMenu}
              />
            ))}
          </>
        )}
      </div>
    </nav>
  );
};

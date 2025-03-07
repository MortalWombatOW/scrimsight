import { useLocation, Link } from "react-router-dom";
import {
  uniquePlayerNamesAtom,
  scrimAtom,
  teamNamesAtom,
  matchDataAtom,
} from "../../atoms";
import { useAtomValue } from "jotai";
import { RiTeamLine } from "react-icons/ri";
import { MdOutlinePersonOutline } from "react-icons/md";
import { FaRegFileAlt } from "react-icons/fa";
import { AiOutlineHome } from "react-icons/ai";
import { TbVs } from "react-icons/tb";
import { useEffect, useState } from "react";

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

  // Initial expanded state based on current path
  const [expandedSections, setExpandedSections] = useState({
    matches: location.pathname.startsWith("/matches"),
    players: location.pathname.startsWith("/players"),
    teams: location.pathname.startsWith("/teams"),
    files: location.pathname.startsWith("/files"),
  });

  useEffect(() => {
    document.title = getTitle(location.pathname);
  }, [location.pathname]);

  // Update expanded sections when location changes
  useEffect(() => {
    setExpandedSections({
      matches: location.pathname.startsWith("/matches"),
      players: location.pathname.startsWith("/players"),
      teams: location.pathname.startsWith("/teams"),
      files: location.pathname.startsWith("/files"),
    });
  }, [location.pathname]);

  const toggleSection = (
    section: keyof typeof expandedSections,
    event: React.MouseEvent
  ) => {
    // If clicking on a navigation item that's also a section header, prevent default
    // to avoid navigating while toggling the section
    if (!location.pathname.endsWith(section)) {
      event.preventDefault();
    }

    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <nav className="h-full w-full overflow-y-auto p-2">
      <ul className="menu menu-md bg-base-100 rounded-box w-full gap-2">
        {/* Home is always visible */}
        <li>
          <Link
            to="/"
            className={location.pathname === "/" ? "active font-semibold" : ""}
            onClick={closeMobileMenu}
          >
            <span className="text-xl">
              <AiOutlineHome />
            </span>
            Home
          </Link>
        </li>

        {/* Matches Section */}
        <li className="mt-4">
          <div
            className="flex items-center justify-between w-full"
            onClick={(e) => toggleSection("matches", e)}
          >
            <Link
              to="/matches"
              className={`flex items-center gap-2 ${
                location.pathname === "/matches" ? "font-semibold" : ""
              }`}
              onClick={closeMobileMenu}
            >
              <span className="text-xl">
                <TbVs />
              </span>
              Matches
            </Link>
            <div className="badge badge-sm badge-primary cursor-pointer">
              {expandedSections.matches ? "-" : "+"}
            </div>
          </div>
        </li>

        {expandedSections.matches && (
          <div className="ml-4 menu-content">
            {scrims.map((scrim, index) => (
              <div
                key={`${scrim.dateString}-${index}`}
                className="collapse collapse-arrow bg-base-200 my-2"
              >
                <input
                  type="checkbox"
                  defaultChecked={scrim.matchIds.some(
                    (id) => location.pathname === `/matches/${id}`
                  )}
                />
                <div className="collapse-title font-medium text-sm py-2">
                  {`${scrim.team1Name} vs ${scrim.team2Name}`}
                  <div className="text-xs text-gray-500">
                    {scrim.dateString}
                  </div>
                </div>
                <div className="collapse-content p-0">
                  <ul className="menu menu-sm">
                    {scrim.matchIds.map((matchId) => (
                      <li key={matchId}>
                        <Link
                          to={`/matches/${matchId}`}
                          className={
                            location.pathname === `/matches/${matchId}`
                              ? "active font-semibold"
                              : ""
                          }
                          onClick={closeMobileMenu}
                        >
                          {`${
                            matchData.find((match) => match.matchId === matchId)
                              ?.map ?? "Unknown Map"
                          } (${
                            matchData.find((match) => match.matchId === matchId)
                              ?.team1Score
                          } - ${
                            matchData.find((match) => match.matchId === matchId)
                              ?.team2Score
                          })`}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Players Section */}
        <li className="menu-title mt-4">
          <div
            className="flex items-center justify-between w-full"
            onClick={(e) => toggleSection("players", e)}
          >
            <Link
              to="/players"
              className={`flex items-center gap-2 ${
                location.pathname === "/players" ? "font-semibold" : ""
              }`}
              onClick={closeMobileMenu}
            >
              <span className="text-xl">
                <MdOutlinePersonOutline />
              </span>
              Players
            </Link>
            <div className="badge badge-sm badge-primary cursor-pointer">
              {expandedSections.players ? "-" : "+"}
            </div>
          </div>
        </li>

        {expandedSections.players && (
          <div className="ml-4 menu-content">
            <ul className="menu menu-sm bg-base-200 rounded-box gap-1 p-2">
              {playerNames.map((name) => (
                <li key={name}>
                  <Link
                    to={`/players/${name}`}
                    className={
                      location.pathname === `/players/${name}`
                        ? "active font-semibold"
                        : ""
                    }
                    onClick={closeMobileMenu}
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Teams Section */}
        <li className="menu-title mt-4">
          <div
            className="flex items-center justify-between w-full"
            onClick={(e) => toggleSection("teams", e)}
          >
            <Link
              to="/teams"
              className={`flex items-center gap-2 ${
                location.pathname === "/teams" ? "font-semibold" : ""
              }`}
              onClick={closeMobileMenu}
            >
              <span className="text-xl">
                <RiTeamLine />
              </span>
              Teams
            </Link>
            <div className="badge badge-sm badge-primary cursor-pointer">
              {expandedSections.teams ? "-" : "+"}
            </div>
          </div>
        </li>

        {expandedSections.teams && (
          <div className="ml-4 menu-content">
            <ul className="menu menu-sm bg-base-200 rounded-box gap-1 p-2">
              {teamNames.map((name) => (
                <li key={name}>
                  <Link
                    to={`/teams/${name}`}
                    className={
                      location.pathname === `/teams/${name}`
                        ? "active font-semibold"
                        : ""
                    }
                    onClick={closeMobileMenu}
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Files Section */}
        <li className="menu-title mt-4">
          <div
            className="flex items-center justify-between w-full"
            onClick={(e) => toggleSection("files", e)}
          >
            <Link
              to="/files"
              className={`flex items-center gap-2 ${
                location.pathname === "/files" ? "font-semibold" : ""
              }`}
              onClick={closeMobileMenu}
            >
              <span className="text-xl">
                <FaRegFileAlt />
              </span>
              Files
            </Link>
            <div className="badge badge-sm badge-primary cursor-pointer">
              {expandedSections.files ? "-" : "+"}
            </div>
          </div>
        </li>

        {/* Files content would go here if there are child items */}
      </ul>
    </nav>
  );
};

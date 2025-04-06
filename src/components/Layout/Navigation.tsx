import { useLocation, Link } from "react-router-dom";
import { scrimAtom, teamNamesAtom, matchDataAtom, useStats } from "../../atoms";
import { useAtomValue } from "jotai";
import { RiTeamLine } from "react-icons/ri";
import { MdOutlinePersonOutline } from "react-icons/md";
import { FaRegFileAlt } from "react-icons/fa";
import { AiOutlineHome } from "react-icons/ai";
import { TbVs } from "react-icons/tb";
import { IoStatsChartOutline } from "react-icons/io5"; // Import chart icon
import { useEffect } from "react";
import RoleIcon from "../Common/RoleIcon";
import { CiMap } from "react-icons/ci";

const getTitle = (pathname: string) => {
  if (pathname === "/") {
    return "Scrimsight";
  }

  if (pathname.startsWith("/scrims")) {
    if (pathname === "/scrims") {
      return "Scrims";
    }
    return `Scrims - ${pathname.split("/").pop()}`;
  }

  if (pathname.startsWith("/player")) {
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

type ScrimsightMenuItem = {
  title: string;
  subtitle?: string;
  link: string;
  icon?: React.ReactNode;
  children?: ScrimsightMenuItem[];
};

export const Navigation = ({
  closeMobileMenu,
}: {
  closeMobileMenu: () => void;
}) => {
  const location = useLocation();

  const scrims = useAtomValue(scrimAtom);
  const teamNames = useAtomValue(teamNamesAtom);
  const matchData = useAtomValue(matchDataAtom);

  const playerAtom = useStats(["playerName", "playerRole"]);
  const playerTeamAtom = useStats(["playerName", "playerTeam"]);

  useEffect(() => {
    document.title = getTitle(location.pathname);
  }, [location.pathname]);

  const renderMenuItem = (item: ScrimsightMenuItem) => {
    const hasChildren = item.children && item.children.length > 0;
    if (hasChildren) {
      return (
        <li key={item.title}>
          <details>
            <summary>
              <Link
                to={item.link}
                className="flex flex-col items-start rounded-md border-b border-base-200 p-2 hover:border-base-300"
                onClick={closeMobileMenu}
              >
                <div className="flex items-center gap-2">
                  {item.icon && <span className="text-xl">{item.icon}</span>}
                  <span className="text-sm font-medium">{item.title}</span>
                </div>
                {item.subtitle && (
                  <span className="text-xs text-base-500">{item.subtitle}</span>
                )}
              </Link>
            </summary>
            <ul>{item.children!.map(renderMenuItem)}</ul>
          </details>
        </li>
      );
    }
    return (
      <li key={item.title}>
        <Link
          to={item.link}
          className="flex flex-col items-start rounded-md p-2"
          onClick={closeMobileMenu}
        >
          <div className="flex items-center gap-2">
            {item.icon && <span className="text-xl">{item.icon}</span>}
            <span className="text-sm font-medium">{item.title}</span>
          </div>
          {item.subtitle && (
            <span className="text-xs text-base-500">{item.subtitle}</span>
          )}
        </Link>
      </li>
    );
  };

  return (
    <nav className="h-full w-full overflow-y-auto">
      <ul className="menu menu-md border border-gray-500 rounded-box w-full gap-2">
        {renderMenuItem({
          title: "Home",
          link: "/",
          icon: <AiOutlineHome />,
        })}
        {renderMenuItem({
          title: "Scrims",
          link: "/scrims",
          icon: <TbVs />,
          children: scrims.map((scrim) => ({
            title: `${scrim.team1Name} vs ${scrim.team2Name}`,
            subtitle: scrim.dateString,
            link: `/scrims/${scrim.team1Name}--${scrim.team2Name}--${scrim.dateString}`,
            children: scrim.matchIds.map((matchId) => {
              const match = matchData.find((m) => m.matchId === matchId);
              return {
                title: `${match?.map} (${match?.team1Score}-${match?.team2Score})`,
                link: `/matches/${matchId}`,
                icon: <CiMap className="text-sm" />,
              };
            }),
          })),
        })}
        {renderMenuItem({
          title: "Players",
          link: "/players",
          icon: <MdOutlinePersonOutline />,
          children: playerAtom.rows.map((player) => ({
            title: `${player.playerName}`,
            icon: <RoleIcon role={player.playerRole} />,
            link: `/player/${player.playerName}`,
            subtitle: playerTeamAtom.rows
              .filter((row) => row.playerName === player.playerName)
              .map((row) => row.playerTeam)
              .join(", "),
          })),
        })}
        {renderMenuItem({
          title: "Teams",
          link: "/teams",
          icon: <RiTeamLine />,
          children: teamNames.map((name) => ({
            title: name,
            link: `/teams/${name}`,
          })),
        })}
        {renderMenuItem({
          // Add Metrics Explorer item
          title: "Metrics Explorer",
          link: "/metrics",
          icon: <IoStatsChartOutline />,
        })}
        {renderMenuItem({
          title: "Files",
          link: "/files",
          icon: <FaRegFileAlt />,
        })}
      </ul>
    </nav>
  );
};

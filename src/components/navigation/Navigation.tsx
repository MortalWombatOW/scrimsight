import { useLocation, Link } from "react-router-dom";
import { RiTeamLine } from "react-icons/ri";
import { MdOutlinePersonOutline } from "react-icons/md";
import { FaRegFileAlt } from "react-icons/fa";
import { AiOutlineHome } from "react-icons/ai";
import { TbVs } from "react-icons/tb";
import { IoStatsChartOutline } from "react-icons/io5";
import { useEffect, useMemo } from "react";
import { RoleIcon } from "@icons";
import { CiMap } from "react-icons/ci";
import { useMatches } from "../../hooks/useRepository";
import { useScrims } from "../../hooks/useScrims";
import { useStats } from "../../hooks/useStats";

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

  const scrimsData = useScrims();
  const matches = useMatches();
  const allPlayerStats = useStats();

  const matchDataValue = useMemo(
    () => matches.map(m => m.metadata),
    [matches]
  );

  const teamNamesData = useMemo(() => {
    const teamSet = new Set<string>();
    for (const match of matches) {
      teamSet.add(match.metadata.team1Name);
      teamSet.add(match.metadata.team2Name);
    }
    return Array.from(teamSet).sort();
  }, [matches]);

  // Compute unique players with their roles and teams
  const playersData = useMemo(() => {
    const playerMap = new Map<string, { role: string; teams: Set<string> }>();
    
    for (const stat of allPlayerStats) {
      if (!playerMap.has(stat.playerName)) {
        playerMap.set(stat.playerName, {
          role: stat.playerRole,
          teams: new Set([stat.playerTeam])
        });
      } else {
        playerMap.get(stat.playerName)!.teams.add(stat.playerTeam);
      }
    }

    return Array.from(playerMap.entries()).map(([name, data]) => ({
      playerName: name,
      playerRole: data.role,
      playerTeam: Array.from(data.teams).join(", ")
    }));
  }, [allPlayerStats]);

  useEffect(() => {
    document.title = getTitle(location.pathname);
  }, [location.pathname]);

  // Function to determine if a menu item is active
  const isActive = (link: string, isParent = false) => {
    if (isParent) {
      // For parent items (like /teams, /players), check if the current path starts with the link
      // Ensure it's not just the root path "/" matching everything
      return link !== "/" && location.pathname.startsWith(link);
    }
    // For specific child items or top-level items, check for exact match
    return location.pathname === link;
  };

  const renderMenuItem = (item: ScrimsightMenuItem) => {
    const hasChildren = item.children && item.children.length > 0;
    if (hasChildren) {
      return (
        <li key={item.title}>
          <details>
            {/* Apply active style to summary for parent items */}
            <summary
              className={
                isActive(item.link, true)
                  ? "bg-primary text-primary-content rounded-md"
                  : ""
              }
            >
              <Link
                to={item.link}
                // Apply active style directly to Link for non-parent items if needed, or rely on parent summary style
                className={`flex flex-col items-start rounded-md border-b border-gray-700 p-2 hover:border-gray-700 ${
                  isActive(item.link) && !hasChildren
                    ? "bg-primary text-primary-content"
                    : "" // Active style for top-level links
                }`}
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
    // Item without children
    return (
      <li key={item.title}>
        <Link
          to={item.link}
          // Apply active style for non-parent items
          className={`flex flex-col items-start rounded-md p-2 ${
            isActive(item.link) ? "bg-primary text-primary-content" : ""
          }`}
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
    // Added padding, use theme background, remove explicit border
    <nav className="h-full w-full overflow-y-auto p-2">
      <ul className="menu menu-md glass-card rounded-box w-full gap-2">
        {renderMenuItem({
          title: "Home",
          link: "/",
          icon: <AiOutlineHome />,
        })}
        {renderMenuItem({
          title: "Scrims",
          link: "/scrims",
          icon: <TbVs />,
          children: scrimsData.map((scrim) => ({
            title: `${scrim.team1Name} vs ${scrim.team2Name}`,
            subtitle: scrim.dateString,
            link: `/scrims/${encodeURIComponent(`${scrim.dateString}-${scrim.team1Name}-vs-${scrim.team2Name}`)}`,
            children: scrim.matchIds.map((matchId) => {
              const match = matchDataValue.find((m) => m.matchId === matchId);
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
          children: playersData.map((player) => ({
            title: `${player.playerName}`,
            icon: <RoleIcon role={player.playerRole} />,
            link: `/player/${player.playerName}`,
            subtitle: player.playerTeam,
          })),
        })}
        {renderMenuItem({
          title: "Teams",
          link: "/teams",
          icon: <RiTeamLine />,
          children: teamNamesData.map((name) => ({
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

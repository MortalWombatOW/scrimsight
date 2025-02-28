import { useParams } from "react-router-dom";
import { useAtomValue } from "jotai";
import { matchDataAtom } from "../../atoms";
import { formatTime, mapNameToFileName } from "../../lib";
import { IoMdCalendar } from "react-icons/io";
import { MdAccessTime } from "react-icons/md";
import { TbClockHour1 } from "react-icons/tb";
import { FiMapPin } from "react-icons/fi";

// Import the extracted components
import { Timeline } from "../../components/Timeline/Timeline";
import { TeamStatsComparison } from "./components/stats/TeamStatsComparison";
import { PlayerStatsComparison } from "./components/stats/PlayerStatsComparison";
import { MatchScoreCard } from "./components/scorecard/MatchScoreCard";
import { AllPlayerComparison } from "./components/comparison/AllPlayerComparison";
import { SingleStatPlayerComparison } from "./components/comparison/SingleStatPlayerComparison";

export const MatchPage2 = () => {
  const { matchId } = useParams<{ matchId: string }>();

  const matchDataList = useAtomValue(matchDataAtom);
  if (!matchDataList || !matchId) {
    return null;
  }
  const matchData = matchDataList.find((match) => match.matchId === matchId);
  if (!matchData) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6 items-center w-full max-w-4xl mx-auto">
      {/* Map Header Section */}
      <section className="bg-white border border-gray-200 p-6 rounded-lg w-full shadow-sm">
        <img
          src={mapNameToFileName(matchData.map, false)}
          alt={matchData.map}
          className="rounded-md h-[250px] w-full object-cover mb-4"
        />
        <div className="flex items-center mb-3">
          <FiMapPin className="mr-2 text-gray-600" />
          <h3 className="text-xl font-semibold text-gray-800">
            {matchData.map} ({matchData.mode})
          </h3>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <IoMdCalendar className="mr-2 text-gray-600" />
            <span className="text-gray-700">
              {new Date(matchData.fileModified).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center">
            <MdAccessTime className="mr-2 text-gray-600" />
            <span className="text-gray-700">
              {new Date(matchData.fileModified).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              })}
            </span>
          </div>
          <div className="flex items-center">
            <TbClockHour1 className="mr-2 text-gray-600" />
            <span className="text-gray-700">
              {formatTime(matchData.duration)}
            </span>
          </div>
        </div>
      </section>

      {/* Match  Section */}
      <MatchScoreCard matchData={matchData} />

      {/* Team Stats Section */}
      <TeamStatsComparison matchId={matchId} />

      {/* Player Stats Section */}
      <PlayerStatsComparison matchId={matchId} />

      {/* All Player Comparison */}
      <AllPlayerComparison matchId={matchId} />

      {/* Timeline Section */}
      <section className="bg-white border border-gray-200 p-4 rounded-lg w-full shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Match Timeline
        </h3>
        <Timeline matchId={matchId} />
      </section>

      {/* Single Stat Comparison */}
      <SingleStatPlayerComparison matchId={matchId} />
    </div>
  );
};

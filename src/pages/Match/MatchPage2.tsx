import { useParams, Outlet, Link, useLocation } from "react-router-dom";
import { useAtomValue } from "jotai";
import { matchDataAtom } from "../../atoms";
import { formatTime, mapNameToFileName } from "../../lib";
import { IoMdCalendar } from "react-icons/io";
import { MdAccessTime } from "react-icons/md";
import { TbClockHour1 } from "react-icons/tb";
import { FiMapPin } from "react-icons/fi";

// Import the extracted components
import { MatchScoreCard } from "./components/scorecard/MatchScoreCard";

export const MatchPage2 = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const location = useLocation();

  const matchDataList = useAtomValue(matchDataAtom);
  if (!matchDataList || !matchId) {
    return null;
  }
  const matchData = matchDataList.find((match) => match.matchId === matchId);
  if (!matchData) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6 items-left w-full mx-auto">
      <div className="flex flex-row gap-4 flex-wrap">
        <section className="bg-white border border-gray-200 p-6 rounded-lg w-fit h-fit shadow-sm flex flex-row flex-wrap gap-4">
          <img
            src={mapNameToFileName(matchData.map, false)}
            alt={matchData.map}
            className="rounded-md w-full md:w-[250px] object-cover"
          />
          <div className="flex flex-col gap-4">
            <div className="text-2xl font-semibold text-gray-800">
              {matchData.team1Name} vs {matchData.team2Name}
            </div>
            <div className="flex items-center mt-auto">
              <FiMapPin className="mr-2 text-gray-600" />
              <h3 className=" font-semibold text-gray-800">
                {matchData.map} ({matchData.mode})
              </h3>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <IoMdCalendar className="mr-2 text-gray-600" />
                <span className="text-gray-700">
                  {new Date(matchData.fileModified).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </span>
              </div>
              <div className="flex items-center">
                <MdAccessTime className="mr-2 text-gray-600" />
                <span className="text-gray-700">
                  {new Date(matchData.fileModified).toLocaleTimeString(
                    "en-US",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: Intl.DateTimeFormat().resolvedOptions()
                        .timeZone,
                    }
                  )}
                </span>
              </div>
              <div className="flex items-center">
                <TbClockHour1 className="mr-2 text-gray-600" />
                <span className="text-gray-700">
                  {formatTime(matchData.duration)}
                </span>
              </div>
            </div>
          </div>
        </section>

        <MatchScoreCard matchData={matchData} />
      </div>

      {/* navigation buttons */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex">
            <Link
              to={`/matches/${matchId}`}
              className={`mr-2 inline-block px-4 py-2 ${
                location.pathname === `/matches/${matchId}`
                  ? "border-b-2 border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                  : "text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300"
              }`}
            >
              Overview
            </Link>
            <Link
              to={`/matches/${matchId}/timeline`}
              className={`mr-2 inline-block px-4 py-2 ${
                location.pathname === `/matches/${matchId}/timeline`
                  ? "border-b-2 border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                  : "text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300"
              }`}
            >
              Timeline
            </Link>
            <Link
              to={`/matches/${matchId}/compare`}
              className={`mr-2 inline-block px-4 py-2 ${
                location.pathname === `/matches/${matchId}/compare`
                  ? "border-b-2 border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                  : "text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300"
              }`}
            >
              Compare
            </Link>
          </nav>
        </div>

        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

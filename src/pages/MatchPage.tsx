import { useParams, Outlet } from "react-router-dom"; // Removed Link, useLocation
import { useAtomValue } from "jotai";
import { matchData, formatTime, mapNameToFileName } from "@library";
import { IoMdCalendar } from "react-icons/io";
import { MdAccessTime } from "react-icons/md";
import { TbClockHour1 } from "react-icons/tb";
import { FiMapPin } from "react-icons/fi";
import { SubPageNavigation, Container, MatchScoreCard } from "@components"; // Added import

const MatchPage = () => {
  const { matchId } = useParams<{ matchId: string }>();
  // Removed unused location variable:
  // const location = useLocation();

  const matchDataList = useAtomValue(matchData.atom);
  if (!matchDataList || !matchId) {
    return null;
  }
  const matchDataItem = matchDataList.find(
    (match) => match.matchId === matchId
  );
  if (!matchDataItem) {
    return null;
  }

  // Define Nav Items for SubPageNavigation
  const matchNavItems = [
    { path: `/matches/${matchId}`, label: "Overview", end: true },
    { path: `/matches/${matchId}/timeline`, label: "Timeline" },
    { path: `/matches/${matchId}/players`, label: "Players" }, // Add Players nav item
    { path: `/matches/${matchId}/compare`, label: "Compare" },
  ];

  return (
    <Container>
      {" "}
      {/* Added Container */}
      <div className="flex flex-row gap-4 flex-wrap mb-6">
        {" "}
        {/* Added mb-6 for spacing */}
        {/* Apply consistent card styling to match details section */}
        <section className="bg-base-200 border border-gray-700 border-gray-700 p-6 rounded-lg w-fit h-fit shadow-md flex flex-row flex-wrap gap-4">
          {" "}
          {/* Updated classes */}
          <img
            src={mapNameToFileName(matchDataItem.map, false)}
            alt={matchDataItem.map}
            className="rounded-md w-full md:w-[250px] object-cover"
          />
          <div className="flex flex-col gap-4">
            <div className="text-2xl font-semibold text-base-800">
              {matchDataItem.team1Name} vs {matchDataItem.team2Name}
            </div>
            <div className="flex items-center mt-auto">
              <FiMapPin className="mr-2 text-base-600" />
              <h3 className=" font-semibold text-base-800">
                {matchDataItem.map} ({matchDataItem.mode})
              </h3>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <IoMdCalendar className="mr-2 text-base-600" />
                <span className="text-base-700">
                  {new Date(matchDataItem.fileModified).toLocaleDateString(
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
                <MdAccessTime className="mr-2 text-base-600" />
                <span className="text-base-700">
                  {new Date(matchDataItem.fileModified).toLocaleTimeString(
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
                <TbClockHour1 className="mr-2 text-base-600" />
                <span className="text-base-700">
                  {formatTime(matchDataItem.duration)}
                </span>
              </div>
            </div>
          </div>
        </section>
        <MatchScoreCard matchData={matchDataItem} />
      </div>
      {/* SubPage Navigation - Apply consistent card styling */}
      <div className="bg-base-200 border border-gray-700 border-gray-700 rounded-lg shadow-md">
        {" "}
        {/* Updated classes */}
        {/* Removed border border-gray-700 classes, using tabs-boxed style */}
        <SubPageNavigation navItems={matchNavItems} />
        <div className="p-6 pt-0">
          {" "}
          {/* Adjusted padding */}
          <Outlet />
        </div>
      </div>
    </Container> // Added closing Container
  );
};

export default MatchPage;

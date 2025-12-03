import { useParams, Outlet } from "react-router-dom";
import { formatTime, mapNameToFileName } from "@library";
import { IoMdCalendar } from "react-icons/io";
import { MdAccessTime } from "react-icons/md";
import { TbClockHour1 } from "react-icons/tb";
import { FiMapPin } from "react-icons/fi";
import { MatchScoreCard, Page, Card } from "@components";
import { useMatch } from "../hooks/useMatch";

const MatchInfoCard = ({ matchData }: { matchData: any }) => (
  <Card className="flex flex-row flex-wrap gap-4 p-6 w-fit h-fit">
    <img
      src={mapNameToFileName(matchData.map, false)}
      alt={matchData.map}
      className="rounded-md w-full md:w-[250px] object-cover"
    />
    <div className="flex flex-col gap-4">
      <div className="text-2xl font-semibold text-base-content">
        {matchData.team1Name} vs {matchData.team2Name}
      </div>
      <div className="flex items-center mt-auto">
        <FiMapPin className="mr-2 text-base-content/70" />
        <h3 className=" font-semibold text-base-content">
          {matchData.map} ({matchData.mode})
        </h3>
      </div>
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center">
          <IoMdCalendar className="mr-2 text-base-content/70" />
          <span className="text-base-content/80">
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
          <MdAccessTime className="mr-2 text-base-content/70" />
          <span className="text-base-content/80">
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
          <TbClockHour1 className="mr-2 text-base-content/70" />
          <span className="text-base-content/80">
            {formatTime(matchData.duration)}
          </span>
        </div>
      </div>
    </div>
  </Card>
);

const MatchPage = () => {
  const { matchId } = useParams<{ matchId: string }>();

  const match = useMatch(matchId || "");

  if (!match || !matchId) {
    return null;
  }

  const matchDataItem = match.metadata;

  // Define Nav Items for SubPageNavigation
  const matchNavItems = [
    { path: `/matches/${matchId}`, label: "Overview", end: true },
    { path: `/matches/${matchId}/timeline`, label: "Timeline" },
    { path: `/matches/${matchId}/players`, label: "Players" }, // Add Players nav item
    { path: `/matches/${matchId}/compare`, label: "Compare" },
  ];

  return (
    <Page>
      <Page.Header>
        <div className="flex flex-row gap-4 flex-wrap mb-6">
          <MatchInfoCard matchData={matchDataItem} />
          <MatchScoreCard matchData={matchDataItem} />
        </div>
      </Page.Header>
      
      <Page.Navigation navItems={matchNavItems} />
      
      <Page.Content>
        <Outlet />
      </Page.Content>
    </Page>
  );
};

export default MatchPage;

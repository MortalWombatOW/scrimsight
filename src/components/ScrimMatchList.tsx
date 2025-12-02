import { useAtomValue } from "jotai";
import { contextualStatAtoms, MatchData, formatTime } from "@library";
import { MatchCard } from "@components";

interface ScrimMatchListProps {
  scrimId: string;
}

export const ScrimMatchList = ({ scrimId }: ScrimMatchListProps) => {
  const matches = useAtomValue(
    contextualStatAtoms.matchStatsForScrimAtom({ scrimId })
  );

  if (!matches || matches.length === 0)
    return <p>No match data found for this scrim.</p>;

  return (
    <div className="flex flex-col md:flex-row flex-wrap gap-4">
      {matches.map((match: MatchData) => (
        <MatchCard
          key={match.matchId}
          title={`${match.map} (${match.mode})`}
          teamNames={[match.team1Name, match.team2Name]}
          date={match.dateString}
          mapName={match.map}
          primaryStats={[
            {
              value: `${match.team1Score} - ${match.team2Score}`,
              label: "Score",
            },
          ]}
          secondaryStats={[
            { value: formatTime(match.duration), label: "Duration" },
          ]}
          linkUrl={`/matches/${match.matchId}`}
        />
      ))}
    </div>
  );
};

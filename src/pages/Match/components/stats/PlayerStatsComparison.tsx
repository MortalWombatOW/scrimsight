import { useAtomValue } from "jotai";
import { Group, Paper, Stack, Title } from "@mantine/core";
import { matchDataAtom, useStats } from "../../../../atoms";
import { PlayerStatsCard } from "./PlayerStatsCard";

interface PlayerStatsComparisonProps {
  matchId: string;
}

export const PlayerStatsComparison = ({
  matchId,
}: PlayerStatsComparisonProps) => {
  const matchData = useAtomValue(matchDataAtom).find(
    (match) => match.matchId === matchId
  );
  const playerStats = useStats(["playerName", "playerTeam", "playerRole"], {
    matchId: [matchId],
  });

  if (!matchData) {
    return null;
  }

  return (
    <Paper p="0">
      <Stack gap="md">
        <Stack>
          <Title order={3}>{matchData.team1Name} Players</Title>
          <Group align="flex-start">
            {playerStats.rows
              .filter((stats) => stats.playerTeam === matchData.team1Name)
              .map((player) => (
                <PlayerStatsCard
                  key={player.playerName}
                  playerName={player.playerName}
                  matchId={matchId}
                />
              ))}
          </Group>
        </Stack>
        <Stack>
          <Title order={3}>{matchData.team2Name} Players</Title>
          <Group align="flex-start">
            {playerStats.rows
              .filter((stats) => stats.playerTeam === matchData.team2Name)
              .map((player) => (
                <PlayerStatsCard
                  key={player.playerName}
                  playerName={player.playerName}
                  matchId={matchId}
                />
              ))}
          </Group>
        </Stack>
      </Stack>
    </Paper>
  );
};

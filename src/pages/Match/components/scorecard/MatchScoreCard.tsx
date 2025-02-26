import { Grid, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { GoTrophy } from "react-icons/go";

interface MatchScoreCardProps {
  matchData: {
    team1Name: string;
    team2Name: string;
    team1Score: number;
    team2Score: number;
    roundWinners: ("team1" | "team2" | "draw")[];
  };
}

export const MatchScoreCard = ({ matchData }: MatchScoreCardProps) => {
  return (
    <Paper withBorder p="md">
      <Stack miw={300} gap="xs">
        <Grid>
          <Grid.Col
            span={4}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text size="xs">Round</Text>
          </Grid.Col>
          <Grid.Col
            span={8}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text size="xs">Winner</Text>
          </Grid.Col>
        </Grid>
        {matchData.roundWinners.map((winner, index) => (
          <Grid key={index}>
            <Grid.Col
              span={4}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text>{index + 1}</Text>
            </Grid.Col>
            <Grid.Col span={8}>
              <Paper
                bg={
                  winner === "team1"
                    ? "blue.9"
                    : winner === "team2"
                    ? "redDark.6"
                    : "gray.9"
                }
                p="xs"
                ta="center"
              >
                <Text>
                  {winner === "team1"
                    ? matchData.team1Name
                    : winner === "team2"
                    ? matchData.team2Name
                    : "Draw"}
                </Text>
              </Paper>
            </Grid.Col>
          </Grid>
        ))}
        <Grid>
          <Grid.Col
            span={4}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Group gap="xs">
              <GoTrophy size={16} />
              <Text size="xs">Winner</Text>
            </Group>
          </Grid.Col>
          <Grid.Col span={8}>
            <Paper
              bg={
                matchData.team1Score > matchData.team2Score
                  ? "blue.8"
                  : matchData.team2Score > matchData.team1Score
                  ? "redDark.6"
                  : "gray.9"
              }
              p="xs"
              ta="center"
            >
              <Text fw={700} mb={10}>
                {matchData.team1Score > matchData.team2Score
                  ? matchData.team1Name
                  : matchData.team2Score > matchData.team1Score
                  ? matchData.team2Name
                  : "Draw"}
              </Text>
              <Group grow>
                <Paper withBorder bg="blue.8" p="xs">
                  <Title order={2}>{matchData.team1Score}</Title>
                </Paper>
                <Paper withBorder bg="redDark.8" p="xs">
                  <Title order={2}>{matchData.team2Score}</Title>
                </Paper>
              </Group>
            </Paper>
          </Grid.Col>
        </Grid>
      </Stack>
    </Paper>
  );
};

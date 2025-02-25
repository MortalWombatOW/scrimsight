import { useParams } from "react-router-dom";
import { useAtomValue } from "jotai";
import { matchDataAtom } from "../../atoms";
import { Title, Group, Grid, Paper, Stack, Text, Image } from "@mantine/core";
import { formatTime } from "../../lib/format";
import { mapNameToFileName } from "../../lib/string";
import { IoMdCalendar } from "react-icons/io";
import { MdAccessTime } from "react-icons/md";
import { TbClockHour1 } from "react-icons/tb";
import { FiMapPin } from "react-icons/fi";

// Import the extracted components
import { Timeline } from "./components/timeline/Timeline";
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
    <Group align="flex-start">
      <Grid>
        <Grid.Col span={{ base: 12, md: 8, sm: 12 }}>
          <Paper withBorder w="100%" p="lg" bg="dark.6">
            <Group>
              <Stack gap="0">
                <Image
                  src={mapNameToFileName(matchData.map, false)}
                  radius="sm"
                  h={200}
                  w="100%"
                />
                <Group p="xs">
                  <FiMapPin />
                  <Title order={3}>
                    {matchData.map} ({matchData.mode})
                  </Title>
                </Group>
                <Group p="xs">
                  <Group>
                    <IoMdCalendar />
                    <Text>
                      {new Date(matchData.fileModified).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </Text>
                  </Group>
                  <Group>
                    <MdAccessTime />
                    <Text>
                      {new Date(matchData.fileModified).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZone: Intl.DateTimeFormat().resolvedOptions()
                            .timeZone,
                        }
                      )}
                    </Text>
                  </Group>
                  <Group>
                    <TbClockHour1 />
                    <Text>{formatTime(matchData.duration)}</Text>
                  </Group>
                </Group>
              </Stack>
            </Group>
            <Group>
              <PlayerStatsComparison matchId={matchId} />
              <AllPlayerComparison matchId={matchId} />
            </Group>
            <Timeline matchData={matchData} />
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4, sm: 12 }}>
          <MatchScoreCard matchData={matchData} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4, sm: 12 }}>
          <TeamStatsComparison matchId={matchId} />
        </Grid.Col>
      </Grid>

      <SingleStatPlayerComparison matchId={matchId} />
    </Group>
  );
};

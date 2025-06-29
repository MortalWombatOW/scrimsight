import { User } from "lucide-react";
import { useScrimsightData } from "../hooks/useScrimsightData";
import ScrimsightPage from "../components/ScrimsightPage";
import PageHeader from "../components/PageHeader";
import PageSection from "../components/PageSection";
import PlayerList from "../components/PlayerList";
import EmptyState from "../components/EmptyState";
import BreadCrumbs from "../components/BreadCrumbs";
import { getRoute } from "../lib/route";

const PlayersPage = () => {
  const dataModel = useScrimsightData();
  const { players } = dataModel;

  const breadcrumbs = [
    { label: "Home", path: getRoute("/") },
    { label: "Players" }
  ];

  return (
    <ScrimsightPage>
      <PageHeader>
        <BreadCrumbs items={breadcrumbs} />
        <PageHeader.Icon>
          <User size={32} />
        </PageHeader.Icon>
        <PageHeader.Title>Players</PageHeader.Title>
      </PageHeader>

      {players.length > 0 ? (
        <PageSection>
          <PageSection.Title>All Players</PageSection.Title>
          <PageSection.Description>
            Browse all players in the dataset and view their individual statistics and performance metrics.
          </PageSection.Description>
          <PageSection.Content>
            <PlayerList players={players} />
          </PageSection.Content>
        </PageSection>
      ) : (
        <EmptyState
          icon={User}
          title="No players found"
          description="There are no players available in the current dataset."
          size="lg"
        />
      )}
    </ScrimsightPage>
  );
};

export default PlayersPage;

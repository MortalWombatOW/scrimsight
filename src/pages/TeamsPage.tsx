import { Users } from "lucide-react";
import { useScrimsightData } from "../hooks/useScrimsightData";
import ScrimsightPage from "../components/ScrimsightPage";
import PageHeader from "../components/PageHeader";
import PageSection from "../components/PageSection";
import TeamList from "../components/TeamList";
import BreadCrumbs from "../components/BreadCrumbs";

import { getRoute } from "../lib/route";

const TeamsPage = () => {
  const dataModel = useScrimsightData();
  const { teams } = dataModel;

  const breadcrumbs = [
    { label: "Home", path: getRoute("/") },
    { label: "Teams" }
  ];

  return (
    <ScrimsightPage>
      <PageHeader>
        <BreadCrumbs items={breadcrumbs} />
        <PageHeader.Icon>
          <Users size={32} />
        </PageHeader.Icon>
        <PageHeader.Title>Teams</PageHeader.Title>
      </PageHeader>

      <PageSection>
        <PageSection.Title>All Teams</PageSection.Title>
        <PageSection.Description>
          Browse all teams in the dataset and view their roster compositions and match history.
        </PageSection.Description>
        <PageSection.Content>
          <TeamList teams={teams} />
        </PageSection.Content>
      </PageSection>
    </ScrimsightPage>
  );
};

export default TeamsPage;

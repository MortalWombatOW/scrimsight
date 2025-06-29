import { useMemo } from "react";
import { Trophy } from "lucide-react";

import { useScrimsightData } from "../hooks/useScrimsightData";
import ScrimsightPage from "../components/ScrimsightPage";
import PageHeader from "../components/PageHeader";
import BreadCrumbs from "../components/BreadCrumbs";
import MatchList from "../components/MatchList";
import EmptyState from "../components/EmptyState";
import { getRoute } from "../lib/route";

const MatchesPage = () => {
  const dataModel = useScrimsightData();
  const { matches } = dataModel;

  const breadcrumbs = useMemo(() => [
    { label: "Home", path: getRoute("/") },
    { label: "Matches" },
  ], []);

  return (
    <ScrimsightPage>
      <PageHeader>
        <BreadCrumbs items={breadcrumbs} />
        <PageHeader.Icon>
          <Trophy size={32} />
        </PageHeader.Icon>
        <PageHeader.Title>Matches</PageHeader.Title>
      </PageHeader>

      {matches.length > 0 ? (
        <MatchList matches={matches} />
      ) : (
        <EmptyState
          icon={Trophy}
          title="No matches found"
          description="There are no matches available in the current dataset."
          size="lg"
        />
      )}
    </ScrimsightPage>
  );
};

export default MatchesPage;

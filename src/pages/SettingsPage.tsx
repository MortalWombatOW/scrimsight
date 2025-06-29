import { useMemo } from "react";
import { Settings } from "lucide-react";
import { useAtom } from "jotai";

import ScrimsightPage from "../components/ScrimsightPage";
import PageHeader from "../components/PageHeader";
import BreadCrumbs from "../components/BreadCrumbs";
import { sampleDataEnabledAtom } from "../atoms/sampleDataEnabled";
import { getRoute } from "../lib/route";

const SettingsPage = () => {
  const [sampleDataEnabled, setSampleDataEnabled] = useAtom(sampleDataEnabledAtom);

  const breadcrumbs = useMemo(() => [
    { label: "Home", path: getRoute("/") },
    { label: "Settings" },
  ], []);

  return (
    <ScrimsightPage>
      <PageHeader>
        <BreadCrumbs items={breadcrumbs} />
        <PageHeader.Icon>
          <Settings size={32} />
        </PageHeader.Icon>
        <PageHeader.Title>Settings</PageHeader.Title>
      </PageHeader>

      <div className="p-6 bg-base-100 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Data Options</h2>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Enable Sample Data</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={sampleDataEnabled}
              onChange={(e) => setSampleDataEnabled(e.target.checked)}
            />
          </label>
        </div>
      </div>
    </ScrimsightPage>
  );
};

export default SettingsPage;

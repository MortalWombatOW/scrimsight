import type { Meta, StoryObj } from "@storybook/react";
import { Provider } from "jotai";
import { BrowserRouter } from "react-router-dom";
import ScrimsPage from "./ScrimsPage";
import { dataModelAtom } from "../atoms/scrimsight";
import { generateMockDataModel } from "../library/sampleData";

const meta: Meta<typeof ScrimsPage> = {
  title: "Pages/ScrimsPage",
  component: ScrimsPage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div className="min-h-screen bg-base-200">
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockDataModel = generateMockDataModel();

export const Default: Story = {
  decorators: [
    (Story) => (
      <Provider
        initialValues={[[dataModelAtom, mockDataModel]]}
      >
        <Story />
      </Provider>
    ),
  ],
};

export const EmptyState: Story = {
  decorators: [
    (Story) => (
      <Provider
        initialValues={[[dataModelAtom, null]]}
      >
        <Story />
      </Provider>
    ),
  ],
};

export const SingleScrim: Story = {
  decorators: [
    (Story) => {
      const singleScrimData = {
        ...mockDataModel,
        scrims: mockDataModel.scrims.slice(0, 1),
      };
      return (
        <Provider
          initialValues={[[dataModelAtom, singleScrimData]]}
        >
          <Story />
        </Provider>
      );
    },
  ],
};

export const ManyScrims: Story = {
  decorators: [
    (Story) => {
      const manyScrims = Array.from({ length: 20 }, (_, i) => ({
        ...mockDataModel.scrims[0],
        scrim: `scrim-${i + 1}`,
        teams: [`Team ${i % 4 + 1}`, `Team ${(i + 1) % 4 + 5}`] as [string, string],
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        team1MatchesWon: Math.floor(Math.random() * 4),
        team2MatchesWon: Math.floor(Math.random() * 4),
      }));

      const manyScrimsData = {
        ...mockDataModel,
        scrims: manyScrims,
      };

      return (
        <Provider
          initialValues={[[dataModelAtom, manyScrimsData]]}
        >
          <Story />
        </Provider>
      );
    },
  ],
};
import type { Preview } from "@storybook/react-vite";

import { withThemeFromJSXProvider } from "@storybook/addon-themes";

import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider as JotaiProvider } from "jotai";
import { TimelineProvider } from "../src/components/TimelineContext";
import "../src/index.css";

const preview: Preview = {
  tags: ["autodocs"],

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },

  decorators: [
    (Story) => (
      <JotaiProvider>
        <BrowserRouter>
          <div style={{ padding: '16px' }}>
            <Story />
          </div>
        </BrowserRouter>
      </JotaiProvider>
    ),
  ],
};

export default preview;

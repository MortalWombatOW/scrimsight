import type { Preview } from "@storybook/react";

import { ThemeProvider, CssBaseline } from '@mui/material';
import { withThemeFromJSXProvider } from '@storybook/addon-themes';

import { themeDef } from '../src/theme';
import WombatDataWrapper from '../src/components/WombatDataWrapper/WombatDataWrapper';
import React from "react";

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

  decorators: [withThemeFromJSXProvider({
    GlobalStyles: CssBaseline,
    Provider: ThemeProvider,
    themes: {
      // Provide your custom themes here
      light: themeDef,
      dark: themeDef,
    },
    defaultTheme: 'dark',
  }),
  (Story) => (
    <WombatDataWrapper>
      <Story />
    </WombatDataWrapper>
  ),
]
};

export default preview;

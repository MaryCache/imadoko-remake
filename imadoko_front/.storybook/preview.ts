import type { Preview } from '@storybook/nextjs';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import '../src/app/globals.css';

const preview: Preview = {
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
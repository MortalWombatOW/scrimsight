import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import App from './App';

// setupDB(() => {
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}
const root = createRoot(rootElement);
root.render(
  // <React.StrictMode>
  <App />,
  // </React.StrictMode>,
);
// });

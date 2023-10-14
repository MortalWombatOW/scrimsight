import React from 'react';
import {createRoot} from 'react-dom/client';
import './index.scss';
import App from './App';
import {setupDB} from './lib/data/database';

setupDB(() => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const root = createRoot(document.getElementById('root')!);
  root.render(
    // <React.StrictMode>
    <App />,
    // </React.StrictMode>,
  );
});

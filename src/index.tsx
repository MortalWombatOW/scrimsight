import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import {setupDB} from './lib/data/database';
import {setupGlobalState} from './lib/globalstate';

setupGlobalState();
setupDB(() => {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root'),
  );
});

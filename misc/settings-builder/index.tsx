import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

declare var readyPromise: Promise<void>;

readyPromise
  .then(() => {
    const root = ReactDOM.createRoot(document.getElementById('settings-controller')!);
    root.render(<App />);
  });

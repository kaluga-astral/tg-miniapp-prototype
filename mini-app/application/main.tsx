import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';

import App from './app';

const renderApp = (): void => {
  const root = document.getElementById('root');

  if (!root) {
    throw Error('Рут не найден');
  }

  createRoot(root).render(
    <StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </StrictMode>,
  );
};

renderApp();

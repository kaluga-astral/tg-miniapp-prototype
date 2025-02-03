import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './app';

const renderApp = (): void => {
  const root = document.getElementById('root');

  if (!root) {
    throw Error('Рут не найден');
  }

  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
};

renderApp();

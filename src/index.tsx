import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './styles/tokens.css';
import './styles/global.css';
import { App } from './App';

const container = document.getElementById('root');

if (container === null) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(container);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

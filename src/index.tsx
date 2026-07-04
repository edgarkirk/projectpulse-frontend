import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';
import { App } from './App';

const rootElement = document.getElementById('root');

if (rootElement === null) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);
root.render(<App />);

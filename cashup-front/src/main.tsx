import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App';

// Find the root element in your HTML (e.g., index.html)
const container = document.getElementById('root');

// Create the root and render the application
const root = createRoot(container!);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

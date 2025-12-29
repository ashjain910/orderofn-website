import React from 'react';
import ReactDOM from 'react-dom/client'; // <-- use .client for React 18+
import App from './App';
import { LoaderProvider } from './context/LoaderProvider.js';
import { HashRouter as Router } from 'react-router-dom';
import './styles/bootstrap-custom.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <LoaderProvider>
      <App />
    </LoaderProvider>
  </Router>
);
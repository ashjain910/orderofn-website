import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { LoaderProvider } from './context/LoaderProvider';

ReactDOM.render(
  <React.StrictMode>
    <LoaderProvider>
      <App />
    </LoaderProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
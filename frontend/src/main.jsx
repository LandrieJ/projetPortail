// /src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client'; // Notez l'importation de 'react-dom/client'
import { Provider } from 'react-redux';
import { store } from './redux'; // Assurez-vous que le chemin vers votre store est correct
import App from './App';
import './index.css'
import 'flowbite/dist/flowbite.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import AuthProvider from './context/authContext';
import { BrowserRouter } from 'react-router-dom'
import AddCartProvider from './context/addCart';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
      <AddCartProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
      </AddCartProvider>
  </AuthProvider>
);

reportWebVitals();

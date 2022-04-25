// import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Render from './pages/Render';
import Viewer from './pages/Viewer';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Viewer />} />
      <Route path="render" element={<Render />} />
    </Routes>
  </BrowserRouter>,
  // </React.StrictMode>,
);

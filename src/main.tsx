// import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Home from './pages/Home';
import Render from './pages/Render';
import Viewer from './pages/Viewer';
import ClientView from './pages/ClientView';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="/render/:model" element={<Render />} />
      <Route path="/viewer/:model" element={<Viewer />} />
      {/* <Route path="/client/:peer" element={<ClientView />} /> */}
      <Route path="*" element={<Home />} />
    </Routes>
  </BrowserRouter>,
  // </React.StrictMode>,
);

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from "./components/menu/menu.jsx";
import MenuAdmin from "./components/menu/menuAdmin.jsx";

import App from './App.jsx'

// 
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/admin/menu" element={<MenuAdmin />} />
      </Routes>
    </Router>
  </StrictMode>,
)
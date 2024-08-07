import React from "react";
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/home';
import Disclaimer from './pages/disclaimer';

const root = ReactDOM.createRoot(document.getElementById('root'));

const path='/KanKei'

root.render(
  <>
    <Router>
      <Routes>
        <Route exact path={path} element={<Home />} />
        <Route path={`${path}/about`} element={<Disclaimer />} />
      </Routes>
    </Router>
  </>
)
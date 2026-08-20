import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { TourProvider } from './context/TourContext';
import RootLayout from './layouts/RootLayout';

import Home from './pages/Home';
import Explore from './pages/Explore';
import HeritageDetail from './pages/HeritageDetail';
import AiGuide from './pages/AiGuide';
import Languages from './pages/Languages';
import About from './pages/About';

function App() {
  return (
    <LanguageProvider>
      <TourProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootLayout />}>
              <Route index element={<Home />} />
              <Route path="explore" element={<Explore />} />
              <Route path="explore/:slug" element={<HeritageDetail />} />
              <Route path="heritage/:slug" element={<HeritageDetail />} />
              <Route path="guide" element={<AiGuide />} />
              <Route path="ai-guide" element={<AiGuide />} />
              <Route path="languages" element={<Languages />} />
              <Route path="about" element={<About />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TourProvider>
    </LanguageProvider>
  );
}

export default App;

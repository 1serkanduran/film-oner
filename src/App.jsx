import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header';
import Moods from './components/moods/Moods';
import Movies from './components/movies/Movies';
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <Routes>
          <Route path="/" exact element={<Moods />} />
          <Route path="/movies/:mood" element={<Movies />} />
        </Routes>
        {/* <Footer /> */} 
        <Analytics />
      </div>
    </BrowserRouter>
  );
}

export default App;

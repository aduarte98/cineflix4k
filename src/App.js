import React from 'react';
import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home/home';
import Filmes from './pages/Filmes/filmes';
import Series from './pages/Series/series';
import TvAoVivo from './pages/TvAoVivo/tv';
import Conteudo from './pages/pagina_conteudo/index';
import { SearchProvider } from './context/SearchContext';
import ConteudoAoVivo from './pages/pagina_conteudoTV/index';

function App() {
  const location = useLocation();
  const isSpecialPage = ['/filmes', '/series', '/tv-ao-vivo'].includes(location.pathname);
  const bodyClass = isSpecialPage ? 'special-margin' : 'default-margin';

  return (
    <div className={bodyClass}>
      <SearchProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/filmes" element={<Filmes />} />
          <Route path="/series" element={<Series />} />
          <Route path="/tv-ao-vivo" element={<TvAoVivo />} />
          <Route path="/filmes/:id/:tipo1" element={<Conteudo />} />
          <Route path="/series/:id/:tipo1" element={<Conteudo />} />
          <Route path="/tv-ao-vivo/:id" element={<ConteudoAoVivo />} />
        </Routes>
      </SearchProvider>
    </div>
  );
}

export default App;

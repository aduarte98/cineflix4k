import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../components/Header/header';
import './styles.css'; // Arquivo de estilos customizados
import Footer from '../../components/Footer/footer';

const API_KEY = 'c5c8e6e09d68c0e14442d88242f42487';
const BASE_URL = 'https://api.themoviedb.org/3';

const Series = () => {
  const [series, setSeries] = useState([]);
  const [genres, setGenres] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const currentPage = parseInt(queryParams.get('page')) || 1;
  const selectedGenre = queryParams.get('genre') || '';
  const searchTerm = queryParams.get('search') || '';

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        let url = `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=pt-BR&page=${currentPage}`;
        if (selectedGenre) {
          url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=pt-BR&page=${currentPage}&with_genres=${selectedGenre}`;
        }
        if (searchTerm) {
          url = `${BASE_URL}/search/tv?api_key=${API_KEY}&language=pt-BR&page=${currentPage}&query=${encodeURIComponent(searchTerm)}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        setSeries(data.results || []);
        setTotalPages(Math.min(data.total_pages, 500));
      } catch (error) {
        console.error('Erro ao buscar séries:', error);
      }
    };

    const fetchGenres = async () => {
      try {
        const response = await fetch(`${BASE_URL}/genre/tv/list?api_key=${API_KEY}&language=pt-BR`);
        const data = await response.json();
        setGenres(data.genres);
      } catch (error) {
        console.error('Erro ao buscar gêneros:', error);
      }
    };

    fetchSeries();
    fetchGenres();
  }, [currentPage, selectedGenre, searchTerm]);

  const handlePageClick = (pageNumber) => {
    queryParams.set('page', pageNumber);
    navigate(`?${queryParams.toString()}`);
    window.scrollTo(0, 0);
  };

  const handleGenreChange = (e) => {
    queryParams.set('genre', e.target.value);
    queryParams.set('page', 1);
    navigate(`?${queryParams.toString()}`);
  };

  const handleCardClick = (conteudo) => {
    const id = conteudo.id;
    navigate(`/series/${id}/2`);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
            <button className="page-link" onClick={() => handlePageClick(i)}>
              {i}
            </button>
          </li>
        );
      }
    } else {
      let startPage, endPage;
      if (currentPage <= 3) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage + 2 >= totalPages) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }

      if (startPage > 1) {
        pages.push(
          <li key="first" className="page-item">
            <button className="page-link" onClick={() => handlePageClick(1)}>
              1
            </button>
          </li>
        );
        if (startPage > 2) {
          pages.push(
            <li key="ellipsis-start" className="page-item disabled">
              <span className="page-link">...</span>
            </li>
          );
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
            <button className="page-link" onClick={() => handlePageClick(i)}>
              {i}
            </button>
          </li>
        );
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push(
            <li key="ellipsis-end" className="page-item disabled">
              <span className="page-link">...</span>
            </li>
          );
        }
        pages.push(
          <li key="last" className="page-item">
            <button className="page-link" onClick={() => handlePageClick(totalPages)}>
              {totalPages}
            </button>
          </li>
        );
      }
    }

    return pages;
  };

  return (
    <>
      <Header />
      <div className="container-fluid container-filme">
        <div className="row mb-4">
          <div className="col-12 text-center"> {/* Centraliza o conteúdo */}
            <h4 className="mb-3">Filtrar por Gênero</h4>
            <select
              className="form-control col-8 col-md-6 col-lg-4 mx-auto text-center custom-select"
              value={selectedGenre}
              onChange={handleGenreChange}
            >
              <option value="" className='optionValor'>Todos os Gêneros</option>
              {genres.map(genre => (
                <option className='optionValor' key={genre.id} value={genre.id}>{genre.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="row">
          {series.map(serie => (
            <div key={serie.id} className="col-6 col-md-4 col-lg-3 mb-4">
              <div className="card h-100 border-0" onClick={() => handleCardClick(serie)}>
                <img
                  className="card-img-top"
                  src={`https://image.tmdb.org/t/p/w500${serie.poster_path}`}
                  alt={serie.name}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="row">
          <div className="col-12">
            <nav>
              <ul className="pagination justify-content-center custom-pagination">
                {currentPage > 1 && (
                  <li className="page-item">
                    <button className="page-link" onClick={() => handlePageClick(currentPage - 1)}>
                      &laquo;
                    </button>
                  </li>
                )}
                {renderPageNumbers()}
                {currentPage < totalPages && (
                  <li className="page-item">
                    <button className="page-link" onClick={() => handlePageClick(currentPage + 1)}>
                      &raquo;
                    </button>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Series;

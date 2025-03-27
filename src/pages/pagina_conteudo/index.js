import React, { useState, useEffect } from 'react';
import { useLocation, useParams, Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../components/Header/header';
import './styles.css';
import Seta from '../../assets/seta direita.png';
import Footer from "../../components/Footer/footer";

const Conteudo = () => {
  const { id, tipo1 } = useParams(); // Captura id e tipo1 da URL
  const location = useLocation();
  const navigate = useNavigate(); // Hook para navegação

  const [contentData, setContentData] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [genres, setGenres] = useState([]);
  const [iframeUrl, setIframeUrl] = useState('');
  const [imdbId, setImdbId] = useState('');
  const [activeButton, setActiveButton] = useState('option_t');
  const [recommendations, setRecommendations] = useState([]);

  const tipo = tipo1 === '2' ? 'series' : 'movies'; // Determina o tipo com base em tipo1

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const fetchConteudo = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/${tipo === 'series' ? 'tv' : 'movie'}/${id}?api_key=c5c8e6e09d68c0e14442d88242f42487&language=pt-BR&append_to_response=videos`);
        if (!response.ok) {
          throw new Error('Falha ao carregar conteúdo');
        }
        const data = await response.json();
        setContentData(data);
        setImageUrl(`https://image.tmdb.org/t/p/original${data.backdrop_path}`);
        setGenres(data.genres);

        // Defina o iframe inicial com o trailer principal (caso exista)
        if (data.videos && data.videos.results.length > 0) {
          const trailer = data.videos.results.find(video => video.type === 'Trailer');
          if (trailer) {
            setIframeUrl(`https://www.youtube.com/embed/${trailer.key}`);
          } else {
            const teaser = data.videos.results.find(video => video.type === 'Teaser');
            if (teaser) {
              setIframeUrl(`https://www.youtube.com/embed/${teaser.key}`);
            } else {
              setIframeUrl(null); // Define o iframeUrl como null para indicar que não há vídeo
            }
          }
        } else {
          setIframeUrl(null); // Define o iframeUrl como null se não houver vídeos
        }

        // Buscar recomendações
        const recommendationsResponse = await fetch(`https://api.themoviedb.org/3/${tipo === 'series' ? 'tv' : 'movie'}/${id}/recommendations?api_key=c5c8e6e09d68c0e14442d88242f42487&language=pt-BR`);
        if (!recommendationsResponse.ok) {
          throw new Error('Falha ao carregar recomendações');
        }
        const recommendationsData = await recommendationsResponse.json();
        setRecommendations(recommendationsData.results.slice(0, 4)); // Pega as primeiras 4 recomendações

        // Buscar o imdb_id se for um filme ou série
        const externalIdsResponse = await fetch(`https://api.themoviedb.org/3/${tipo === 'series' ? 'tv' : 'movie'}/${id}/external_ids?api_key=c5c8e6e09d68c0e14442d88242f42487`);
        if (!externalIdsResponse.ok) {
          throw new Error('Falha ao carregar imdb_id');
        }
        const externalIdsData = await externalIdsResponse.json();
        setImdbId(externalIdsData.imdb_id);
      } catch (error) {
        console.error('Erro ao buscar conteúdo:', error);
      }
    };

    if (id && tipo1) {
      fetchConteudo();
    }
  }, [tipo, id, tipo1]);

  const handleIframeChange = (url, buttonId) => {
    setActiveButton(buttonId);

    if (buttonId === 'option7' && tipo === 'movies') {
      // Introduza um atraso antes de definir o URL do iframe para o Player 7
      setTimeout(() => {
        setIframeUrl(url); // Define o URL diretamente
      }, 2000); // Ajuste o tempo conforme necessário
    } else if (buttonId === 'option4' && tipo === 'series') {
      // Introduza um atraso antes de definir o URL do iframe para o Player 4
      setTimeout(() => {
        setIframeUrl(url); // Define o URL diretamente
      }, 2000); // Ajuste o tempo conforme necessário
    } else {
      // Para outros players, use o sandbox
      setIframeUrl(url);
    }
  };

  const handleTrailerClick = () => {
    navigate(0); // Atualizar a página
  };

  return (
    <>
      <Header />
      <div className="conteudo-page">
        <div className="background-trailer" style={{ backgroundImage: `url(${imageUrl})` }}>
          <div className="content-info">
            <h2>{contentData && (contentData.title || contentData.name)}</h2>
            <p className="content-synopsis">{contentData && contentData.overview}</p>
            <div className="rating">
              <i className="star-icon">★</i> {contentData && contentData.vote_average} ({contentData && contentData.vote_count})
            </div>
            <div className="genres">
              {genres && genres.map(genre => (
                <span key={genre.id} className="genre">{genre.name}</span>
              ))}
            </div>
            <div className="duration">
              {tipo === 'series' ? `${contentData && contentData.number_of_seasons} temporadas, ${contentData && contentData.number_of_episodes} episódios` : `${contentData && contentData.runtime} min`}
            </div>
            <div className="release-date">
              Data de lançamento: {contentData && new Date(contentData.release_date || contentData.first_air_date).getFullYear()}
            </div>

          </div>
        </div>
        <div className="iframe-and-buttons">
          <div className="iframe-container">
            {iframeUrl ? (
              <iframe
                id="videoIframe"
                title={contentData.id}
                src={iframeUrl}
                scrolling={activeButton === 'option3' ? 'yes' : 'no'}
                frameBorder="0"
                allowFullScreen
                width="100%"
                height="360"
                sandbox={['option7', 'option4'].includes(activeButton) ? undefined : "allow-scripts allow-same-origin allow-presentation"} // Condicionalmente define o sandbox
              ></iframe>
            ) : (
              <h6>Não há trailer ou teaser disponível</h6>
            )}
          </div>
          <div className="button-container">
            <Link to={location.pathname} onClick={handleTrailerClick} className="botao-Op1" style={tipo === 'series' ? { height: '50px', padding: '15px 60px 0 0' } : { height: '70px', padding: '5px 60px 0 0' }} id="option_t">
              {activeButton === 'option_t' && <img src={Seta} alt='img1' style={{ height: 30, marginRight: 30 }} />}
              Trailer
            </Link>
            {tipo === 'movies' && (
              <>
                <button
                  className='botao-Op'
                  id="option1"
                  onClick={() => handleIframeChange(`https://superflixapi.cc/filme/${id}`, 'option1')}
                >
                  {activeButton === 'option1' && <img src={Seta} alt='img2' style={{ height: 30, marginRight: 30 }} />}
                  Player 1
                </button>
                <button
                  className='botao-Op'
                  id="option2"
                  onClick={() => handleIframeChange(`https://embed.embedplayer.site/${imdbId}`, 'option2')}
                >
                  {activeButton === 'option2' && <img src={Seta} alt='img3' style={{ height: 30, marginRight: 30 }} />}
                  Player 2
                </button>
                <button
                  className='botao-Op'
                  id="option3"
                  onClick={() => handleIframeChange(`https://embedder.net/e/${imdbId}`, 'option3')}
                >
                  {activeButton === 'option3' && <img src={Seta} alt='img4' style={{ height: 30, marginRight: 30 }} />}
                  Player 3
                </button>
                <button
                  className='botao-Op'
                  id="option4"
                  onClick={() => handleIframeChange(`https://supercdn.org/movie/${id}`, 'option4')}
                >
                  {activeButton === 'option4' && <img src={Seta} alt='img5' style={{ height: 30, marginRight: 30 }} />}
                  Player 4
                </button>
                <button
                  className='botao-Op'
                  id="option5"
                  onClick={() => handleIframeChange(`https://embedflix.top/filme/${id}`, 'option5')}
                >
                  {activeButton === 'option5' && <img src={Seta} alt='img6' style={{ height: 30, marginRight: 30 }} />}
                  Player 5
                </button>
                <button
                  className='botao-Op'
                  id="option6"
                  onClick={() => handleIframeChange(`https://superembeds.com/embed2/${imdbId}`, 'option6')}
                >
                  {activeButton === 'option6' && <img src={Seta} alt='img7' style={{ height: 30, marginRight: 30 }} />}
                  Player 6
                </button>
                <button
                  className='botao-Op'
                  id="option7"
                  onClick={() => handleIframeChange(`https://embed.warezcdn.link/filme/${imdbId}`, 'option7')}
                >
                  {activeButton === 'option7' && <img src={Seta} alt='img8' style={{ height: 30, marginRight: 30 }} />}
                  Player 7
                </button>
              </>
            )}
            {tipo === 'series' && (
              <>
                <button
                  className='botao-Op-Serie'
                  id="option1"
                  onClick={() => handleIframeChange(`https://superflixapi.cc/serie/${id}`, 'option1')}
                >
                  {activeButton === 'option1' && <img src={Seta} alt='img9' style={{ height: 30, marginRight: 30 }} />}
                  Player 1
                </button>
                <button
                  className='botao-Op-Serie'
                  id="option2"
                  onClick={() => handleIframeChange(`https://supercdn.org/tvshow/${id}`, 'option2')}
                >
                  {activeButton === 'option2' && <img src={Seta} alt='img10' style={{ height: 30, marginRight: 30 }} />}
                  Player 2
                </button>
                <button
                  className='botao-Op-Serie'
                  id="option3"
                  onClick={() => handleIframeChange(`https://embed.embedplayer.site/serie/${id}/`, 'option3')}
                >
                  {activeButton === 'option3' && <img src={Seta} alt='img11' style={{ height: 30, marginRight: 30 }} />}
                  Player 3
                </button>
                <button
                  className='botao-Op-Serie'
                  id="option4"
                  onClick={() => handleIframeChange(`https://embed.warezcdn.link/serie/${imdbId}`, 'option4')}
                >
                  {activeButton === 'option4' && <img src={Seta} alt='img12' style={{ height: 30, marginRight: 30 }} />}
                  Player 4
                </button>
              </>
            )}
          </div>
        </div>
        {/* Adicionando recomendações */}
        <div className="recommendations">
          <h3 className='titulo'>Recomendações</h3>
          <div className="recommendation-cards">
            {recommendations.map(recommendation => (
              <div key={recommendation.id} className="recommendation-card">
                <Link to={`/${tipo === 'series' ? 'series' : 'filmes'}/${recommendation.id}/${tipo === 'series' ? '2' : '1'}`}>
                  <img src={`https://image.tmdb.org/t/p/w500${recommendation.poster_path}`} alt={recommendation.title || recommendation.name} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Conteudo;

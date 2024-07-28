import React, { useEffect, useState } from "react";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import './styles.css';

const API_KEY = 'c5c8e6e09d68c0e14442d88242f42487';
const BASE_URL = 'https://api.themoviedb.org/3';

const fetchAnimationSeries = async () => {
    try {
        const response = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&language=pt-BR&sort_by=popularity.desc&page=1&with_genres=16`);
        if (!response.ok) {
            throw new Error('Erro ao carregar séries de animação');
        }
        const data = await response.json();
        return data.results.slice(0, 15); // Limita a 15 séries de animação
    } catch (error) {
        console.error('Erro ao buscar séries de animação:', error);
        return []; // Retorna um array vazio em caso de erro
    }
};

const AnimationSeriesCarousel = () => {
    const [series, setSeries] = useState([]);
    const navigate = useNavigate(); // Hook para navegação

    useEffect(() => {
        const getAnimationSeries = async () => {
            try {
                const animationSeries = await fetchAnimationSeries();
                // Duplicar a lista de séries para garantir um loop contínuo
                const doubledSeries = [...animationSeries, ...animationSeries];
                setSeries(doubledSeries);
            } catch (error) {
                console.error('Erro ao buscar séries de animação:', error);
            }
        };

        getAnimationSeries();
    }, []);

    const chunks = (array, size) => {
        const chunkedArr = [];
        for (let i = 0; i < array.length; i += size) {
            chunkedArr.push(array.slice(i, i + size));
        }
        return chunkedArr;
    };

    const seriesChunks = chunks(series, 5);

    const handleVerMaisClick = () => {
        navigate('/series?genre=16'); // Navega para a página de séries com o gênero "Animação"
        window.scrollTo(0, 0);
    };

    const handleSeriesClick = (id) => {
        navigate(`/series/${id}/2`); // Navega para a página de detalhes do anime
        window.scrollTo(0, 0);
    };

    if (series.length === 0) {
        return <p>Carregando...</p>; // Exibe mensagem de carregamento enquanto as séries são carregadas
    }

    return (
        <div className="carousel-container3">
            <div className="d-flex justify-content-between align-items-center mx-2">
                <span className='titulo'>Animes</span>
                <button className='btn btn-secondary div-secundaria' onClick={handleVerMaisClick}>Ver Mais</button>
            </div>
            <Carousel
                showArrows={true}
                emulateTouch={true}
                swipeable={true}
                showThumbs={false} // Desabilita as miniaturas
                dynamicHeight={true} // Habilita altura dinâmica
                interval={8000}  // Passa automaticamente a cada 8 segundos
                fade  // Transição suave entre imagens
                autoPlay={false}
                infiniteLoop={true}
            >
                {seriesChunks.map((chunk, index) => (
                    <div key={index} className="series-row3">
                        {chunk.map((serie) => (
                            <div
                                className="series-item3"
                                key={serie.id}
                                onClick={() => handleSeriesClick(serie.id)} // Adiciona manipulador de clique
                            >
                                <img
                                    className="carousel-image3"
                                    src={`https://image.tmdb.org/t/p/original${serie.backdrop_path}`}
                                    alt={serie.name}
                                />
                                <h3>{serie.name}</h3>
                            </div>
                        ))}
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default AnimationSeriesCarousel;

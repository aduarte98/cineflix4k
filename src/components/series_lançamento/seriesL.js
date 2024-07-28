import React, { useEffect, useState } from "react";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useNavigate } from 'react-router-dom'; // Importar o useNavigate
import './styles.css';

const API_KEY = 'c5c8e6e09d68c0e14442d88242f42487';
const BASE_URL = 'https://api.themoviedb.org/3';

const fetchUpcomingSeries = async () => {
    try {
        const response = await fetch(`${BASE_URL}/tv/on_the_air?api_key=${API_KEY}&language=pt-BR`);
        if (!response.ok) {
            throw new Error('Erro ao carregar séries');
        }
        const data = await response.json();
        return data.results.slice(0, 12); // Limita a 12 séries mais recentes
    } catch (error) {
        console.error('Erro ao buscar séries em lançamento:', error);
        return []; // Retorna um array vazio em caso de erro
    }
};

const UpcomingSeriesCarousel = () => {
    const [series, setSeries] = useState([]);
    const navigate = useNavigate(); // Hook para navegação

    useEffect(() => {
        const getSeries = async () => {
            try {
                const upcomingSeries = await fetchUpcomingSeries();
                // Duplicar a lista de séries para garantir um loop contínuo
                const doubledSeries = [...upcomingSeries, ...upcomingSeries];
                setSeries(doubledSeries);
            } catch (error) {
                console.error('Erro ao buscar séries em lançamento:', error);
            }
        };

        getSeries();
    }, []);

    const chunks = (array, size) => {
        const chunkedArr = [];
        for (let i = 0; i < array.length; i += size) {
            chunkedArr.push(array.slice(i, i + size));
        }
        return chunkedArr;
    };

    const seriesChunks = chunks(series, 5);

    if (series.length === 0) {
        return <p>Carregando...</p>; // Exibir mensagem de carregamento enquanto as séries são carregadas
    }

    const handleItemClick = (serie) => {
        navigate(`/series/${serie.id}/2`);
    };

    const handleVerMaisClick = () => {
        navigate('/series');
        window.scrollTo(0, 0);
    };

    return (
        <div className="carousel-container2">
            <div className="d-flex justify-content-between align-items-center mx-2">
                <span className='titulo'>Séries em Lançamento</span>
                <button className='btn btn-secondary div-secundaria' onClick={handleVerMaisClick}>Ver Mais</button>
            </div>
            <Carousel
                showArrows={true}
                emulateTouch={true}
                swipeable={true}
                showThumbs={false}
                dynamicHeight={true}
                interval={8000}
                fade
                autoPlay={false}
                infiniteLoop={true}
            >
                {seriesChunks.map((chunk, index) => (
                    <div key={index} className="movie-row2">
                        {chunk.map((serie) => (
                            <div
                                className="movie-item2"
                                key={serie.id}
                                onClick={() => handleItemClick(serie)}
                            >
                                <img
                                    className="carrossel-image2"
                                    src={`https://image.tmdb.org/t/p/original${serie.backdrop_path}`}
                                    alt={serie.name}
                                />
                                <h3 className="nome-serie">{serie.name}</h3>
                            </div>
                        ))}
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default UpcomingSeriesCarousel;

import React, { useEffect, useState } from "react";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useNavigate } from 'react-router-dom'; // Importar o useNavigate
import './styles.css';

const API_KEY = 'c5c8e6e09d68c0e14442d88242f42487';
const BASE_URL = 'https://api.themoviedb.org/3';

const fetchUpcomingMovies = async () => {
    try {
        const response = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=pt-BR`);
        if (!response.ok) {
            throw new Error('Erro ao carregar filmes');
        }
        const data = await response.json();
        return data.results.slice(0, 15); // Limita a 15 filmes mais recentes
    } catch (error) {
        console.error('Erro ao buscar filmes em lançamento:', error);
        return []; // Retorna um array vazio em caso de erro
    }
};

const UpcomingCarousel = () => {
    const [movies, setMovies] = useState([]);
    const navigate = useNavigate(); // Hook para navegação

    useEffect(() => {
        const getMovies = async () => {
            try {
                const upcomingMovies = await fetchUpcomingMovies();
                // Duplicar a lista de filmes para garantir um loop contínuo
                const doubledMovies = [...upcomingMovies, ...upcomingMovies];
                setMovies(doubledMovies);
            } catch (error) {
                console.error('Erro ao buscar filmes em lançamento:', error);
            }
        };

        getMovies();
    }, []);

    const chunks = (array, size) => {
        const chunkedArr = [];
        for (let i = 0; i < array.length; i += size) {
            chunkedArr.push(array.slice(i, i + size));
        }
        return chunkedArr;
    };

    const movieChunks = chunks(movies, 5);

    if (movies.length === 0) {
        return <p>Carregando...</p>; // Exibir mensagem de carregamento enquanto os filmes são carregados
    }

    const handleItemClick = (movie) => {
        navigate(`/filmes/${movie.id}/1`);
    };

    const handleVerMaisClick = () => {
        navigate('/filmes');
        window.scrollTo(0, 0);
    };

    return (
        <div className="carousel-container1">
            <div className="d-flex justify-content-between align-items-center mx-2">
                <span className='titulo'>Filmes em Lançamento</span>
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
                {movieChunks.map((chunk, index) => (
                    <div key={index} className="movie-row1">
                        {chunk.map((movie) => (
                            <div
                                className="movie-item1"
                                key={movie.id}
                                onClick={() => handleItemClick(movie)}
                            >
                                <img
                                    className="carrossel-image1"
                                    src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                                    alt={movie.title}
                                />
                                <h3 className="nome-filme">{movie.title}</h3>
                            </div>
                        ))}
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default UpcomingCarousel;

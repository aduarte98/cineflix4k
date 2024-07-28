import React, { useEffect, useState } from "react";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from 'react-router-dom'; // Importar o useNavigate
import './styles.css';

const API_KEY = 'c5c8e6e09d68c0e14442d88242f42487';
const BASE_URL = 'https://api.themoviedb.org/3';

const fetchTrendingMovies = async () => {
    try {
        const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=pt-BR`);
        if (!response.ok) {
            throw new Error('Erro ao carregar filmes');
        }
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Erro ao buscar filmes em tendência:', error);
        return [];
    }
};

const Carrossel = () => {
    const [trending, setTrending] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Hook para navegação

    useEffect(() => {
        const getTrendingMovies = async () => {
            try {
                const movies = await fetchTrendingMovies();
                const doubledMovies = [...movies, ...movies];
                setTrending(doubledMovies);
            } catch (error) {
                console.error('Erro ao buscar filmes em tendência:', error);
            } finally {
                setLoading(false);
            }
        };

        getTrendingMovies();
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <ClipLoader color={"#123abc"} loading={loading} size={150} />
            </div>
        );
    }

    const handleItemClick = (item) => {
        navigate(`/filmes/${item.id}/1`);
    };

    return (
        <div className="carrossel-container">
            <Carousel
                showArrows={true}
                emulateTouch={true}
                swipeable={true}
                showThumbs={false}
                dynamicHeight={true}
                interval={4000}
                fade
                autoPlay={true}
                infiniteLoop={true}
                swipeScrollTolerance={50}
            >
                {trending.map((item, index) => (
                    <div key={index} className="carrossel-item" onClick={() => handleItemClick(item)}>
                        <img
                            className="carrossel-image"
                            src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
                            alt={item.title || item.name}
                        />
                        <div className="carrossel-overlay">
                            <h5>{item.title || item.name}</h5>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
}

export default Carrossel;

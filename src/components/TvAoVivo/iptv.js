import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import Objetos from '../../objetos.json'; // Importa o arquivo JSON
import './styles.css'; // Estilos personalizados

const fetchObjetos = async () => {
    try {
        // Simulação de fetch assíncrono com o JSON importado
        const response = await new Promise(resolve => setTimeout(() => resolve(Objetos), 1000));
        return response;
    } catch (error) {
        console.error('Erro ao buscar objetos:', error);
        return []; // Retorna um array vazio em caso de erro
    }
};

const ObjetosCarousel = () => {
    const [objetos, setObjetos] = useState([]);
    const navigate = useNavigate(); // Hook para navegação

    useEffect(() => {
        const getObjetos = async () => {
            try {
                const fetchedObjetos = await fetchObjetos();
                // Duplicar a lista de objetos para garantir um loop contínuo
                const doubledObjetos = [...fetchedObjetos, ...fetchedObjetos];
                setObjetos(doubledObjetos);
            } catch (error) {
                console.error('Erro ao buscar objetos:', error);
            }
        };

        getObjetos();
    }, []);

    const chunks = (array, size) => {
        const chunkedArr = [];
        for (let i = 0; i < array.length; i += size) {
            chunkedArr.push(array.slice(i, i + size));
        }
        return chunkedArr;
    };

    const objetosChunks = chunks(objetos, 5);

    if (objetos.length === 0) {
        return <p>Carregando...</p>; // Exibir mensagem de carregamento enquanto os objetos são carregados
    }

    const handleChannelClick = (nome) => {
        const formattedNome = nome.replace(/\s+/g, '-').toLowerCase();
        navigate(`/tv-ao-vivo/${formattedNome}`);
    };

    const handleVerMaisClick = () => {
        navigate('/tv-ao-vivo'); // Navega para a página de TV ao Vivo
        window.scrollTo(0, 0);
    };

    return (
        <div className="carousel-container4">
            <div className="d-flex justify-content-between align-items-center mx-2">
                <span className='titulo'>Canais ao Vivo</span>
                <button
                    className='btn btn-secondary div-secundaria'
                    onClick={handleVerMaisClick} // Adiciona a função para o botão "Ver Mais"
                >
                    Ver Mais
                </button>
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
                {objetosChunks.map((chunk, index) => (
                    <div key={index} className="movie-row4">
                        {chunk.map((objeto, i) => (
                            <div
                                className="movie-item4"
                                key={i}
                                onClick={() => handleChannelClick(objeto.nome)} // Adiciona a função para o clique do canal
                                style={{ cursor: 'pointer' }} // Adiciona um cursor de ponteiro para indicar que é clicável
                            >
                                <img
                                    className="carrossel-image4"
                                    src={objeto.imagem}
                                    alt={objeto.nome}
                                />
                                <h3>{objeto.nome}</h3>
                            </div>
                        ))}
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default ObjetosCarousel;

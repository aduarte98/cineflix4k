import React, { useState, useEffect } from 'react';
import Objetos from '../../objetos.json';
import './styles.css';
import Header from '../../components/Header/header';
import Footer from '../../components/Footer/footer';
import { useSearch } from '../../context/SearchContext';
import { Link } from 'react-router-dom';

const TvAoVivo = () => {
    const { searchTerm } = useSearch();
    const [canais, setCanais] = useState([]);

    useEffect(() => {
        const fetchCanais = async () => {
            try {
                // Simulação de fetch assíncrono com o JSON importado
                const response = await new Promise(resolve => setTimeout(() => resolve(Objetos), 1000));
                setCanais(response);
            } catch (error) {
                console.error('Erro ao buscar canais:', error);
                setCanais([]); // Retorna um array vazio em caso de erro
            }
        };

        fetchCanais();
    }, []);

    const filteredCanais = canais.filter(canal =>
        canal.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Header />
            <div className="container-tv">
                <div className="row">
                    {filteredCanais.map(canal => (
                        <div key={canal.nome} className="col-6 col-md-4 col-lg-3 mb-4" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                            <div className="card h-100 border-0">
                                <Link to={`/tv-ao-vivo/${canal.nome.replace(/\s+/g, '-').toLowerCase()}`}>
                                    <img
                                        className="card-img-top1"
                                        src={canal.imagem}
                                        alt={canal.nome}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title" style={{ textDecoration: 'none', color: 'white' }}>{canal.nome}</h5>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default TvAoVivo;

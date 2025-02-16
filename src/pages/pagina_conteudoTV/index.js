import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../components/Header/header';
import Footer from '../../components/Footer/footer';
import Objetos from '../../objetos.json';
import Seta from '../../assets/seta direita.png';
import './styles.css';

const ConteudoAoVivo = () => {
  const { id } = useParams(); // Captura id da URL
  const navigate = useNavigate(); // Hook para navegação

  const [contentData, setContentData] = useState(null);
  const [iframeUrl, setIframeUrl] = useState('');
  const [activeButton, setActiveButton] = useState('option1');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchConteudo = async () => {
      try {
        const data = Objetos.find(obj => obj.nome.replace(/\s+/g, '-').toLowerCase() === id);
        if (!data) {
          throw new Error('Canal não encontrado');
        }
        setContentData(data);
        setIframeUrl(data.link);
      } catch (error) {
        console.error('Erro ao buscar conteúdo:', error);
        navigate('/404'); // Redireciona para uma página 404 se não encontrar o canal
      }
    };

    fetchConteudo();
  }, [id, navigate]);

  const handleIframeChange = (url, buttonId) => {
    setIframeUrl(url);
    setActiveButton(buttonId);
  };

  return (
    <>
      <Header />
      <div className="conteudo-page">
        <div className="background-trailer1" style={{ backgroundImage: `url(${contentData ? contentData.imagem : ''})` }}>
        </div>
        <div className="iframe-and-buttons">
          <div className="iframe-container">
            {iframeUrl ? (
              <iframe
                id="videoIframe"
                title="iframe"
                src={iframeUrl}
                scrolling="no"
                frameBorder="0"
                allowFullScreen
                width="100%"
                height="360"
              ></iframe>
            ) : (
              <p style={{ color: 'white', padding: '200px 0 0 250px', fontSize: '30px' }}>Não há link disponível</p>
            )}
          </div>
          <div className="button-container1">
            <button
              className={`botao-Op0 ${activeButton === 'option1' ? 'active' : ''}`}
              onClick={() => handleIframeChange(contentData.link, 'option1')}
            >
              {activeButton === 'option1' && <img src={Seta} alt='play1' style={{ height: 30, marginRight: 30 }} />}
              Player 1
            </button>
            <button
              className={`botao-Op0 ${activeButton === 'option2' ? 'active' : ''}`}
              onClick={() => handleIframeChange(contentData.link2, 'option2')}
            >
              {activeButton === 'option2' && <img src={Seta} alt='play2' style={{ height: 30, marginRight: 30 }} />}
              Player 2
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ConteudoAoVivo;

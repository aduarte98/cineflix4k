import React from 'react'
import './styles.css'
import Logo from '../../assets/Logo.png';

function Footer(){

    return(
        
        <footer>
            <img id="logo" alt='logo' src={Logo} />
            <span className='explicacao'>O CineFlix 4K é uma plataforma de site para assistir filmes e séries online gratuitamente! Nossa plataforma é um indexador automático. O CineFlix 4K não armazena filmes e/ou séries em nosso site, por isso está completamente dentro da lei. O CineFlix 4K indexa conteúdo(s) encontrado(s) na web automaticamente usando Robots e Inteligência Artificial (IA) & API TMDb. O uso do CineFlix é totalmente responsabilidade do usuário. A distribuição de filmes e/ou séries é da parte de plataformas como OpenLoad, Google Drive, entre outros. Qualquer violação de direitos autorais, entre em contato com o distribuidor.</span>
            <span>Todos os direitos reservados ©</span>
            <span>Desenvolvidos por : Arthur Silva Duarte</span>

        </footer>
    )
}

export default Footer;
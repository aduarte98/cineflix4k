import React from "react";
import './styles.css';
import Header from '../../components/Header/header';
import Carrossel from "../../components/carrossel/carrossel";
import UpcomingCarousel from "../../components/filmes_lançamento/filmesL";
import UpcomingSeriesCarousel from "../../components/series_lançamento/seriesL";
import UpcomingAnimesCarousel from "../../components/animes_lançamento/animesL";
import ObjetoList from "../../components/TvAoVivo/iptv";
import Footer from "../../components/Footer/footer";

function Home() {
    return (
        <>
            <Header/>
            <div className="home-page">
                <Carrossel/>
                <UpcomingCarousel/>
                <UpcomingSeriesCarousel/>
                <UpcomingAnimesCarousel/>
                <ObjetoList/>
                <Footer/>
            </div>
        </>
    );
}

export default Home;

// Pagina inicial com as principais secoes.
// Junta Hero, Features, MobileApp, Faq e Cta.
/*
 * Serve como ponto de entrada da landing.
 * Apenas organiza as secoes na ordem certa.
 */
import Hero from "../../components/landing/Hero";
import Features from "../../components/landing/Features";
import MobileApp from "../../components/landing/MobileApp";
import Faq from "../../components/landing/Faq";
import Cta from "../../components/landing/Cta";

const Home = () => {
  return (
    <>
      <Hero />
      <Features />
      <MobileApp />
      <Faq />
      <Cta />
    </>
  );
};

export default Home;

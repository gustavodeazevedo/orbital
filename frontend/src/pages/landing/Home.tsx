// Pagina inicial com as principais secoes.
// Junta Hero, Features, Pricing, Faq e Cta.
/*
 * Serve como ponto de entrada da landing.
 * Apenas organiza as secoes na ordem certa.
 */
import Hero from "../../components/landing/Hero";
import Features from "../../components/landing/Features";
import Pricing from "../../components/landing/Pricing";
import Faq from "../../components/landing/Faq";
import Cta from "../../components/landing/Cta";

const Home = () => {
  return (
    <>
      <Hero />
      <Features />
      <Pricing />
      <Faq />
      <Cta />
    </>
  );
};

export default Home;

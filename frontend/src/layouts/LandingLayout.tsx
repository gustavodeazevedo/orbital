// Estrutura da landing com cabecalho e rodape.
// Usado nas paginas publicas.
/*
 * Mantem o mesmo topo e rodape em toda a landing.
 * Facilita adicionar novas secoes sem duplicar layout.
 */
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const LandingLayout = () => {
  return (
    <div className="min-h-screen flex flex-col landing-root">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default LandingLayout;

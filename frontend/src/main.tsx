// Ponto de entrada do frontend.
// Monta o App com o roteador e o Toast.
/*
 * Inicializa o React e envolve o app com providers.
 * E aqui que a aplicacao comeca no navegador.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import ToastProvider from "./components/ui/ToastProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ToastProvider>
  </StrictMode>,
);

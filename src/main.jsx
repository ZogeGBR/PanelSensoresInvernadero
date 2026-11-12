import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./estilos.css";

// Punto de entrada: React toma el div#root del index.html y dibuja <App /> adentro.
// StrictMode (sólo en desarrollo) monta, desmonta y vuelve a montar cada componente
// para comprobar que la limpieza de los efectos esté bien hecha.
ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

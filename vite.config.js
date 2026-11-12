import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite es la herramienta que levanta el servidor de desarrollo y arma la versión final (build).
// El plugin de React le enseña a Vite a entender JSX.
export default defineConfig({
    plugins: [react()],
    base: "./"
});

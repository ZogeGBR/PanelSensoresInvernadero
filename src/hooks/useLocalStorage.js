import { useEffect, useState } from "react";

// Igual que useState, pero el valor se guarda en el navegador (localStorage)
// y sobrevive a recargar la página.
export function useLocalStorage(clave, valorInicial) {
    // La función dentro de useState se ejecuta UNA sola vez, al montar
    const [valor, setValor] = useState(() => {
        try {
            const guardado = localStorage.getItem(clave);
            return guardado !== null ? JSON.parse(guardado) : valorInicial;
        } catch {
            return valorInicial; // modo privado, dato roto, etc.
        }
    });

    // Cada vez que cambia el valor, se guarda (JSON.stringify: objeto → texto)
    useEffect(() => {
        try {
            localStorage.setItem(clave, JSON.stringify(valor));
        } catch {
            // si no se puede guardar, la app sigue funcionando igual
        }
    }, [clave, valor]);

    return [valor, setValor];
}

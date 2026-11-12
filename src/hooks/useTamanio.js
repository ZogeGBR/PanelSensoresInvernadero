import { useEffect, useRef, useState } from "react";

// ResizeObserver dentro de un custom hook: mide el ANCHO de un elemento, no de la ventana.
// Devuelve [ref, ancho]; el componente sólo pone ref={ref} en el elemento a medir.
export function useTamanio() {
    const ref = useRef(null);
    const [ancho, setAncho] = useState(0);

    useEffect(() => {
        const elemento = ref.current;
        if (!elemento) return;

        // 1. Crear: el callback recibe un ARREGLO de entradas
        const observer = new ResizeObserver(entries => {
            // contentBoxSize[0].inlineSize = ancho del contenido, sin padding ni borde
            setAncho(Math.round(entries[0].contentBoxSize[0].inlineSize));
        });

        // 2. Observar
        observer.observe(elemento);

        // 4. Soltar: al desmontar el componente dejamos de observar (cleanup)
        return () => observer.disconnect();
    }, []);

    return [ref, ancho];
}

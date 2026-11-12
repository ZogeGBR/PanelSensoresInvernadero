import { useEffect, useRef, useState } from "react";

// IntersectionObserver dentro de un custom hook: avisa si el elemento está a la vista.
// root: null = la ventana. Igual tiene en cuenta el recorte de los contenedores con scroll,
// así que un elemento escondido dentro de una caja con scroll NO cuenta como visible.
// threshold: qué fracción tiene que verse (0.6 = el 60 %).
export function useEnPantalla({ threshold = 0.6 } = {}) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const elemento = ref.current;
        if (!elemento) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setVisible(true);
                observer.unobserve(elemento); // ya se vio: no hace falta seguir calculando
            }
        }, { root: null, threshold });

        observer.observe(elemento);
        return () => observer.disconnect(); // cleanup
    }, [threshold]);

    return [ref, visible];
}

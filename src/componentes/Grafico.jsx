import { useTamanio } from "../hooks/useTamanio";

const ALTO = 90; // alto fijo del gráfico en píxeles

// Gráfico de línea hecho a mano con SVG. Se adapta al ancho de SU contenedor
// gracias a useTamanio (ResizeObserver), no al ancho de la ventana.
export default function Grafico({ valores, umbral }) {
    const [ref, ancho] = useTamanio();

    // El eje vertical tiene que mostrar las lecturas Y las dos líneas de umbral
    const piso = Math.min(...valores, umbral.min);
    const techo = Math.max(...valores, umbral.max);
    const margen = (techo - piso) * 0.1 || 1;
    const minY = piso - margen;
    const maxY = techo + margen;

    // Convierte un valor en una altura dentro del SVG (en SVG el 0 está ARRIBA)
    const y = valor => ALTO - ((valor - minY) / (maxY - minY)) * ALTO;
    // Reparte los puntos a lo ancho
    const x = indice => (valores.length === 1 ? 0 : (indice / (valores.length - 1)) * ancho);

    // map arma "x,y x,y x,y ..." que es lo que pide <polyline>
    const puntos = valores.map((valor, i) => `${x(i)},${y(valor)}`).join(" ");
    // El área es la misma línea cerrada contra el piso del gráfico
    const area = `0,${ALTO} ${puntos} ${x(valores.length - 1)},${ALTO}`;
    const ultimo = valores.length - 1;

    return (
        <div ref={ref} className="grafico">
            {/* Hasta que ResizeObserver mida el ancho, no hay nada que dibujar */}
            {ancho > 0 && (
                <svg width={ancho} height={ALTO} role="img" aria-label="Evolución de las últimas lecturas">
                    <line x1="0" x2={ancho} y1={y(umbral.max)} y2={y(umbral.max)} className="linea-umbral" />
                    <line x1="0" x2={ancho} y1={y(umbral.min)} y2={y(umbral.min)} className="linea-umbral" />
                    <polygon points={area} className="area-datos" />
                    <polyline points={puntos} className="linea-datos" />
                    <circle cx={x(ultimo)} cy={y(valores[ultimo])} r="4.5" className="punto-actual" />
                </svg>
            )}
        </div>
    );
}

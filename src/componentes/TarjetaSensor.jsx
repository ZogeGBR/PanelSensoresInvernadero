import Grafico from "./Grafico";
import { valores, promedio, minimo, maximo, calcularEstado } from "../utils/estadisticas";

const TEXTO_ESTADO = { normal: "En rango", alto: "Muy alto", bajo: "Muy bajo" };

// Componente "tonto": recibe todo por props y sólo dibuja.
// No sabe de dónde vienen las lecturas ni cómo se guardan los umbrales.
// La clase sensor-<id> le da el color propio de cada sensor (ver estilos.css).
export default function TarjetaSensor({ sensor, lecturas, umbral, onForzarPico }) {
    const lista = valores(lecturas);
    const actual = lista[lista.length - 1];
    const estado = calcularEstado(actual, umbral);

    return (
        <article className={`tarjeta sensor-${sensor.id} estado-${estado}`}>
            <header className="tarjeta-encabezado">
                <h2>{sensor.nombre}</h2>
                <span className={`etiqueta etiqueta-${estado}`}>{TEXTO_ESTADO[estado]}</span>
            </header>

            <p className="valor-actual">
                {actual.toFixed(1)}<span className="unidad">{sensor.unidad}</span>
            </p>

            <Grafico valores={lista} umbral={umbral} />

            <dl className="resumen">
                <div><dt>Promedio</dt><dd>{promedio(lista).toFixed(1)}</dd></div>
                <div><dt>Mínimo</dt><dd>{minimo(lista).toFixed(1)}</dd></div>
                <div><dt>Máximo</dt><dd>{maximo(lista).toFixed(1)}</dd></div>
            </dl>

            <div className="pie-tarjeta">
                <p className="rango">Rango: {umbral.min} a {umbral.max} {sensor.unidad}</p>
                <button type="button" className="boton-secundario" onClick={() => onForzarPico(sensor.id)}>
                    Forzar pico
                </button>
            </div>
        </article>
    );
}

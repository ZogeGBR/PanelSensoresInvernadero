import Alarma from "./Alarma";
import { contarPorSensor } from "../utils/estadisticas";

export default function RegistroAlarmas({ alarmas, onVista, onLimpiar }) {
    // sort sobre una copia: la más nueva primero
    const ordenadas = [...alarmas].sort((a, b) => b.hora - a.hora);

    // reduce que agrupa por sensor, y Object.entries para recorrer el objeto resultante
    const porSensor = Object.entries(contarPorSensor(alarmas));

    return (
        <section className="panel">
            <div className="panel-titulo">
                <h2>Registro de alarmas</h2>
                <button type="button" className="boton-secundario" onClick={onLimpiar} disabled={alarmas.length === 0}>
                    Limpiar
                </button>
            </div>

            {porSensor.length > 0 && (
                <p className="conteo">
                    {porSensor.map(([id, { nombre, cantidad }]) => (
                        <span key={id} className={`chip sensor-${id}`}>{nombre}: {cantidad}</span>
                    ))}
                </p>
            )}

            {alarmas.length === 0 ? (
                <p className="vacio">No hay alarmas. Usá «Forzar pico» en un sensor para probar el registro.</p>
            ) : (
                <ul className="lista-alarmas">
                    {/* key: React la usa para saber qué elemento es cuál entre renders */}
                    {ordenadas.map(alarma => (
                        <Alarma key={alarma.id} alarma={alarma} onVista={onVista} />
                    ))}
                </ul>
            )}
        </section>
    );
}

import { ultimoValor, calcularEstado, desvio } from "../utils/estadisticas";

export default function Encabezado({ sensores, lecturas, umbrales, sinLeer, observers, enMarcha, onAlternar }) {
    // map: un resumen por sensor
    const estados = sensores.map(sensor => {
        const valor = ultimoValor(lecturas[sensor.id]);
        return {
            sensor,
            valor,
            estado: calcularEstado(valor, umbrales[sensor.id]),
            desvio: desvio(valor, umbrales[sensor.id])
        };
    });

    // every: ¿están TODOS en rango?  filter: ¿cuáles no?
    const todoNormal = estados.every(e => e.estado === "normal");
    const fueraDeRango = estados.filter(e => e.estado !== "normal");

    // sort sobre una COPIA ([...]) para no modificar el original: el más alejado del rango primero
    const masCritico = [...estados].sort((a, b) => b.desvio - a.desvio)[0];

    return (
        <header className="encabezado">
            <div>
                <h1>Panel de sensores del invernadero</h1>
                <p className={`estado-general ${todoNormal ? "ok" : "alerta"}`} role="status">
                    {todoNormal
                        ? "Todo en orden: los tres sensores están dentro del rango."
                        : `${fueraDeRango.length} fuera de rango. Revisá ${masCritico.sensor.nombre} primero.`}
                </p>
            </div>

            <div className="indicadores">
                <span className={`indicador ${sinLeer > 0 ? "con-alarmas" : ""}`}>
                    <strong>{sinLeer}</strong> {sinLeer === 1 ? "alarma sin leer" : "alarmas sin leer"}
                </span>
                <span className="indicador">
                    <strong>{observers}</strong> observers suscriptos
                </span>
                <button type="button" className="boton-principal" onClick={onAlternar}>
                    {enMarcha ? "Pausar lecturas" : "Reanudar lecturas"}
                </button>
            </div>
        </header>
    );
}

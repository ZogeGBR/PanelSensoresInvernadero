import { useState } from "react";
import { umbralesValidos } from "../utils/estadisticas";

// Formulario CONTROLADO: el valor de cada input sale del estado "borrador",
// y cada tecla actualiza ese estado. Recién al guardar se aplica al panel.
export default function PanelUmbrales({ sensores, umbrales, valoresPorDefecto, onGuardar }) {
    const [borrador, setBorrador] = useState(umbrales);
    const [mensaje, setMensaje] = useState({ texto: "", error: false });

    function cambiar(id, campo, texto) {
        // Nunca se modifica el estado directamente: se arma un objeto nuevo con spread
        setBorrador(anterior => ({
            ...anterior,
            [id]: { ...anterior[id], [campo]: texto }
        }));
        setMensaje({ texto: "", error: false });
    }

    function guardar(evento) {
        evento.preventDefault(); // que el formulario no recargue la página

        if (!umbralesValidos(borrador)) {
            setMensaje({ texto: "Revisá los valores: tienen que ser números y el mínimo menor que el máximo.", error: true });
            return;
        }

        // Object.entries + map + Object.fromEntries: convierte los textos de los inputs en números
        const convertidos = Object.fromEntries(
            Object.entries(borrador).map(([id, { min, max }]) => [id, { min: Number(min), max: Number(max) }])
        );
        onGuardar(convertidos);
        setMensaje({ texto: "Umbrales guardados.", error: false });
    }

    function restaurar() {
        setBorrador(valoresPorDefecto);
        onGuardar(valoresPorDefecto);
        setMensaje({ texto: "Se restauraron los valores por defecto.", error: false });
    }

    return (
        <section className="panel">
            <h2>Umbrales de alarma</h2>
            <form onSubmit={guardar} className="formulario">
                {sensores.map(sensor => (
                    <fieldset key={sensor.id} className={`sensor-${sensor.id}`}>
                        <legend>{sensor.nombre} <small>({sensor.unidad})</small></legend>
                        <label>
                            Mínimo
                            <input
                                type="number"
                                step="any"
                                value={borrador[sensor.id].min}
                                onChange={e => cambiar(sensor.id, "min", e.target.value)}
                            />
                        </label>
                        <label>
                            Máximo
                            <input
                                type="number"
                                step="any"
                                value={borrador[sensor.id].max}
                                onChange={e => cambiar(sensor.id, "max", e.target.value)}
                            />
                        </label>
                    </fieldset>
                ))}

                <div className="acciones">
                    <button type="submit" className="boton-principal">Guardar umbrales</button>
                    <button type="button" className="boton-secundario" onClick={restaurar}>
                        Restaurar
                    </button>
                </div>
                {mensaje.texto && (
                    <p className={`mensaje ${mensaje.error ? "error" : ""}`} role="status">{mensaje.texto}</p>
                )}
            </form>
        </section>
    );
}

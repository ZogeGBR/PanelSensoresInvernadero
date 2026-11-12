import { useEffect } from "react";
import { useEnPantalla } from "../hooks/useEnPantalla";

// Una alarma del registro. Cuando el usuario la ve (60 % visible en pantalla),
// se marca como leída. Es la misma idea que contar "impresiones" de anuncios.
export default function Alarma({ alarma, onVista }) {
    const [ref, visible] = useEnPantalla({ threshold: 0.6 });

    useEffect(() => {
        if (visible && !alarma.vista) onVista(alarma.id);
    }, [visible, alarma.vista, alarma.id, onVista]);

    const hora = new Date(alarma.hora).toLocaleTimeString();
    const texto = alarma.tipo === "alto" ? "por encima del máximo" : "por debajo del mínimo";

    return (
        <li ref={ref} className={`alarma sensor-${alarma.sensorId} ${alarma.vista ? "vista" : "nueva"}`}>
            <span className="alarma-hora">{hora}</span>
            {/* React escapa el texto solo (como textContent): no se puede inyectar HTML */}
            <span>
                <strong>{alarma.nombre}</strong> {texto}: {alarma.valor.toFixed(1)} {alarma.unidad}
            </span>
        </li>
    );
}

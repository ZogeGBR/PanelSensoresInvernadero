import { useCallback, useEffect, useRef, useState } from "react";
import { sensores, simulador } from "./sensores/simulador";
import { useLecturas } from "./hooks/useLecturas";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { ultimoValor, calcularEstado } from "./utils/estadisticas";
import Encabezado from "./componentes/Encabezado";
import TarjetaSensor from "./componentes/TarjetaSensor";
import RegistroAlarmas from "./componentes/RegistroAlarmas";
import PanelUmbrales from "./componentes/PanelUmbrales";
import TablaLecturas from "./componentes/TablaLecturas";

// Rango permitido de cada sensor si el usuario no configuró otro
const UMBRALES_POR_DEFECTO = {
    temperatura: { min: 15, max: 30 },
    humedad: { min: 40, max: 75 },
    co2: { min: 350, max: 1000 }
};

// App es el componente "dueño" del estado: lo guarda y se lo pasa a los hijos por props.
export default function App() {
    // 1. Estado externo (los sensores): se lee con useSyncExternalStore dentro del hook
    const lecturas = useLecturas();

    // 2. Estado propio de React
    const [umbralesGuardados, setUmbrales] = useLocalStorage("panel-umbrales", UMBRALES_POR_DEFECTO);
    const [enMarcha, setEnMarcha] = useState(true);
    const [alarmas, setAlarmas] = useState([]);

    // Spread: si en localStorage falta algún sensor, se completa con el valor por defecto
    const umbrales = { ...UMBRALES_POR_DEFECTO, ...umbralesGuardados };

    // useRef guarda un dato que NO dispara render: el último estado de cada sensor
    const estadosPrevios = useRef({});

    // 3. Efecto con limpieza: arrancar y detener el simulador
    useEffect(() => {
        if (!enMarcha) return;
        simulador.iniciar(1000);
        return () => simulador.detener(); // cleanup: al pausar o desmontar
    }, [enMarcha]);

    // 4. Efecto que detecta alarmas cada vez que llegan lecturas nuevas o cambian los umbrales.
    //    Sólo registra una alarma cuando un sensor PASA de normal a fuera de rango,
    //    para no llenar el registro con una alarma por segundo.
    useEffect(() => {
        const umbralesActuales = { ...UMBRALES_POR_DEFECTO, ...umbralesGuardados };
        const nuevas = [];
        sensores.forEach(sensor => {
            const valor = ultimoValor(lecturas[sensor.id]);
            const estado = calcularEstado(valor, umbralesActuales[sensor.id]);
            const anterior = estadosPrevios.current[sensor.id];

            if (estado !== "normal" && estado !== anterior) {
                nuevas.push({
                    id: `${sensor.id}-${Date.now()}`,
                    sensorId: sensor.id,
                    nombre: sensor.nombre,
                    unidad: sensor.unidad,
                    valor,
                    tipo: estado,
                    hora: Date.now(),
                    vista: false
                });
            }
            estadosPrevios.current[sensor.id] = estado;
        });

        // Forma funcional de setState: parte del valor más reciente
        if (nuevas.length > 0) setAlarmas(anteriores => [...anteriores, ...nuevas]);
    }, [lecturas, umbralesGuardados]);

    // useCallback: la misma función en cada render, así el useEffect de <Alarma> no se repite de más
    const marcarVista = useCallback(id => {
        setAlarmas(anteriores => anteriores.map(a => (a.id === id ? { ...a, vista: true } : a)));
    }, []);

    const sinLeer = alarmas.filter(a => !a.vista).length;
    const observers = sensores.reduce((total, s) => total + s.observerCount, 0);

    return (
        <>
        <div className="franja">
            <Encabezado
                sensores={sensores}
                lecturas={lecturas}
                umbrales={umbrales}
                sinLeer={sinLeer}
                observers={observers}
                enMarcha={enMarcha}
                onAlternar={() => setEnMarcha(e => !e)}
            />
        </div>

        <main className="contenedor">
            <section className="grilla-sensores" aria-label="Sensores">
                {sensores.map(sensor => (
                    <TarjetaSensor
                        key={sensor.id}
                        sensor={sensor}
                        lecturas={lecturas[sensor.id]}
                        umbral={umbrales[sensor.id]}
                        onForzarPico={simulador.forzarPico}
                    />
                ))}
            </section>

            <div className="columnas">
                <RegistroAlarmas alarmas={alarmas} onVista={marcarVista} onLimpiar={() => setAlarmas([])} />
                <PanelUmbrales
                    sensores={sensores}
                    umbrales={umbrales}
                    valoresPorDefecto={UMBRALES_POR_DEFECTO}
                    onGuardar={setUmbrales}
                />
            </div>

            <TablaLecturas sensores={sensores} lecturas={lecturas} />
        </main>
        </>
    );
}

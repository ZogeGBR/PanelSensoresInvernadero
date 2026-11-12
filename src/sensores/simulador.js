// =====================================================================
// Simulador: crea los sensores y genera lecturas cada cierto tiempo
// =====================================================================
// No hay sensores reales: cada segundo se inventa una lectura nueva cerca del valor anterior.
// Este archivo es JavaScript puro: no sabe nada de React.

import { Sensor } from "./Sensor";

export const sensores = [
    new Sensor({
        id: "temperatura", nombre: "Temperatura", unidad: "°C",
        valorInicial: 22, limiteFisico: { min: -10, max: 60 }, variacion: 1.2, pico: 12
    }),
    new Sensor({
        id: "humedad", nombre: "Humedad", unidad: "%",
        valorInicial: 58, limiteFisico: { min: 0, max: 100 }, variacion: 3, pico: 30
    }),
    new Sensor({
        id: "co2", nombre: "CO₂", unidad: "ppm",
        valorInicial: 650, limiteFisico: { min: 300, max: 3000 }, variacion: 60, pico: 700
    })
];

let intervalo = null; // guarda el id del setInterval para poder detenerlo

function leerTodos() {
    sensores.forEach(sensor => {
        // Cambio al azar entre -variacion y +variacion...
        const azar = (Math.random() * 2 - 1) * sensor.variacion;
        // ...más un "tirón" hacia el valor base, para que no se escape para siempre.
        const vuelta = (sensor.valorBase - sensor.ultimoValor) * 0.15;
        sensor.registrar(sensor.ultimoValor + azar + vuelta);
    });
}

export const simulador = {
    iniciar(milisegundos = 1000) {
        if (intervalo !== null) return;          // ya estaba andando: no crear otro
        intervalo = setInterval(leerTodos, milisegundos);
    },
    detener() {
        clearInterval(intervalo);
        intervalo = null;
    },
    forzarPico(id) {
        const sensor = sensores.find(s => s.id === id);
        if (sensor) sensor.registrar(sensor.ultimoValor + sensor.pico);
    }
};

// ---------------------------------------------------------------------
// Para React: suscribirse a TODOS los sensores juntos
// ---------------------------------------------------------------------
// useSyncExternalStore necesita dos funciones:
//   subscribe(callback) → se anota y devuelve la función de baja
//   getSnapshot()       → devuelve el valor actual, SIEMPRE el mismo objeto si nada cambió

export function suscribirATodos(callback) {
    const bajas = sensores.map(sensor => sensor.subscribe(callback)); // un observer por sensor
    return () => bajas.forEach(darDeBaja => darDeBaja());              // cleanup: baja de todos
}

let fotoAnterior = null;

export function leerFoto() {
    // Si ningún sensor cambió, devuelvo el MISMO objeto. Si devolviera uno nuevo cada vez,
    // React creería que siempre hay cambios y entraría en un bucle de renders.
    if (fotoAnterior && sensores.every(s => fotoAnterior[s.id] === s.lecturas)) {
        return fotoAnterior;
    }
    // Object.fromEntries arma { temperatura: [...], humedad: [...], co2: [...] }
    fotoAnterior = Object.fromEntries(sensores.map(s => [s.id, s.lecturas]));
    return fotoAnterior;
}

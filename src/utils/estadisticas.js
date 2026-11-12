// =====================================================================
// Funciones puras: reciben datos y devuelven un resultado, sin tocar nada más.
// Acá está casi todo lo de arrays, objetos y matrices del semestre.
// =====================================================================

// map: de [{valor, hora}, ...] a [22, 22.4, ...]
export const valores = lecturas => lecturas.map(lectura => lectura.valor);

export const ultimoValor = lecturas => lecturas[lecturas.length - 1].valor;

// reduce: suma todo y divide por la cantidad
export function promedio(numeros) {
    if (numeros.length === 0) return 0;
    const suma = numeros.reduce((acumulado, n) => acumulado + n, 0);
    return suma / numeros.length;
}

// reduce SIN valor inicial: el primero hace de "ganador provisorio" (como objetos_3)
export const minimo = numeros => numeros.reduce((menor, n) => (n < menor ? n : menor));
export const maximo = numeros => numeros.reduce((mayor, n) => (n > mayor ? n : mayor));

// ¿La lectura está dentro del rango permitido?
export function calcularEstado(valor, umbral) {
    // Primero las condiciones de "fuera de rango", después la normal
    if (valor > umbral.max) return "alto";
    if (valor < umbral.min) return "bajo";
    return "normal";
}

// Qué tan lejos del rango está, como proporción del ancho del rango (0 = dentro del rango)
export function desvio(valor, umbral) {
    const ancho = umbral.max - umbral.min;
    if (valor > umbral.max) return (valor - umbral.max) / ancho;
    if (valor < umbral.min) return (umbral.min - valor) / ancho;
    return 0;
}

// reduce con un objeto: cuenta alarmas por sensor (como agrupar en a4_3)
// → { humedad: { nombre: "Humedad", cantidad: 2 }, co2: { nombre: "CO₂", cantidad: 1 } }
export function contarPorSensor(alarmas) {
    return alarmas.reduce((grupos, alarma) => {
        if (!grupos[alarma.sensorId]) {
            grupos[alarma.sensorId] = { nombre: alarma.nombre, cantidad: 0 }; // crear la "cajita"
        }
        grupos[alarma.sensorId].cantidad++;
        return grupos;
    }, {});
}

// ---------------------------------------------------------------------
// Matriz: filas = instantes, columnas = sensores (como a4_42)
// ---------------------------------------------------------------------
export function armarMatriz(sensores, lecturas, cantidad) {
    // Cuántas filas puedo armar: lo que pida, o lo que tenga el historial más corto
    const filas = Math.min(cantidad, ...sensores.map(s => lecturas[s.id].length));
    const matriz = [];
    for (let fila = 0; fila < filas; fila++) {
        const valoresDeLaFila = sensores.map(sensor => {
            const lista = lecturas[sensor.id];
            return lista[lista.length - filas + fila].valor; // las últimas "filas" lecturas
        });
        matriz.push(valoresDeLaFila);
    }
    return matriz;
}

// Dos for anidados: el de afuera fija la columna, el de adentro baja por las filas
export function promedioPorColumna(matriz) {
    if (matriz.length === 0) return [];
    const columnas = matriz[0].length;
    const promedios = [];
    for (let col = 0; col < columnas; col++) {
        let suma = 0;
        for (let fila = 0; fila < matriz.length; fila++) {
            suma += matriz[fila][col];
        }
        promedios.push(suma / matriz.length);
    }
    return promedios;
}

// Valida que todos los umbrales tengan números y que min < max (every corta en el primero que falla)
export function umbralesValidos(borrador) {
    return Object.values(borrador).every(({ min, max }) =>
        min !== "" && max !== "" && !isNaN(min) && !isNaN(max) && Number(min) < Number(max)
    );
}

import { armarMatriz, promedioPorColumna } from "../utils/estadisticas";

const CANTIDAD = 5; // últimas 5 lecturas

// Muestra las últimas lecturas como una MATRIZ: filas = instantes, columnas = sensores.
// La fila de abajo es el promedio de cada columna (dos for anidados, como a4_42).
export default function TablaLecturas({ sensores, lecturas }) {
    const matriz = armarMatriz(sensores, lecturas, CANTIDAD);
    const promedios = promedioPorColumna(matriz);

    return (
        <section className="panel">
            <h2>Últimas cinco lecturas</h2>
            <div className="tabla-contenedor">
                <table>
                    <thead>
                        <tr>
                            <th scope="col">Lectura</th>
                            {sensores.map(s => (
                                <th key={s.id} scope="col" className={`sensor-${s.id}`}>
                                    <span className="muestra" />{s.nombre} ({s.unidad})
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {matriz.map((fila, f) => (
                            <tr key={f}>
                                <th scope="row">{f === matriz.length - 1 ? "Actual" : `Hace ${matriz.length - 1 - f} s`}</th>
                                {fila.map((valor, c) => <td key={c}>{valor.toFixed(1)}</td>)}
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th scope="row">Promedio</th>
                            {promedios.map((valor, c) => <td key={c}>{valor.toFixed(1)}</td>)}
                        </tr>
                    </tfoot>
                </table>
            </div>
        </section>
    );
}

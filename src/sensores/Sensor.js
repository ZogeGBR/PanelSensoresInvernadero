// =====================================================================
// Sensor: el SUBJECT del patrón Observer
// =====================================================================
// Es la misma idea que la clase Subject de la práctica observers_1:
//   - guarda una lista de observers (funciones)
//   - subscribe() los agrega, unsubscribe() los saca, notify() les avisa
// Dos agregados para que funcione con React:
//   - subscribe() DEVUELVE la función para darse de baja (es el contrato que pide React)
//   - guarda un estado: el historial de lecturas

const MAX_LECTURAS = 30; // cuántas lecturas se guardan en el historial

export class Sensor {
    constructor({ id, nombre, unidad, valorInicial, limiteFisico, variacion, pico }) {
        this.id = id;                       // identificador: "temperatura", "humedad", "co2"
        this.nombre = nombre;               // texto para mostrar
        this.unidad = unidad;               // "°C", "%", "ppm"
        this.valorBase = valorInicial;      // valor "normal" alrededor del cual oscila
        this.limiteFisico = limiteFisico;   // { min, max }: lo que el sensor puede medir
        this.variacion = variacion;         // cuánto puede cambiar en cada lectura
        this.pico = pico;                   // cuánto sube cuando se fuerza un pico
        this.lecturas = [{ valor: valorInicial, hora: Date.now() }];
        this.observers = [];
    }

    // Getter: se lee como propiedad, sin paréntesis (sensor.observerCount)
    get observerCount() {
        return this.observers.length;
    }

    get ultimoValor() {
        return this.lecturas[this.lecturas.length - 1].valor;
    }

    subscribe(observer) {
        this.observers.push(observer);
        return () => this.unsubscribe(observer); // ← función de baja (cleanup)
    }

    unsubscribe(observer) {
        // filter compara por referencia: se queda con todos menos ese
        this.observers = this.observers.filter(o => o !== observer);
    }

    notify() {
        this.observers.forEach(observer => observer(this.lecturas));
    }

    registrar(valor) {
        const { min, max } = this.limiteFisico;
        const acotado = Math.min(max, Math.max(min, valor));   // nunca fuera de lo físico
        const redondeado = Math.round(acotado * 10) / 10;       // un decimal (evita 57499.999...)

        // Se crea un array NUEVO en vez de hacer push: así React detecta que cambió
        // (compara referencias, igual que === con objetos). slice(-30) deja las últimas 30.
        this.lecturas = [...this.lecturas, { valor: redondeado, hora: Date.now() }]
            .slice(-MAX_LECTURAS);

        this.notify();
    }
}

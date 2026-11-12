import { useSyncExternalStore } from "react";
import { suscribirATodos, leerFoto } from "../sensores/simulador";

// Conecta React con los sensores (estado que vive FUERA de React).
// useSyncExternalStore(subscribe, getSnapshot):
//   - React llama a suscribirATodos con un callback; cuando un sensor hace notify(),
//     ese callback le avisa a React que vuelva a renderizar.
//   - Para saber el valor actual, React llama a leerFoto.
// Al desmontar, React llama sola a la función de baja que devuelve suscribirATodos.
export function useLecturas() {
    return useSyncExternalStore(suscribirATodos, leerFoto);
}

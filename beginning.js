/**
 * Archivo beginning.js
 * 
 * Este archivo crea el estado inicial del juego a partir de los parámetros que se le pasen: cantidad de multiplicadores, cantidad de números:
 * 1 - crea el tablero como una matriz.
 * 2 - posiciona los números de 1 a cantidadNumeros en el tablero de forma aleatoria.
 * 3 - posiciona los multiplicadores en el tablero de forma aleatoria.
 * 4 - consigue posiciones de los caballos de forma aleatoria.
 * Todas esas posiciones están en ubicaciones diferentes y ninguna está en una misma casilla.
 * 
 * Además condiciona el comportamiento del juego con 2 parámetros extras:
 * IAversus: true si el juego será de IA vs IA, false si no.
 * multiplayer: true si el juego será de jugador vs jugador, false si es jugador vs IA
 */

// Creamos el tablero de 8 x 8 lleno de ceros
export let InicioTableroMatriz = Array.from({ length: 8 }, () => Array(8).fill(0));

/*
0 - casilla vacia
1 al 10 - casilla de puntaje
13 - multiplicador
*/

export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Parámetros del juego
export const cantidadX2 = 4;
export const cantidadNumeros = 10;
export const dificultad = 6;

// Condiciones del juego
export const IAversus = false;
export const multiplayer = false;


export let InicioPosicionCaballoJugador = null;
export let InicioPosicionCaballoCPU = null;

// Busca una posición aleatoria libre en la matriz, retorna su ubicación
function conseguirCeldaAleatoria() {
    while (true) {
        const i0 = getRandomInt(0, 7);
        const i1 = getRandomInt(0, 7);
        if (InicioTableroMatriz[i0][i1] === 0) {
            return { fila: i0, col: i1 };
        }
    }
}

// Colocamos los multiplicadores aleatoriamente
for (let i = 0; i < cantidadX2; i++) {
    const celda = conseguirCeldaAleatoria();
    const fila = celda['fila'], col = celda['col'];
    InicioTableroMatriz[fila][col] = 13;
}

// Colocamos las casillas con puntaje del 1 al 10 aleatoriamente
for (let i = 1; i <= cantidadNumeros; i++) {
    const celda = conseguirCeldaAleatoria();
    const fila = celda['fila'], col = celda['col'];
    InicioTableroMatriz[fila][col] = i;
}

// colocamos los caballos en posiciones diferentes
const ubicarCaballos = () => {
    while (true) {
        const celdaJ = conseguirCeldaAleatoria();
        const filaJ = celdaJ['fila'], colJ = celdaJ['col'];
        const celdaN = conseguirCeldaAleatoria();
        const filaN = celdaN['fila'], colN = celdaN['col'];

        if (filaJ !== filaN || colJ !== colN) {
            InicioPosicionCaballoJugador = {
                fila: filaJ,
                col: colJ
            };
            InicioPosicionCaballoCPU = {
                fila: filaN,
                col: colN
            };
            return null;
        }
    }
}
ubicarCaballos();

// Coloca un estado inicial personalizado, sino, comenta todo el código siguiente, recuerda que la información que coloques debe corresponder a la cantidad de multiplicadores y números que se establezca arriba


/* posicionCaballoJugadorI = {
    fila: 7,
    col: 0
}

posicionCaballoCPUI = {
    fila: 0,
    col: 7
} */

/* tableroMatrizI = [
    [0, 0,  0,  0,  0,  0,  0,  0],
    [0, 0,  0,  0,  0,  0,  0,  0],
    [0, 0,  0,  0,  0,  0,  0,  0],
    [0, 0,  0,  0,  0,  0,  0,  0],
    [0, 0,  0,  0,  0,  0,  0,  0],
    [0, 0,  0,  0,  0,  0,  0,  0],
    [0, 13,  13,  0,  0,  10,  9,  8],
    [0, 1,  2,  3,  4,  5,  6,  7]
] */
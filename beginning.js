/**
 * Archivo beginning.js
 * 
 * Este archivo crea el estado inicial del juego a partir de los parámetros que se le pasen: cantidad de multiplicadores, cantidad de números:
 * 1 - crea el tablero como una matriz.
 * 2 - posiciona los números de 1 a cantidadNumeros en el tablero de forma aleatoria.
 * 3 - posiciona los multiplicadores en el tablero de forma aleatoria representados con un 13.
 * 4 - consigue posiciones de los caballos de forma aleatoria.
 * Todas esas posiciones están en ubicaciones diferentes y ninguna está en una misma casilla.
 * 
 * Además condiciona el comportamiento del juego con 2 parámetros extras:
 * IAversus: true si el juego será de IA vs IA, false si no.
 * multiplayer: true si el juego será de jugador vs jugador, false si es jugador vs IA
 * 
 * Las funciones y parámetros de este archivo se exportan para que el archivo principal pueda usarlos para crear un nuevo juego cada vez que se necesite.
 */

/*
0       === casilla vacia
1 al 10 === casilla de puntaje
13      === casilla con multiplicador
*/

// Función auxiliar para obtener un número random dentro de un rango [min, max]
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Parámetros del juego
export const cantidadX2 = 4;
export const cantidadNumeros = 10;

// Función para obtener un nuevo tablero, con los elementos bien posicionados
export const generarTablero = () => {
    // Creamos el tablero de 8 x 8 lleno de ceros
    let InicioTableroMatriz = Array.from({ length: 8 }, () => Array(8).fill(0));
    let InicioPosicionCaballoJugador = null;
    let InicioPosicionCaballoCPU = null;

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

    return {
        nuevoTablero: InicioTableroMatriz,
        nuevaPosCaballoJugador: InicioPosicionCaballoJugador,
        nuevaPosCaballoCPU: InicioPosicionCaballoCPU,
    }
}
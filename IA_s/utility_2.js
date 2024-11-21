/**
 * Archivo utility_2.js
 * 
 * Este archivo provee la función de utilidad y la función que indica si el juego terminó para la IA #2. Caballo negro.
 */


// Implementa la lógica para determinar si el juego ha terminado.
// Miramos si ya se acabaron los números en el tablero.
export const isTerminal_2 = (estadoJuego) => {
  return estadoJuego['numerosRestantes'].length < 1;
}


// Función de utilidad: retorna la utilidad según el estado del juego
export const getScore_2 = (estadoJuego) => {
  // Definimos la lógica de puntuación, serán varias cosas

  // Sacamos los puntajes actuales de los caballos
  const scoreIA = estadoJuego["playerScore"];
  const scoreOponente = estadoJuego["cpuScore"];

  // Sumamos los números que quedan en el tablero
  const puntosDisponibles = estadoJuego["numerosRestantes"].reduce(
    (a, b) => a + b,
    0
  ); // Suma de casillas restantes

  // Miramos si los caballos tienen un multiplicador activo actualmente
  const x2ActivoIA = estadoJuego["playerMultiplier"]; // Si la IA tiene un multiplicador activo
  const x2ActivoOponente = estadoJuego["cpuMultiplier"]; // Si el oponente tiene un multiplicador activo

  // Sacamos los puntos que podría obtener cada caballo

  const puntosPotencialesIA = x2ActivoIA
    ? scoreIA + puntosDisponibles * 2
    : scoreIA + puntosDisponibles;

  const puntosPotencialesOponente = x2ActivoOponente
    ? scoreOponente + puntosDisponibles * 2
    : scoreOponente + puntosDisponibles;

  // Priorización: maximizar la ventaja sobre el oponente
  return puntosPotencialesIA - puntosPotencialesOponente;
}
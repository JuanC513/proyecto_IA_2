/**
 * Archivo utility_3.js
 *
 * Este archivo provee la función de utilidad y la función que indica si el juego terminó para la IA #3.
 */

// Determina si el juego ha terminado para la IA3
export const isTerminal_1 = (estadoJuego) => {
  return estadoJuego["numerosRestantes"].length < 1;
};

// Función de utilidad: retorna la utilidad según el estado del juego
export const getScore_1 = (estadoJuego) => {
  const scoreIA = estadoJuego["playerScore"];
  const scoreOponente = estadoJuego["cpuScore"];
  const puntosDisponibles = estadoJuego["numerosRestantes"].reduce(
    (a, b) => a + b,
    0
  ); // Suma de casillas restantes

  // x2 Activo para IA y oponente
  const x2ActivoIA = estadoJuego["x2Activo"]; // Si la IA tiene un multiplicador activo
  const x2ActivoOponente = estadoJuego["x2ActivoCPU"]; // Si el oponente tiene un multiplicador activo

  const puntosPotencialesIA = x2ActivoIA
    ? scoreIA + puntosDisponibles * 2
    : scoreIA + puntosDisponibles;

  const puntosPotencialesOponente = x2ActivoOponente
    ? scoreOponente + puntosDisponibles * 2
    : scoreOponente + puntosDisponibles;

  // Priorización: maximizar la ventaja sobre el oponente
  return puntosPotencialesIA - puntosPotencialesOponente;
};

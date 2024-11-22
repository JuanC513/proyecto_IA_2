/**
 * Archivo original de utilidad, no se usa en el proyecto
 * 
 * Este archivo debe proveer la función de utilidad y la función que indica si el juego terminó para la IA #x.
 */

// Implementa la lógica para determinar si el juego ha terminado.
export const isTerminal_x = (estadoJuego) => {
  if (estadoJuego['numerosRestantes'].length < 1) {
    return true;
  }
  return false;
}

// Función de utilidad: retorna la utilidad según el estado del juego
export const getScore_x = (estadoJuego) => {
  // Define la lógica de puntuación (por ejemplo, 1 para una victoria, -1 para una derrota, 0 para empate).
  let score = 0;
  if (estadoJuego['playerScore'] > estadoJuego['cpuScore']) {
    score = 1;
  } else if (estadoJuego['playerScore'] < estadoJuego['cpuScore']) {
    score = -1;
  } else {
    score = 0;
  }
  return score;
}
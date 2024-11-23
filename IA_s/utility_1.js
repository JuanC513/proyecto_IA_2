/**
 * Archivo utility_1.js
 * 
 * Este archivo provee la función de utilidad y la función que indica si el juego terminó para la IA #1. Caballo blanco.
 */


// Implementa la lógica para determinar si el juego ha terminado.
// Miramos si ya se acabaron los números en el tablero, y otra forma de saber si terminó,
// es mirar si alguno de los caballos tiene tantos puntos que su rival aunque consiga
// los puntos que quedan en el tablero no va a poder ni empatarlo, por lo cual ya habría un caballo ganador desde ese momento.
export const isTerminal_1 = (estadoJuego) => {
  const restantes = utilidadRestantes(estadoJuego);
  if (estadoJuego['playerScore'] > estadoJuego['cpuScore'] + restantes['cantidadRestanteC'] || estadoJuego['cpuScore'] > estadoJuego['playerScore'] + restantes['cantidadRestanteJ'] || estadoJuego['numerosRestantes'].length < 1) {
    return true;
  }
  return false;
}


// Función de utilidad: retorna la utilidad según el estado del juego
export const getScore_1 = (estadoJuego) => {
  // Definimos la lógica de puntuación, serán varias cosas
  let score = 0;

  // Sacamos una utilidad usando distancias de Manhattan
  const utilDistancias = utilidadDistancias(estadoJuego);

  // Sacamos una utilidad sumando el puntaje restante que puede obtener cada caballo
  const restantes = utilidadRestantes(estadoJuego);

  // Si ya hay un ganador ya que el rival no puede alcanzarlo, sumamos muchos puntos
  if (estadoJuego['playerScore'] > estadoJuego['cpuScore'] + restantes['cantidadRestanteC']) {
    score = 200;
  } else if (estadoJuego['cpuScore'] > estadoJuego['playerScore'] + restantes['cantidadRestanteJ']) {
    score = -200;
  } else { // Si no hay ganador fijo, usamos la diferencia entre los puntajes de los caballos
    score += estadoJuego['playerScore'] + restantes['cantidadRestanteJ'] - estadoJuego['cpuScore'] - restantes['cantidadRestanteC'];
  }
  
  // Aplicamos las utilidades que sacamos sumando lo que beneficie al jugador y restando lo que lo perjudique
  score -= utilDistancias['utilidadJugador'];
  score += utilDistancias['utilidadCPU'];

  // Sumamos o restamos a la utilidad según las veces que los caballos han estado en la casilla donde se encuentran ahora, indicando si hay bucles
  const registroCelda = estadoJuego['registroMovimientos'];
  // Definimos un peso para dar prioridad al puntaje que resta haber pasado varias veces por una casilla
  const peso = 30;

  const filaJ = estadoJuego['posicionCaballoJugador']['fila'], colJ = estadoJuego['posicionCaballoJugador']['col'];
  score -= registroCelda[filaJ][colJ]['caballoJugador'] * peso;

  const filaC = estadoJuego['posicionCaballoCPU']['fila'], colC = estadoJuego['posicionCaballoCPU']['col'];
  score += registroCelda[filaC][colC]['caballoCPU'] * peso;
  
  return score;
}


 // Sacamos una utilidad sumando las distancias de Manhattan de cada caballo a cada casilla de puntaje que quede en el tablero
function utilidadDistancias(estadoJuego) {
  const distanciaL = (ubi1, ubi2) => {
    return Math.abs(ubi1['fila'] - ubi2['fila']) + Math.abs(ubi1['col'] - ubi2['col']);
  }
  let utilidadJugador = 0;
  let utilidadCPU = 0;
  const posJugador = estadoJuego['posicionCaballoJugador'];
  const posCPU = estadoJuego['posicionCaballoCPU'];
  
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const unNumero = estadoJuego['tableroMatriz'][i][j];
      if (unNumero > 0 && unNumero <= 10) {
        const ubicacionNumero = {
          fila: i,
          col: j
        };
        // Hacemos el cociente del número y la distancia de los caballos a ese número, para darle prioridad a las casillas que tienen un puntaje mayor
        utilidadJugador += unNumero/distanciaL(ubicacionNumero, posJugador);
        utilidadCPU += unNumero/distanciaL(ubicacionNumero, posCPU);
      }
    }
  }
  
  return {
    utilidadJugador: utilidadJugador,
    utilidadCPU: utilidadCPU
  }
}


// Sacamos una utilidad sumando el puntaje restante que puede obtener cada caballo, esto teniendo en cuenta los números restantes en el tablero, los multiplicadores restantes y el multiplicador que tenga el caballo actualmente
function utilidadRestantes(estadoJuego) {
  let cantidadRestanteJ = 0;
  let cantidadRestanteC = 0;

  let cantidadMultiplicadoresJ =  estadoJuego['cantidadMultiplicadoresRestantes'];
  let cantidadMultiplicadoresM = estadoJuego['cantidadMultiplicadoresRestantes'];

  if (estadoJuego['playerMultiplier']) {
    cantidadMultiplicadoresJ += 1;
  }
  if (estadoJuego['cpuMultiplier']) {
    cantidadMultiplicadoresM += 1;
  }

  for (var i =  estadoJuego['numerosRestantes'].length - 1; i >= 0; i--) {
    if (cantidadMultiplicadoresJ < 1) {
      cantidadRestanteJ += estadoJuego['numerosRestantes'][i];
    } else {
      cantidadRestanteJ +=  estadoJuego['numerosRestantes'][i]*2;
      cantidadMultiplicadoresJ -= 1;
    }
    if (cantidadMultiplicadoresM < 1) {
      cantidadRestanteC +=  estadoJuego['numerosRestantes'][i];
    } else {
      cantidadRestanteC +=  estadoJuego['numerosRestantes'][i]*2;
      cantidadMultiplicadoresM -= 1;
    }
  }
  return {
    cantidadRestanteJ: cantidadRestanteJ,
    cantidadRestanteC: cantidadRestanteC,
  }
}
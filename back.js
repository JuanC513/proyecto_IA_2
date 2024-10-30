/**
 * Archivo back.js
 * 
 * Este archivo provee funciones que toman el estado del juego:
 * movimientosPieza: genera los movimientos válidos que puede realizar un caballo y los retorna las casillas objetivo en un array.
 * moverPieza: ejecuta un movimiento mientras sea válido, retorna el nuevo estado del juego.
 */

// Revisa los movimientos que puede realizar el caballo seleccionado, los retorna en una Array
export const movimientosPieza = (casillaSeleccionada, posJugador, posCPU) => {
  let fila = casillaSeleccionada["fila"], col = casillaSeleccionada["col"];
  let movimientosPosibles = [];

  movimientosPosibles.push([fila - 1, col - 2]);
  movimientosPosibles.push([fila - 2, col - 1]);
  movimientosPosibles.push([fila - 2, col + 1]);
  movimientosPosibles.push([fila - 1, col + 2]);
  movimientosPosibles.push([fila + 1, col - 2]);
  movimientosPosibles.push([fila + 2, col - 1]);
  movimientosPosibles.push([fila + 2, col + 1]);
  movimientosPosibles.push([fila + 1, col + 2]);

  return validarMovimientos(movimientosPosibles, posJugador, posCPU);
}


// Valida los movimientos generados y retorna los que se acepten
const validarMovimientos = (unosMovimientos, posJugador, posCPU) => {
  let movimientosValidos = [];

  for(let i = 0; i < unosMovimientos.length; i++) {
    const unMovimiento = unosMovimientos[i];
    if (validarUnMovimiento(unMovimiento, posJugador, posCPU)) {
      movimientosValidos.push(unMovimiento);
    }
  }
  return movimientosValidos;
}


// Validamos un movimiento del caballo: si no se sale del tablero y si no se va a mover sobre el otro caballo
const validarUnMovimiento = (unaCasilla, posJugador, posCPU) => {
  const unMovimiento = {
    fila: unaCasilla[0],
    col: unaCasilla[1]
  }

  if (unMovimiento["fila"] >= 0 && unMovimiento["fila"] <= 7 && unMovimiento["col"] >= 0 && unMovimiento["col"] <= 7) {
    const keys1 = Object.keys(unMovimiento);

    if (!keys1.every(key => unMovimiento[key] === posJugador[key] || unMovimiento[key] === posCPU[key])) {         
      return true;
    }
  }
  return false;
}


// Intenta mover la pieza a la casilla objetivo si está en la lista de casillas a la que se puede mover
export const moverPieza = (casillaObjetivo, estadoJuego) => {
  let nuevoEstado = JSON.parse(JSON.stringify(estadoJuego));
  const casillaElegida = [casillaObjetivo['fila'], casillaObjetivo['col']];
  
  if (nuevoEstado['casillasIluminadas'].map(JSON.stringify).includes(JSON.stringify(casillaElegida))) {
    let seConsumeElContenido = false;
    
    if (nuevoEstado['tableroMatriz'][casillaObjetivo['fila']][casillaObjetivo['col']] != 0) {
      const contenidoAlcanzado = nuevoEstado['tableroMatriz'][casillaObjetivo['fila']][casillaObjetivo['col']];
      const revision = revisarContenido(contenidoAlcanzado, estadoJuego);
      seConsumeElContenido = revision['seConsumeElContenido'];
      nuevoEstado = revision['nuevoEstado'];
    }

    const fila = casillaObjetivo["fila"], col = casillaObjetivo["col"];

    if (seConsumeElContenido) {
      nuevoEstado['tableroMatriz'][fila][col] = 0;
    }
    if (nuevoEstado['turnoJugador']) {
      nuevoEstado['posicionCaballoJugador'] = {
        fila: fila,
        col: col
      }
      const registroCelda = nuevoEstado['registroMovimientos'][fila][col];
      registroCelda['caballoJugador'] += 1;
    } else {
      nuevoEstado['posicionCaballoCPU'] = {
        fila: fila,
        col: col
      }
      const registroCelda = nuevoEstado['registroMovimientos'][fila][col];
      registroCelda['caballoCPU'] += 1;
    }
    nuevoEstado['turnoJugador'] = !nuevoEstado['turnoJugador'];
  }

  return nuevoEstado;
}


// Revisa el contenido al que se llegó, retorna el nuevo estado del juego y si se consumió el contenido (para ver si se agarró el multiplicador o no)
const revisarContenido = (unContenido, estadoJuego) => {
  const nuevoEstado = JSON.parse(JSON.stringify(estadoJuego));
  let seConsumeElContenido = false;
  if (unContenido == 13) { // Si el contenido es un multiplicador, miramos si lo consume el jugador actual
    const multiplicadorJugadorActual = nuevoEstado['turnoJugador'] ? 'playerMultiplier' : 'cpuMultiplier';
    if (!nuevoEstado[multiplicadorJugadorActual]) {
      seConsumeElContenido = true;
      nuevoEstado['cantidadMultiplicadoresRestantes'] -= 1;
    }
    nuevoEstado[multiplicadorJugadorActual] = true;
  } else { // Si el contenido es un número, miramos si se da el número normal o el doble por multiplicador
    const number = unContenido;
    let multiplicador = 1;
    if (nuevoEstado['turnoJugador'] && nuevoEstado['playerMultiplier'] || !nuevoEstado['turnoJugador'] && nuevoEstado['cpuMultiplier']) {
      multiplicador = 2;
    }

    const scoreKey = nuevoEstado['turnoJugador'] ? 'playerScore' : 'cpuScore';
    const multiplierKey = nuevoEstado['turnoJugador'] ? 'playerMultiplier' : 'cpuMultiplier';

    nuevoEstado[scoreKey] += number * multiplicador;
    nuevoEstado[multiplierKey] = false;

    seConsumeElContenido = true;
    nuevoEstado['numerosRestantes'] = nuevoEstado['numerosRestantes'].filter(num => num !== number); // Sacamos el número consumido de la lista de restantes
  }
  
  return {
    nuevoEstado: nuevoEstado,
    seConsumeElContenido: seConsumeElContenido
  }
}
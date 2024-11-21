/**
 * Archivo IA.js
 * 
 * Este archivo provee las funciones necesarias para que una IA haga una jugada:
 * jugadaIA: recibe el estado del juego, la dificultad y qué IA se usarán: primera = true -> se usa la utilidad_1, false -> se usa la utilidad_2
 * getBestMove: recibe el nodo raíz del árbol, la profundidad que se usará y si se está maximizando al jugador, ejecutará minimax sobre los hijos para ver cuál se escoje según el criterio isMaximizingPlayer y de éste se obtene la jugada que se hará por parte de la IA.
 * minimax: la función minimax que tiene incluida la poda alpha-beta
 * 
 * Además de la clase de la cual se harán los nodos para realizar el árbol.
 */

import { movimientosPieza, moverPieza } from '../back.js'
import { isTerminal_1, getScore_1 } from './utility_1.js'
import { isTerminal_2, getScore_2 } from './utility_2.js'

// Sigue la cantidad de nodos que crea el árbol minimax, no es necesario, pero por si acaso se quiere ver
let nodosArbolMinimax = 0;


// Recibe el estado del juego, la dificultad y qué IA se usará, retorna el mejor movimiento de la IA basado en los resultados del algoritmo minimax usando el lenguaje JavaScript
export const jugadaIA = (estadoJuego, dificultad, primeraIA) => {
  const initialState = JSON.parse(JSON.stringify(estadoJuego)); // el estado inicial del juego
  initialState['cantidadJugadas'] = 0;
  nodosArbolMinimax = 0;

  const rootNode = new GameNode(initialState);
  const depth = dificultad; // Profundidad máxima de búsqueda
  const isMaximizingPlayer = estadoJuego['turnoJugador'];

  const bestMove = getBestMove(rootNode, depth, isMaximizingPlayer, primeraIA);
  console.log("nodos: ", nodosArbolMinimax);

  return bestMove;
}

// Recibe el estado del juego, la dificultad y qué IA se usará, retorna el mejor movimiento de la IA basado en los resultados del algoritmo minimax usando el lenguaje Golang
export const jugadaIAconGolang = async (estadoJuego, dificultad, primeraIA) => {
  const initialState = JSON.parse(JSON.stringify(estadoJuego)); // el estado inicial del juego
  initialState['cantidadJugadas'] = 0;
  nodosArbolMinimax = 0;

  const rootNode = new GameNode(initialState);
  const depth = dificultad; // Profundidad máxima de búsqueda
  const isMaximizingPlayer = estadoJuego['turnoJugador'];

  //const bestMove = getBestMove(rootNode, depth, isMaximizingPlayer, primeraIA);
  console.log("nodosJS: ", nodosArbolMinimax);

  //const resultado = await enviarDatos(initialState, depth, isMaximizingPlayer, primeraIA);
  // Llamamos a enviarDatos y usamos .then() para manejar la promesa
  return enviarDatos(estadoJuego, depth, isMaximizingPlayer, primeraIA)
    .then(respuesta => {
      // Aquí se maneja la respuesta cuando la promesa se resuelve
      return respuesta; // Retornamos la respuesta
    })
    .catch(error => {
      // Aquí manejamos posibles errores
      console.error("Error en enviarDatos:", error);
    });
}

// Función con la que le pasaremos el JSON a Golang para que ejecute y retorne la mejor jugada de la IA correspondiente
const enviarDatos = async (estadoJuego, profundidad, isMaximizingPlayer, primeraIA) => {
  const data = {
    estadoJuego: estadoJuego,
    profundidad: profundidad,
    isMaximizingPlayer: isMaximizingPlayer,
    primeraIA: primeraIA,
  };

  const response = await fetch("http://localhost:8082/getBestMove", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (response.ok) {
    const respuesta = await response.json();
    return respuesta;
  } else {
    console.error("Error al enviar los datos");
  }
};


// Función que recibe el nodo raíz del árbol, la profundidad e IA que se usarán y si se está maximizando al jugador, ejecutará minimax sobre los hijos para ver cuál se escoje y de éste se obtene la jugada que se hará por parte de la IA elegida.
function getBestMove(rootNode, depth, isMaximizingPlayer, primeraIA) {
  let bestMove = null;
  let bestScore = isMaximizingPlayer ? -Infinity : Infinity;

  for (const child of rootNode.getChildren(isMaximizingPlayer)) {
    const childScore = minimax(child, depth - 1, !isMaximizingPlayer, -Infinity, Infinity, primeraIA);
    if (isMaximizingPlayer) {
      // Si es el jugador maximizante, buscamos el puntaje más alto
      if (childScore > bestScore) {
        bestScore = childScore;          
        bestMove = child.state['posicionCaballoJugador'];
      }
    } else {
      // Si es el jugador minimizante, buscamos el puntaje más bajo
      if (childScore < bestScore) {
        bestScore = childScore;
        bestMove = child.state['posicionCaballoCPU'];
      }
    }
  }
  return bestMove;
}


// Función minimax con poda alpha-beta, con la IA elegida
function minimax(node, depth, isMaximizingPlayer, alpha, beta, primeraIA) {
  // Caso base: Si estamos en un nodo hoja o la profundidad máxima se ha alcanzado, o el juego ha terminado.
  if (depth === 0 || node.isTerminal(primeraIA)) {
    nodosArbolMinimax += 1;
    return node.getScore(primeraIA);
  }

  if (isMaximizingPlayer) {
    let maxEval = -Infinity;
    for (const child of node.getChildren(isMaximizingPlayer)) {
      const evaluation = minimax(child, depth - 1, false, alpha, beta, primeraIA);

      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) {
        break; // Poda beta
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const child of node.getChildren(isMaximizingPlayer)) {
      const evaluation = minimax(child, depth - 1, true, alpha, beta, primeraIA);
      
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) {
        break; // Poda alfa
      }
    }
    return minEval;
  }
}


// Clase de los nodos de juego que harán parte del árbol minimax.
class GameNode {
  constructor(state) {
    this.state = state; // Estado actual del juego
  }

  // Implementa la lógica para determinar si el juego ha terminado, con la IA elegida.
  isTerminal(primeraIA) {
    if (primeraIA) {
      return isTerminal_1(this.state);
    } else {
      return isTerminal_2(this.state);
    }
  }
  
  // Función de utilidad con la IA elegida.
  getScore(primeraIA) {
    if (primeraIA) {
      return getScore_1(this.state);
    } else {
      return getScore_2(this.state);
    }
  }

  // Devuelve una lista de nodos hijo (posibles movimientos del desde este estado).
  getChildren(turnoJugador) {
    let caballoActual = turnoJugador ? this.state['posicionCaballoJugador'] : this.state['posicionCaballoCPU'];

    this.state['casillasIluminadas'] = movimientosPieza(caballoActual, this.state['posicionCaballoJugador'], this.state['posicionCaballoCPU']);
    const children = [];
    
    for(let i = 0; i < this.state['casillasIluminadas'].length; i++) {
      const fila = this.state['casillasIluminadas'][i][0], col = this.state['casillasIluminadas'][i][1];
      const casillaObjetivo = { fila: fila, col: col };

      let newState = JSON.parse(JSON.stringify(this.state));
      newState = moverPieza(casillaObjetivo, newState);
      newState['cantidadJugadas'] += 1;
      children.push(new GameNode(newState));
    }
    return children /* lista de nodos hijos */;
  }
}
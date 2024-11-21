/**
 * Archivo IA.go
 * 
 * Este archivo provee las funciones necesarias para que una IA haga una jugada:
 * jugadaIA: recibe el estado del juego, la dificultad y qué IA se usarán: primeraIA = true -> se usa la utilidad_1, false -> se usa la utilidad_2
 * getBestMove: recibe el nodo raíz del árbol, la profundidad que se usará y si se está maximizando al jugador, ejecutará minimax sobre los hijos para ver cuál se escoje según el criterio isMaximizingPlayer y de éste se obtene la jugada que se hará por parte de la IA.
 * minimax: la función minimax que tiene incluida la poda alpha-beta
 * 
 * Además de la clase de la cual se harán los nodos para realizar el árbol.
 */


package main


import (
	"fmt"
	"math"
)


// Variable global para contar los nodos evaluados
var nodosArbolMinimax int

// Recibe el estado del juego, la dificultad y qué IA se usará, retorna el mejor movimiento de la IA basado en los resultados del algoritmo minimax
func jugadaIA(estadoJuego *EstadoJuego, profundidad int, isMaximizingPlayer bool, primeraIA bool) (int, int) {
	// Creamos el nodo raíz con el estado actual del juego
	rootNode := NewGameNode(estadoJuego)
	nodosArbolMinimax = 0
	
	// Obtenemos el mejor movimiento
	bestMove := getBestMove(rootNode, profundidad, isMaximizingPlayer, primeraIA)
	fmt.Printf("NodosExpandidos: %d\n", nodosArbolMinimax)

	return bestMove.Fila, bestMove.Col
}


// Función que recibe el nodo raíz del árbol, la profundidad e IA que se usarán y si se está maximizando al jugador, ejecutará minimax sobre los hijos para ver cuál se escoje y de éste se obtene la jugada que se hará por parte de la IA elegida.
func getBestMove(rootNode *GameNode, depth int, isMaximizingPlayer bool, primeraIA bool) (Posicion) {
	bestMove := Posicion{}
	bestScore := math.MinInt

	if !isMaximizingPlayer {
		bestScore = math.MaxInt
	}

	for _, child := range rootNode.GetChildren(isMaximizingPlayer) {
		childScore := minimax(child, depth-1, !isMaximizingPlayer, math.MinInt, math.MaxInt, primeraIA)
		if isMaximizingPlayer {
			if childScore > bestScore {
				bestScore = childScore
				bestMove = child.State.PosicionCaballoJugador
			}
		} else {
			if childScore < bestScore {
				bestScore = childScore
				bestMove = child.State.PosicionCaballoCPU
			}
		}
	}

	return bestMove
}


// Función minimax con poda alpha-beta, con la IA elegida
func minimax(node *GameNode, depth int, isMaximizingPlayer bool, alpha int, beta int, primeraIA bool) int {

	// Incrementamos el contador global de nodos
	nodosArbolMinimax++

	// Caso base: si se alcanza la profundidad máxima o el juego ha terminado
	if depth == 0 || node.IsTerminal(primeraIA) {
		return int(node.GetScore(primeraIA))
	}

	if isMaximizingPlayer {
		maxEval := math.MinInt
		for _, child := range node.GetChildren(isMaximizingPlayer) {
			evaluation := minimax(child, depth-1, false, alpha, beta, primeraIA)
			maxEval = max(maxEval, evaluation)
			alpha = max(alpha, evaluation)
			if beta <= alpha {
				break // Poda beta
			}
		}
		return maxEval
	} else {
		minEval := math.MaxInt
		for _, child := range node.GetChildren(isMaximizingPlayer) {
			evaluation := minimax(child, depth-1, true, alpha, beta, primeraIA)
			minEval = min(minEval, evaluation)
			beta = min(beta, evaluation)
			if beta <= alpha {
				break // Poda alfa
			}
		}
		return minEval
	}
}


// Estructura que representa el nodo de juego en el árbol Minimax
type GameNode struct {
	State *EstadoJuego
}

// Crea un nuevo nodo de juego
func NewGameNode(estadoJuego *EstadoJuego) *GameNode {
	return &GameNode{State: estadoJuego}
}


// Implementa la lógica para determinar si el juego ha terminado, con la IA elegida.
func (gn *GameNode) IsTerminal(primeraIA bool) bool {
	if primeraIA {
		return isTerminal_1(gn.State)
	}
	return isTerminal_2(gn.State)
}


// Función de utilidad con la IA elegida.
func (gn *GameNode) GetScore(primeraIA bool) int {
	if primeraIA {
		return getScore_1(gn.State)
	}
	return getScore_2(gn.State)
}


// Devuelve una lista de nodos hijo (posibles movimientos del desde este estado).
func (gn *GameNode) GetChildren(turnoJugador bool) []*GameNode {
	var children []*GameNode
	caballoActual := gn.State.PosicionCaballoJugador
	if !turnoJugador {
		caballoActual = gn.State.PosicionCaballoCPU
	}

	// Calculamos los movimientos posibles para el caballo
	gn.State.CasillasIluminadas = movimientosPieza(caballoActual, gn.State.PosicionCaballoJugador, gn.State.PosicionCaballoCPU)

	for _, casilla := range gn.State.CasillasIluminadas {
		// Creamos una copia del estado del juego
		newState := *gn.State

		// Convertimos [2]int a Posicion antes de pasar a moverPieza
		newPos := Posicion{Fila: casilla[0], Col: casilla[1]}

		// Movemos la pieza a la nueva casilla
		newState = moverPieza(newPos, &newState)

		// Agregamos el hijo al árbol
		children = append(children, NewGameNode(&newState))
	}

	return children
}



// Funciones auxiliares para operaciones matemáticas simples
func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
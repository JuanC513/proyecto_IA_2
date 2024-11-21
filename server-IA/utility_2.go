// utility_2.go
/**
 * Archivo utility_2.go
 * 
 * Este archivo provee la función de utilidad y la función que indica si el juego terminó para la IA #2. Caballo negro.
 */

package main


// Implementa la lógica para determinar si el juego ha terminado.
func isTerminal_2(estadoJuego *EstadoJuego) bool {
    // Si la lista de números restantes está vacía, el juego ha terminado
    return len(estadoJuego.NumerosRestantes) < 1
}


// Función de utilidad: retorna la utilidad según el estado del juego
func getScore_2(estadoJuego *EstadoJuego) int {
    // Definimos la lógica de puntuación, serán varias cosas

    // Sumar los puntos restantes
	puntosDisponibles := 0
	for _, numero := range estadoJuego.NumerosRestantes {
		puntosDisponibles += numero
	}

	// Calcular los puntos potenciales para la IA

	puntosPotencialesIA := estadoJuego.PlayerScore
    // Si la IA tiene un multiplicador activo, lo aplicamos
	if estadoJuego.PlayerMultiplier {
		puntosPotencialesIA += puntosDisponibles * 2
	} else {
		puntosPotencialesIA += puntosDisponibles
	}

	// Calcular los puntos potenciales para el oponente
    
	puntosPotencialesOponente := estadoJuego.CpuScore
    // Si el oponente tiene un multiplicador activo, lo aplicamos
	if estadoJuego.CpuMultiplier {
		puntosPotencialesOponente += puntosDisponibles * 2
	} else {
		puntosPotencialesOponente += puntosDisponibles
	}

	// Priorización: maximizar la ventaja sobre el oponente
	return puntosPotencialesIA - puntosPotencialesOponente
}
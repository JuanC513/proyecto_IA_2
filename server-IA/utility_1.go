// utility_1.go
/**
 * Archivo utility_1.go
 * 
 * Este archivo provee la función de utilidad y la función que indica si el juego terminó para la IA #1. Caballo blanco.
 */

package main


import (
	"math"
)


// Implementa la lógica para determinar si el juego ha terminado.
// Miramos si ya se acabaron los números en el tablero, y otra forma de saber si terminó,
// es mirar si alguno de los caballos tiene tantos puntos que su rival aunque consiga
// los puntos que quedan en el tablero no va a poder ni empatarlo, por lo cual ya habría un caballo ganador desde ese momento.
func isTerminal_1(estadoJuego *EstadoJuego) bool {
    // Obtener los valores de utilidad
    restantesJugador, restantesCPU := utilidadRestantes(estadoJuego)

    // Verificar las condiciones para que el juego haya terminado
    if estadoJuego.PlayerScore > estadoJuego.CpuScore+restantesCPU || 
		estadoJuego.CpuScore > estadoJuego.PlayerScore+restantesJugador || 
		len(estadoJuego.NumerosRestantes) < 1 {
        return true
    }
    
    return false
}


// Función de utilidad: retorna la utilidad según el estado del juego
func getScore_1(estadoJuego *EstadoJuego) int {
    // Definimos la lógica de puntuación, serán varias cosas
    score := 0

    // Sacamos una utilidad usando distancias de Manhattan
    utilDistJugador, utilDistCPU := utilidadDistancias(estadoJuego)

    // Sacamos una utilidad sumando el puntaje restante que puede obtener cada caballo
    restantesJugador, restantesCPU := utilidadRestantes(estadoJuego)

    // Si ya hay un ganador ya que el rival no puede alcanzarlo, sumamos muchos puntos
    if estadoJuego.PlayerScore > estadoJuego.CpuScore+restantesCPU {
        score = 200
    } else if estadoJuego.CpuScore > estadoJuego.PlayerScore+restantesJugador {
        score = -200
    } else { // Si no hay ganador fijo, usamos la diferencia entre los puntajes de los caballos
        score += estadoJuego.PlayerScore + restantesJugador - estadoJuego.CpuScore - restantesCPU
    }

    // Aplicamos las utilidades que sacamos sumando lo que beneficie al jugador y restando lo que lo perjudique
    score -= utilDistJugador
    score += utilDistCPU

    // Sumamos o restamos a la utilidad según las veces que los caballos han estado en la casilla donde se encuentran ahora, indicando si hay bucles
    registroCelda := estadoJuego.RegistroMovimientos
    // Definimos un peso para dar prioridad al puntaje que resta haber pasado varias veces por una casilla
    peso := 30

    filaJ, colJ := estadoJuego.PosicionCaballoJugador.Fila, estadoJuego.PosicionCaballoJugador.Col
    score -= registroCelda[filaJ][colJ].CaballoJugador * peso

    filaC, colC := estadoJuego.PosicionCaballoCPU.Fila, estadoJuego.PosicionCaballoCPU.Col
    score += registroCelda[filaC][colC].CaballoCPU * peso

    return score
}


// Función para obtener el valor absoluto de un entero
func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}

// Calcula la distancia de Manhattan
func distanciaL(ubi1, ubi2 Posicion) int {
    return abs(ubi1.Fila-ubi2.Fila) + abs(ubi1.Col-ubi2.Col)
}

// Sacamos una utilidad sumando las distancias de Manhattan de cada caballo a cada casilla de puntaje que quede en el tablero
func utilidadDistancias(estadoJuego *EstadoJuego) (int, int) {
    var utilidadJugador, utilidadCPU int

    posJugador := estadoJuego.PosicionCaballoJugador
    posCPU := estadoJuego.PosicionCaballoCPU

    // Iterar por todos los números en el tablero
    for i := 0; i < 8; i++ {
        for j := 0; j < 8; j++ {
            unNumero := estadoJuego.TableroMatriz[i][j]
            if unNumero > 0 && unNumero <= 10 {
                ubicacionNumero := Posicion{Fila: i, Col: j}
                
                // Hacemos el cociente del número y la distancia de los caballos a ese número, para darle prioridad a las casillas que tienen un puntaje mayor
                utilidadJugador += int(math.Ceil(float64(unNumero) / float64(distanciaL(ubicacionNumero, posJugador))))
                utilidadCPU += int(math.Ceil(float64(unNumero) / float64(distanciaL(ubicacionNumero, posCPU))))
            }
        }
    }

    return utilidadJugador, utilidadCPU
}


// Sacamos una utilidad sumando el puntaje restante que puede obtener cada caballo, esto teniendo en cuenta los números restantes en el tablero, los multiplicadores restantes y el multiplicador que tenga el caballo actualmente
func utilidadRestantes(estadoJuego *EstadoJuego) (int, int) {
    var cantidadRestanteJ, cantidadRestanteC int

    // Cantidad de multiplicadores restantes para jugador y CPU
    cantidadMultiplicadoresJ := estadoJuego.CantidadMultiplicadoresRestantes
    cantidadMultiplicadoresM := estadoJuego.CantidadMultiplicadoresRestantes

    // Si el jugador tiene un multiplicador, aumentamos la cantidad de multiplicadores
    if estadoJuego.PlayerMultiplier {
        cantidadMultiplicadoresJ++
    }
    // Si la CPU tiene un multiplicador, aumentamos la cantidad de multiplicadores
    if estadoJuego.CpuMultiplier {
        cantidadMultiplicadoresM++
    }

    // Iteramos sobre los números restantes (de atrás hacia adelante)
    for i := len(estadoJuego.NumerosRestantes) - 1; i >= 0; i-- {
        numero := estadoJuego.NumerosRestantes[i]

        // Si no hay multiplicadores restantes para el jugador, sumamos el número normalmente
        if cantidadMultiplicadoresJ < 1 {
            cantidadRestanteJ += numero
        } else {
            // Si hay multiplicadores, duplicamos el número y restamos uno del multiplicador
            cantidadRestanteJ += numero * 2
            cantidadMultiplicadoresJ--
        }

        // Lo mismo para la CPU
        if cantidadMultiplicadoresM < 1 {
            cantidadRestanteC += numero
        } else {
            cantidadRestanteC += numero * 2
            cantidadMultiplicadoresM--
        }
    }

    // Retornamos los resultados
    return cantidadRestanteJ, cantidadRestanteC
}
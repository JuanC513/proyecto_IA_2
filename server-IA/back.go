// back.go
/**
 * Archivo back.go
 * 
 * Este archivo provee funciones que toman el estado del juego:
 * movimientosPieza: genera los movimientos válidos que puede realizar un caballo y los retorna las casillas objetivo en un array.
 * moverPieza: ejecuta un movimiento mientras sea válido, retorna el nuevo estado del juego.
 */


package main


func movimientosPieza(casillaSeleccionada Posicion, posJugador Posicion, posCPU Posicion) [][2]int {
	// Obtener las coordenadas de la casilla seleccionada
    fila, col := casillaSeleccionada.Fila, casillaSeleccionada.Col

    // Movimientos posibles de un caballo en ajedrez
    movimientosPosibles := [][2]int{
        {fila - 1, col - 2},
        {fila - 2, col - 1},
        {fila - 2, col + 1},
        {fila - 1, col + 2},
        {fila + 1, col - 2},
        {fila + 2, col - 1},
        {fila + 2, col + 1},
        {fila + 1, col + 2},
    }

    // Validar y retornar los movimientos válidos
    return validarMovimientos(movimientosPosibles, posJugador, posCPU)
}

// Función que valida los movimientos (básicamente revisa los límites del tablero y las posiciones ocupadas)
func validarMovimientos(unosMovimientos [][2]int, posJugador Posicion, posCPU Posicion) [][2]int {
    var movimientosValidos [][2]int

    for _, unMovimiento := range unosMovimientos {
        if validarUnMovimiento(unMovimiento, posJugador, posCPU) {
            movimientosValidos = append(movimientosValidos, unMovimiento)
        }
    }
    return movimientosValidos
}

// Validar un movimiento del caballo: si no se sale del tablero y si no se va a mover sobre el otro jugador o CPU
func validarUnMovimiento(unaCasilla [2]int, posJugador Posicion, posCPU Posicion) bool {
    fila, col := unaCasilla[0], unaCasilla[1]

    // Validar que el movimiento está dentro de los límites del tablero (8x8)
    if fila >= 0 && fila <= 7 && col >= 0 && col <= 7 {
        // Verificar que no se solape con las posiciones del jugador o CPU
        if !(fila == posJugador.Fila && col == posJugador.Col) && !(fila == posCPU.Fila && col == posCPU.Col) {
            return true
        }
    }
    return false
}


func moverPieza(casillaObjetivo Posicion, estadoJuego *EstadoJuego) EstadoJuego {
    nuevoEstado := *estadoJuego // Crear una copia del estado actual
	// Crear una copia profunda de NumerosRestantes para evitar efectos secundarios
    nuevoEstado.NumerosRestantes = append([]int(nil), estadoJuego.NumerosRestantes...)
    

    casillaElegida := [2]int{casillaObjetivo.Fila, casillaObjetivo.Col}

    // Comprobar si la casilla está iluminada
    for _, casilla := range nuevoEstado.CasillasIluminadas {
        if casilla[0] == casillaElegida[0] && casilla[1] == casillaElegida[1] {
            // Casilla válida, intentar mover
            seConsumeElContenido := false

            // Verificar si hay contenido en la casilla objetivo
            contenidoAlcanzado := nuevoEstado.TableroMatriz[casillaObjetivo.Fila][casillaObjetivo.Col]
            if contenidoAlcanzado != 0 {
                // Revisar el contenido de la casilla
                //revision := revisarContenido(contenidoAlcanzado, estadoJuego)
				nuevoEstado, seConsumeElContenido = revisarContenido(contenidoAlcanzado, estadoJuego)
                /* seConsumeElContenido = revision.SeConsumeElContenido
                nuevoEstado = revision.NuevoEstado */
            }

            // Mover el caballo
            fila, col := casillaObjetivo.Fila, casillaObjetivo.Col

            if seConsumeElContenido {
                nuevoEstado.TableroMatriz[fila][col] = 0 // Eliminar el contenido de la casilla
            }

            registroCelda := nuevoEstado.RegistroMovimientos[fila][col]

            // Actualizar la posición del caballo dependiendo de quién es el turno
            if nuevoEstado.TurnoJugador {
                nuevoEstado.PosicionCaballoJugador = Posicion{Fila: fila, Col: col}
                registroCelda.CaballoJugador++
            } else {
                nuevoEstado.PosicionCaballoCPU = Posicion{Fila: fila, Col: col}
                registroCelda.CaballoCPU++
            }

            // Cambiar el turno
            nuevoEstado.TurnoJugador = !nuevoEstado.TurnoJugador

            return nuevoEstado
        }
    }

    // Si no se encuentra la casilla iluminada, retornar el estado original
    return *estadoJuego
}

// Revisa el contenido al que se llegó, retorna el nuevo estado del juego y si se consumió el contenido (para ver si se agarró el multiplicador o no)
func revisarContenido(unContenido int, estadoJuego *EstadoJuego) (NuevoEstado EstadoJuego, SeConsumeElContenido bool) {
    nuevoEstado := *estadoJuego // Crear una copia del estado
    seConsumeElContenido := false

    if unContenido == 13 { // Si el contenido es un multiplicador
        // Si el jugador actual no ha consumido un multiplicador aún
        if !nuevoEstado.PlayerMultiplier && !nuevoEstado.CpuMultiplier {
            seConsumeElContenido = true
            nuevoEstado.CantidadMultiplicadoresRestantes--
        }

        if nuevoEstado.TurnoJugador {
            nuevoEstado.PlayerMultiplier = true
        } else {
            nuevoEstado.CpuMultiplier = true
        }

    } else { // Si el contenido es un número
        var multiplicador int
        if (nuevoEstado.TurnoJugador && nuevoEstado.PlayerMultiplier) || (!nuevoEstado.TurnoJugador && nuevoEstado.CpuMultiplier) {
            multiplicador = 2
		} else {
            multiplicador = 1
        }

        var scoreKey string
        //var multiplierKey string

        if nuevoEstado.TurnoJugador {
            scoreKey = "PlayerScore"
            //multiplierKey = "PlayerMultiplier"
        } else {
            scoreKey = "CpuScore"
            //multiplierKey = "CpuMultiplier"
        }

        // Actualizar el puntaje del jugador o CPU
        if scoreKey == "PlayerScore" {
            nuevoEstado.PlayerScore += unContenido * multiplicador
        } else {
            nuevoEstado.CpuScore += unContenido * multiplicador
        }

        // Restablecer el multiplicador
        nuevoEstado.PlayerMultiplier = false
        nuevoEstado.CpuMultiplier = false

        seConsumeElContenido = true

        // Eliminar el número de la lista de números restantes
        for i, num := range nuevoEstado.NumerosRestantes {
            if num == unContenido {
				restantesOriginal := append([]int(nil), estadoJuego.NumerosRestantes...)
                nuevoEstado.NumerosRestantes = append(restantesOriginal[:i], restantesOriginal[i+1:]...)
                break
            }
        }
    }

    return nuevoEstado, seConsumeElContenido
}
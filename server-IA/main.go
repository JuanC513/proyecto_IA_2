// main.go
package main

import (
	"encoding/json"
	"log"
	"net/http"
)


// Estructura para los datos que vamos a recibir
type RequestData struct {
	EstadoJuego EstadoJuego `json:"estadoJuego"`
	Profundidad   int    `json:"profundidad"`
	IsMaximizingPlayer bool `json:"isMaximizingPlayer"`
	PrimeraIA bool `json:"primeraIA"`
}

// Estructura para el EstadoJuego
type EstadoJuego struct {
	TableroMatriz             [][]int `json:"tableroMatriz"`    // Suponiendo que 'InicioTableroMatriz' es una matriz de strings
	PlayerScore               int        `json:"playerScore"`
	CpuScore                 int        `json:"cpuScore"`
	PlayerMultiplier         bool       `json:"playerMultiplier"`
	CpuMultiplier            bool       `json:"cpuMultiplier"`
	PosicionCaballoJugador   Posicion     `json:"posicionCaballoJugador"`  // Suponiendo que son coordenadas en un array de 2 enteros
	PosicionCaballoCPU       Posicion     `json:"posicionCaballoCPU"`
	CasillasIluminadas       [][2]int    `json:"casillasIluminadas"`      // Array de casillas iluminadas (si son coordenadas o números, usa el tipo adecuado)
	TurnoJugador             bool       `json:"turnoJugador"`
	NumerosRestantes         []int      `json:"numerosRestantes"`        // Array de números restantes
	CantidadMultiplicadoresRestantes int `json:"cantidadMultiplicadoresRestantes"`
	RegistroMovimientos      [][]Movimiento `json:"registroMovimientos"`     // Array de registros de movimientos
	CantidadJugadas               int        `json:"cantidadJugadas"`    // Cantidad de jugadas que se realizan desde que entra aquí hasta lo que va expandiendo minimax
}

// Representa una posición en el tablero (fila, columna)
type Posicion struct {
	Fila int `json:"fila"`
	Col  int `json:"col"`
}

// Representa la cantidad de veces que un caballo se ha movido hacia una celda
type Movimiento struct {
	CaballoJugador int `json:"caballoJugador"`
	CaballoCPU     int `json:"caballoCPU"`
}

// Estructura para la respuesta de la petición
type ResponseData struct {
	Fila    int `json:"fila"`
	Columna int `json:"col"`
}

// Función para manejar la solicitud de la mejor jugada
func bestMoveHandler(w http.ResponseWriter, r *http.Request) {
	// Habilitar CORS
	habilitarCORS(w)

	// Si la solicitud es OPTIONS, solo devolvemos una respuesta vacía para que el navegador pueda continuar
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	// Aceptamos solo POST
	if r.Method != http.MethodPost {
		http.Error(w, "Método no permitido", http.StatusMethodNotAllowed)
		return
	}

	// Decodificar el JSON recibido
	var requestData RequestData
	err := json.NewDecoder(r.Body).Decode(&requestData)
	if err != nil {
		http.Error(w, "Error al leer los datos", http.StatusBadRequest)
		return
	}

	// Llamamos a la función del archivo 'procesador.go' para procesar los datos
	fila, columna := jugadaIA(&requestData.EstadoJuego, requestData.Profundidad, requestData.IsMaximizingPlayer, requestData.PrimeraIA)

	// Preparar la respuesta
	responseData := ResponseData{
		Fila:    fila,
		Columna: columna,
	}

	// Configurar la cabecera para que el cliente entienda la respuesta JSON
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	// Enviar la respuesta en formato JSON
	err = json.NewEncoder(w).Encode(responseData)
	if err != nil {
		http.Error(w, "Error al enviar la respuesta", http.StatusInternalServerError)
	}
}


// Función para habilitar CORS
func habilitarCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*") // Permite todos los orígenes, puedes restringirlo a un origen específico
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE") // Métodos permitidos
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type") // Encabezados permitidos
}

func main() {
	// Ruta para el mejor movimiento
	http.HandleFunc("/getBestMove", bestMoveHandler)


	log.Println("Servidor corriendo en http://localhost:8082")
	log.Fatal(http.ListenAndServe(":8082", nil))
}

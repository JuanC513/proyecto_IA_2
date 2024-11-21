// Variables inicializadas para almacenar las selecciones
let modoDeJuego = null; // Puede ser multiplayer, vsCPU, iaVs
let dificultad_1 = 1; // Puede ser 2, 4, 6 para la IA #1, caballo blanco
let dificultad_2 = 1; // Puede ser 2, 4, 6 para la IA #2, caballo negro
let lenguaje = "";


// Dejamos que al principio sólo se vea la pantalla de configuración
document.getElementById('gameScreen').classList.remove('active');

// Captura de los botones de lenguaje
const languageButtons = document.querySelectorAll('.language-btn');
languageButtons.forEach(button => {
    button.addEventListener('click', () => {
        languageButtons.forEach(b => b.classList.remove('selected')); // Desmarcar otros botones
        button.classList.add('selected');
        lenguaje = button.getAttribute('data-language'); // Guardar selección
    });
});

// Captura de los botones de dificultad_1
const difficultyButtons_1 = document.querySelectorAll('.difficulty_1-btn');
difficultyButtons_1.forEach(button => {
    button.addEventListener('click', () => {
        difficultyButtons_1.forEach(b => b.classList.remove('selected')); // Desmarcar otros botones
        button.classList.add('selected');
        dificultad_1 = parseInt(button.getAttribute('data-difficulty')); // Guardar selección
    });
});

// Captura de los botones de dificultad_2
const difficultyButtons_2 = document.querySelectorAll('.difficulty_2-btn');
difficultyButtons_2.forEach(button => {
    button.addEventListener('click', () => {
        difficultyButtons_2.forEach(b => b.classList.remove('selected')); // Desmarcar otros botones
        button.classList.add('selected');
        dificultad_2 = parseInt(button.getAttribute('data-difficulty')); // Guardar selección
    });
});

// Captura de los botones de tipo de juego
const gameModeButtons = document.querySelectorAll('.game-mode-btn');
gameModeButtons.forEach(button => {
    button.addEventListener('click', () => {
        gameModeButtons.forEach(b => b.classList.remove('selected')); // Desmarcar otros botones
        button.classList.add('selected');
        modoDeJuego = button.getAttribute('data-mode'); // Guardar selección
    });
});


// Lógica para el botón "Iniciar Juego"
document.getElementById('startGameBtn').addEventListener('click', () => {
    if (!modoDeJuego) {
        alert("Por favor, seleccione el Modo de Juego.");
    } else if (modoDeJuego !== "multiplayer") {
        if (dificultad_1 <= 1 || !lenguaje) {
            alert("Por favor, seleccione la Dificultad de la IA #1 y el lenguaje.");
        } else if (modoDeJuego === "iaVs" && dificultad_2 <= 1) {
            alert("Por favor, seleccione la Dificultad de la IA #2.");
        } else {
            cambiarPantalla();
        }
    } else {
        cambiarPantalla();
    }
});


// Función para ocultar la pantalla de configuración y mostrar la del Juego
const cambiarPantalla = () => {
    // Mostrar la pantalla del juego y ocultar la de configuración
    document.getElementById('configScreen').classList.remove('active');
    document.getElementById('gameScreen').classList.add('active');

    // Inicia el juego
    iniciarJuego();
}


// Botón para reiniciar el juego, sólo cuando una partida haya terminado
const restartButton = document.getElementById('restartButton');
restartButton.disabled = true;
restartButton.addEventListener('click', () => {
    iniciarJuego();
    restartButton.disabled = true;
});


// Importamos una función para generar juegos nuevos con un tablero nuevo y parámetros de inicio que no van a cambiar en ninguna partida
import { generarTablero, cantidadNumeros, cantidadX2 } from './beginning.js';
// Importamos la función para realizar una jugada con la IA con el estado actual, retorna la jugada que haría la IA
import { jugadaIA, jugadaIAconGolang } from './IA_s/IA.js';
// Importamos funciones de lógica que operan sobre el tablero
import { movimientosPieza, moverPieza } from './back.js';


// Una vez se ha configurado el juego, o se quiere reiniciar, ejecutamos esta función principal
const iniciarJuego = () => {
    // Parámetros que pueden cambiar según la partida que se juegue
    let multiplayer = false;
    let IAversus = false;

    // Generamos una nueva instancia, con un nuevo tablero con las posiciones de los elementos que tiene
    const nuevoJuego = generarTablero();
    const InicioTableroMatriz = nuevoJuego['nuevoTablero'], InicioPosicionCaballoJugador = nuevoJuego['nuevaPosCaballoJugador'], InicioPosicionCaballoCPU = nuevoJuego['nuevaPosCaballoCPU'];

    // Basado en las elecciones realizadas, establecemos el tipo de juego
    switch (modoDeJuego) {
        case "multiplayer":
            multiplayer = true;
            break;
        case "iaVs":
            IAversus = true;
            break;
        default:
            // Por defecto, será vsCPU
            break;
    }

    // Limpiamos el tablero, por si se había jugado una partida antes
    tablero.innerHTML = '';
    // Crea las 64 casillas del tablero
    for (var i = 0; i <= 77; i++) {

        // Si el número es divisible por 8, salta
        if (i % 10 === 8) {
            i += 2;
        }

        // Genera la ID de la casilla
        const i2 = i.toString().padStart(2, "0");
        var id = "c" + i2;

        // Crea la etiqueta
        var casilla = document.createElement("div");
        casilla.id = id;
        if (i%20 < 8 && i%2 == 0 || i%20 > 9 && i%2 == 1) {
            casilla.className = "casilla2";
        } else {
            casilla.className = "casilla1";
        }
        
        casilla.onclick = function() {
            // Envia el valor de la ID a la función
            casillaClickeada(this.id);
        };

        // Agrega la etiqueta al documento
        tablero.appendChild(casilla);
    }


    // Campos que se muestran en pantalla a parte del tablero
    const statusField = document.getElementById('statusField');
    const modeField = document.getElementById('modeField');
    const turnoB = document.getElementById('turnoB');
    const turnoN = document.getElementById('turnoN');
    const puntajeJugador = document.getElementById('puntajeN');
    const puntajeMaquina = document.getElementById('puntajeB');
    const cpuTieneMultiplicador = document.getElementById('cpuTieneMultiplicador');
    const jugadorTieneMultiplicador = document.getElementById('jugadorTieneMultiplicador');
    const movimientoField = document.getElementById('movimientoCell');
    const consiguioField = document.getElementById('consiguioCell');

    turnoN.classList.add('inactivo');


    // Al cargar el juego, colocamos qué modo de juego se eligió:
    let textoModoJuego = "";
    switch (modoDeJuego) {
        case "multiplayer":
            textoModoJuego = "Modo: Multijugador";
            break;
        case "iaVs":
            textoModoJuego = "Modo: IA.1 vs IA.2";
            break;
        default:
            textoModoJuego = "Modo: Jugador vs IA.1";
            break;
    }
    if (modoDeJuego !== "multiplayer") {
        // Añadimos la dificultad_1 elegida
        textoModoJuego += "<br>"
        switch (dificultad_1) {
            case 2:
                textoModoJuego += "Principiante";
                break;
            case 4:
                textoModoJuego += "Amateur";
                break;
            case 6:
                textoModoJuego += "Experto";
                break;
        }
        if (modoDeJuego === "iaVs") {
            // Añadimos la dificultad_2 elegida
            textoModoJuego += " vs "
            switch (dificultad_2) {
                case 2:
                    textoModoJuego += "Principiante";
                    break;
                case 4:
                    textoModoJuego += "Amateur";
                    break;
                case 6:
                    textoModoJuego += "Experto";
                    break;
            }
        }
        // Añadimos el lenguaje elegido
        textoModoJuego += "<br><br>"
        switch (lenguaje) {
            case "JS":
                textoModoJuego += "Usando JavaScript";
                break;
            case "GO":
                textoModoJuego += "Usando Golang";
                break;
        }
    }
    modeField.innerHTML = textoModoJuego;


    // Traemos las imagenes de los caballos
    const ImagenCaballo_b = "<img src='Imgs/Piezas/Caballo_b.png'>";
    const ImagenCaballo_n = "<img src='Imgs/Piezas/Caballo_n.png'>";
    const ImagenMultiplicador = "<img src='Imgs/Poderes/Multiplier.png'>";


    // Cada celda del tablero tendrá asociada una horseCell en otra matriz, en la cual se irán guardando las veces que cada caballo ha pasado por ahí
    const horsesCell = {
        caballoJugador: 0,
        caballoCPU: 0,
    }
    // Esto contendrá el estado del juego, para pasarse la información entre este archivo, el Back, y las IA's
    let estadoJuego = {
        tableroMatriz: InicioTableroMatriz,
        playerScore: 0,
        cpuScore: 0,
        playerMultiplier: false,
        cpuMultiplier: false,
        posicionCaballoJugador: InicioPosicionCaballoJugador,
        posicionCaballoCPU: InicioPosicionCaballoCPU,
        casillasIluminadas: [], // Casillas a las que se puede mover el caballo del turno actual
        turnoJugador: false,
        numerosRestantes: Array.from({ length: cantidadNumeros }, (_, i) => i + 1), // Array con los números que quedan en el tablero
        cantidadMultiplicadoresRestantes: cantidadX2,
        registroMovimientos: Array.from({ length: 8 }, () => Array(8).fill(horsesCell)), // Array que registrará las veces que ha pasado cada caballo por ella
    }


    // Variables adicionales
    let gameOver = false;
    let ultimaJugada = "No se han hecho jugadas";
    let ultimoConsiguio = "";
    let casillaAnterior = null;


    // Variables del estado original antes de un movimiento, así actualizar la tabla de registro
    let OriginalposicionCaballoJugador = estadoJuego['posicionCaballoJugador'];
    let posicionOriginalCaballoCPU = estadoJuego['posicionCaballoCPU'];
    let OriginalPlayerScore = 0;
    let OriginalCpuScore = 0;
    let OriginalCpuMultiplier = false;
    let OriginalPlayerMultiplier = false;


    // Front: Actualiza la información del tablero en pantalla
    const posicionarTablero = () => {
        let unaCasilla = null;
        for (let i = 0; i < estadoJuego['tableroMatriz'].length; i++) {
            for (let j = 0; j < estadoJuego['tableroMatriz'].length; j++) {
                const contenido = estadoJuego['tableroMatriz'][i][j]
                switch (true) {
                    case (contenido === 13):
                        unaCasilla = document.getElementById('c' + i + j);
                        unaCasilla.innerHTML = ImagenMultiplicador;
                        break;
                    case (contenido > 0 && contenido <= 10):
                        unaCasilla = document.getElementById('c' + i + j);
                        unaCasilla.innerHTML = "<img src='Imgs/Numeros/Number_" + contenido + ".png'>";
                        break;
                    default: //case (contenido === 0):
                        unaCasilla = document.getElementById('c' + i + j);
                        unaCasilla.innerHTML = '';
                }
            }
        }
        const filaN = estadoJuego['posicionCaballoJugador']['fila'], colN = estadoJuego['posicionCaballoJugador']['col'];
        const filaB = estadoJuego['posicionCaballoCPU']['fila'], colB = estadoJuego['posicionCaballoCPU']['col'];
        const casillaCN = document.getElementById('c' + filaN + colN);
        const casillaCB = document.getElementById('c' + filaB + colB);
        casillaCN.innerHTML = ImagenCaballo_n;
        casillaCB.innerHTML = ImagenCaballo_b;
        establecerCampos();
    }


    // Front: Actualiza la información de los campos en pantalla
    const establecerCampos = () => {
        puntajeMaquina.innerHTML = 'Puntaje: ' + estadoJuego['cpuScore'];
        puntajeJugador.innerHTML = 'Puntaje: ' + estadoJuego['playerScore'];

        // Actualiza la casilla que se ilumina si el caballo correspondiente tiene un multiplicador
        if (estadoJuego['playerMultiplier']) {
            jugadorTieneMultiplicador.classList.remove('inactivo');
        } else {
            jugadorTieneMultiplicador.classList.add('inactivo');
        }
        if (estadoJuego['cpuMultiplier']) {
            cpuTieneMultiplicador.classList.remove('inactivo');
        } else {
            cpuTieneMultiplicador.classList.add('inactivo');
        }

        // Si el juego no ha terminado, 
        if (!gameOver) {
            if (estadoJuego['turnoJugador']) {
                turnoN.classList.remove('inactivo');
                turnoB.classList.add('inactivo');
            } else {
                turnoN.classList.add('inactivo');
                turnoB.classList.remove('inactivo');
            }
        
            let mensaje = "En empate";
        
            if (estadoJuego['playerScore'] > estadoJuego['cpuScore']) {
                mensaje = "Ventaja: Caballo negro";
            } else if (estadoJuego['cpuScore'] > estadoJuego['playerScore']) {
                mensaje = "Ventaja: Caballo blanco";
            }
            statusField.innerHTML = mensaje;
        }
        // Actualiza la información de la tabla de registro en pantalla
        movimientoField.innerHTML = ultimaJugada;
        consiguioField.innerHTML = ultimoConsiguio;
    }


    // Cuando se de click en el tablero, se mira la casilla, su contenido y si es turno del que quiere realizar algo
    const casillaClickeada = (unaCasilla) => {
        if (!gameOver) {     
            const celdaMatriz = String(unaCasilla.slice(1));
            const casillaSeleccionada = {
                fila: Number(celdaMatriz[0]),
                col: Number(celdaMatriz[1])
            }

            let contenidoCelda = estadoJuego['tableroMatriz'][casillaSeleccionada["fila"]][casillaSeleccionada["col"]];
            let suTurno = true;
            if ([casillaSeleccionada["fila"]] == estadoJuego['posicionCaballoJugador']["fila"] && [casillaSeleccionada["col"]] == estadoJuego['posicionCaballoJugador']["col"]) {
                contenidoCelda = "caballo";
                suTurno = estadoJuego['turnoJugador'];
            } else if ([casillaSeleccionada["fila"]] == estadoJuego['posicionCaballoCPU']["fila"] && [casillaSeleccionada["col"]] == estadoJuego['posicionCaballoCPU']["col"]) {
                contenidoCelda = "caballo";
                suTurno = !estadoJuego['turnoJugador'];
            }

            mirarAccion(casillaSeleccionada, contenidoCelda, suTurno);
        }
    }


    // Revisa sobre qué celda se hizo click para ver si se realiza algo, validando si es su turno
    const mirarAccion = (casillaSeleccionada, contenidoCelda, suTurno) => {
        iluminacionCasillas(false);

        if (contenidoCelda != "caballo") {  // No se puede mover a una ubicación que tenga un caballo
            intentarJugada(casillaSeleccionada);
        } else if (suTurno && contenidoCelda == "caballo") { // Si es un caballo y es su turno, se generan los movimientos que puede hacer
            estadoJuego['casillasIluminadas'] = movimientosPieza(casillaSeleccionada, estadoJuego['posicionCaballoJugador'], estadoJuego['posicionCaballoCPU']);
            iluminacionCasillas(true);
        }

        if (!estadoJuego['turnoJugador'] && !multiplayer && !gameOver) { // Si es turno de la CPU, se realiza la jugada de la IA
            ejecutarJugadaIA(true);
        }
        
        posicionarTablero();
    }


    // Intentamos una jugada, puede que se mueva la pieza o no y actualizamos el estado del juego
    const intentarJugada = (unaJugada) => {
        const nuevoEstado = moverPieza(unaJugada, estadoJuego);
        estadoJuego = nuevoEstado;
        estadoJuego['casillasIluminadas'] = [];
        iluminarCasillaAnterior(false);
        huboMovimiento();
        iluminarCasillaAnterior(true);
        mirarSiAcabo();
        posicionarTablero();
    }


    // Si ya no quedan números en el tablero, se acaba el juego
    const mirarSiAcabo = () => {
        if (estadoJuego['numerosRestantes'].length < 1) {
            gameOver = true;
        }
        if (gameOver) {
            juegoTerminado();
        }
    }


    // Front: Aplicamos o quitamos el estilo "iluminado" a las casillas a las que se puede mover el caballo en pantalla
    const iluminacionCasillas = (iluminar) => {
        for (i = 0; i < estadoJuego['casillasIluminadas'].length; i++) {
            const ubicacionIluminada =  estadoJuego['casillasIluminadas'][i];
            const unaCasilla = document.getElementById('c' + ubicacionIluminada[0] + ubicacionIluminada[1]);

            if (iluminar) {
                if (unaCasilla.innerHTML != '') {
                    unaCasilla.classList.add('casillaComible');
                } else {
                    unaCasilla.classList.add('casillaIluminada');
                }
            } else {
                unaCasilla.classList.remove('casillaIluminada');
                unaCasilla.classList.remove('casillaComible');
            }
        }
    }


    // Front: Agrega un estilo a la casilla donde se posicionaba el último caballo que se movió
    const iluminarCasillaAnterior = (iluminar) => {
        if (casillaAnterior) {
            const fila = casillaAnterior['fila'], col = casillaAnterior['col'];
            const unaCasilla = document.getElementById('c' + fila + col);

            if (iluminar) {
                unaCasilla.classList.add('casillaAnterior');
            } else {
                unaCasilla.classList.remove('casillaAnterior');
            }
            
        }
    }


    // Front: si hubo un movimiento, se actualizan las variables para luego actualizar en pantalla
    const huboMovimiento = () => {
        const esTurnoJugador = estadoJuego['turnoJugador'];
        const caballoAnterior = esTurnoJugador ? posicionOriginalCaballoCPU : OriginalposicionCaballoJugador;
        const caballoActual = esTurnoJugador ? estadoJuego['posicionCaballoCPU'] : estadoJuego['posicionCaballoJugador'];
        const scoreActual = esTurnoJugador ? estadoJuego['cpuScore'] : estadoJuego['playerScore'];
        const originalScore = esTurnoJugador ? OriginalCpuScore : OriginalPlayerScore;
        const multiplierActual = esTurnoJugador ? estadoJuego['cpuMultiplier'] : estadoJuego['playerMultiplier'];
        const originalMultiplier = esTurnoJugador ? OriginalCpuMultiplier : OriginalPlayerMultiplier;
        const keys = Object.keys(caballoAnterior);

        // Verifica si hubo un cambio en la posición
        if (!keys.every(key => caballoAnterior[key] === caballoActual[key])) {
            ultimoConsiguio = scoreActual - originalScore;
            if (esTurnoJugador) {
                posicionOriginalCaballoCPU = caballoActual;
                ultimaJugada = `Caballo Blanco se movió desde [${caballoAnterior['fila']}, ${caballoAnterior['col']}]`;
                OriginalCpuScore = scoreActual;
                OriginalCpuMultiplier = multiplierActual;
            } else {
                OriginalposicionCaballoJugador = caballoActual;
                ultimaJugada = `Caballo Negro se movió desde [${caballoAnterior['fila']}, ${caballoAnterior['col']}]`;
                OriginalPlayerScore = scoreActual;
                OriginalPlayerMultiplier = multiplierActual;
            }
            if (!originalMultiplier && multiplierActual) ultimoConsiguio = "Multiplicador";
            casillaAnterior = caballoAnterior;
            return true;
        }
        return false;
    };


    // Front: cuando acabe el juego, se muestra el resultado y si hubo ganador
    const juegoTerminado = () => {
        turnoB.classList.add('inactivo');
        turnoN.classList.add('inactivo');
        let mensaje = "Fin: Empate";

        if (estadoJuego['playerScore'] > estadoJuego['cpuScore']) {
            mensaje = "El jugador ha ganado";
            const fila = estadoJuego['posicionCaballoJugador']['fila'], col = estadoJuego['posicionCaballoJugador']['col'];
            const casillaCaballo = document.getElementById('c' + fila + col);
            casillaCaballo.classList.add('casillaGanador');
        } else if (estadoJuego['cpuScore'] > estadoJuego['playerScore']) {
            mensaje = "El jugador ha perdido";
            const fila = estadoJuego['posicionCaballoCPU']['fila'], col = estadoJuego['posicionCaballoCPU']['col'];
            const casillaCaballo = document.getElementById('c' + fila + col);
            casillaCaballo.classList.add('casillaGanador');
        }

        statusField.innerHTML = mensaje;
        restartButton.disabled = false;
    }


    // Obtenemos la jugada de la IA (con el lenguaje seleccionado) y la ejecutamos
    const ejecutarJugadaIA = async (primeraIA) => {
        let movimientoIA = null;
        const dificultadIA = primeraIA ? dificultad_1 : dificultad_2;
        
        if (lenguaje == "JS") {
            movimientoIA = await jugadaIA(estadoJuego, dificultadIA, primeraIA);
        } else {
            movimientoIA = await jugadaIAconGolang(estadoJuego, dificultadIA, primeraIA);
        }
        
        if (primeraIA) {
            estadoJuego['casillasIluminadas'] = movimientosPieza(estadoJuego['posicionCaballoCPU'], estadoJuego['posicionCaballoJugador'], estadoJuego['posicionCaballoCPU']);
            intentarJugada(movimientoIA);
        } else {
            estadoJuego['casillasIluminadas'] = movimientosPieza(estadoJuego['posicionCaballoJugador'], estadoJuego['posicionCaballoJugador'], estadoJuego['posicionCaballoCPU']);
            intentarJugada(movimientoIA);
        }
    }


    // Se ejecuta al iniciar el juego, dependiendo del modo
    if (IAversus) { // Si es IA versus
        ejecutar();
    } else {
        if (!multiplayer) { // Si es Jugador vs IA
            ejecutarJugadaIA(true).then(() => {
                posicionarTablero();
            }).catch((error) => {
                console.error('Error ejecutando la jugada IA:', error);
            });
        }
    }
    posicionarTablero();    


    // Esto es para el modo IA versus:

    // Para hacer una pausa y se vean las jugadas que hacen las IA's
    async function espera(n) {
        return new Promise(resolve => setTimeout(resolve, n));
    }
    // Bucle para que las IA's compitan, hasta que se acabe el juego
    async function ejecutar() {
        while (!gameOver) {
            await espera(100); // espera 1 segundo | 1000 milésimas

            if (!gameOver) {
                
                ejecutarJugadaIA(!estadoJuego['turnoJugador']).then(() => {
                    posicionarTablero();
                }).catch((error) => {
                    console.error('Error ejecutando la jugada IA:', error);
                });
                
            }
        }
    }
}
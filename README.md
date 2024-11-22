# Smart Horses

Este repositorio es para el proyecto **Smart Horses**.

## Descripción

Es un juego entre dos adversarios en el que cada uno controla un caballo sobre un tablero de ajedrez. En el tablero hay diez casillas que le permiten obtener de **1 a 10** puntos al primer caballo que las alcance.

Además, hay cuatro casillas en las que se puede encontrar el símbolo **x2** que permite multiplicar por dos la cantidad de puntos de una casilla. Este símbolo aplica para una sola casilla con puntos y es la que alcance el caballo después de haber tomado dicho símbolo. **Los símbolos x2 no son acumulables**, es decir, no se puede tomar un símbolo x2 si el caballo ya tiene otro.

El juego termina cuando no queden más casillas con puntos.

## Modos de juego

El juego tiene varios modos dependiendo de lo que se quiera hacer.

### Multijugador

Para 2 jugadores, cada uno controla un caballo, el caballo blanco siempre inicia la partida.

### vs CPU

Es un modo en donde el jugador controla el caballo negro y una IA controlará el caballo blanco para jugar en contra, al empezar la partida la IA será la primera en jugar.

### IA Versus

El juego tiene 2 IA's las cuales compitieron para elegir cuál se usaría para el modo **vs CPU**, en este modo se puede ver como compiten para ganar.

## Dificultades

Las IA's usan el algoritmo **minimax** para conseguir la mejor jugada posible. La **profundidad** de dicho árbol será definida por la **dificultad** que se escoja. Entre mayor sea la dificultad mayor será la profundidad ya que le permite a minimax explorar jugadas más extensas y tener más ventaja.

Smart Horses presenta tres niveles de dificultad:

- **Principiante:** profundidad 2
- **Amateur:** profundidad 4
- **Experto:** profundidad 6

## Notas

- El juego siempre lo inicia la CPU que juega con el caballo blanco.
- Las posiciones iniciales de los caballos, de las diez casillas con puntos, y de las cuatro casillas donde están los símbolos x2, son aleatorias y nunca coinciden.

# Sobre el código

## Estructura

En proyecto tiene la siguiente estructura:

+ **IA_s**  				// Directorio con los archivos para ambas IA's
+ **Imgs**  				// Directorio con las imágenes del juego
+ **server-IA**  			// Directorio con los archivos para ambas IA's pero implementado en Golang
+ ***back.js***						// Archivo con funciones extra para los movimientos de los caballos
+ ***beginning.js***				// Archivo con funciones y parámetros para crear una nueva partida
+ ***index.html***				// Archivo HTML
+ ***script.js***						// Archivo principal, se maneja lo que se muestra en la página
+ ***styles.css***				// Archivo de estilos para la página

## Sobre las 2 IA's

Para tener 2 IA's diferentes, se tiene un sólo algoritmo minimax, pero 2 funciones de utilidad, que son las que se usan en cada nodo del árbol para que el algoritmo decida. Por esto, la estructura de la carpeta **IA.js** es así:

+ **IA_s**
    * ***IA.js***							// Archivo principal con el algoritmo minimax
    * ***utility_1.js***				// Archivo de utilidad para la IA #1
    * ***utility_2.js***				// Archivo de utilidad para la IA #2

De esta forma dependiendo de qué IA esté jugando, se usará la utilidad correspondiente.

## Sobre los lenguajes

El proyecto está hecho principalmente en **JavaScript**, pero ya que el algoritmo minimax llega a expandir muchos nodos, se llega a tardar uno o dos segundos en dar respuesta para cada jugada de una IA, es por ello que se implementa la lógica de las IA's en el lenguaje Golang, en la carpeta **server-IA**:

+ server-IA
    * ***go.mod***							// Modulo de Go
    * ***main.go***				// Archivo para levantar el servidor e intercambiar datos con JavaScript
    * *... Archivos con la lógica de las IA's implementada en Golang*

Se hizo un módulo de Go, de esta forma se puede distribuir el código en varios archivos, todos hacen parte del módulo por lo que todos conocen lo que los otros contienen.

En **main.go** levantamos un servidor y aquí se manejan las peticiones donde el Frontend en JavaScript enviará información del juego y Go lo procesará para dar una respuesta con la jugada de la IA que minimax retornó.

# Ejecutar el juego

## Usando Visual Studio Code

Si tienes VSC, puedes instalar la extensión **Live Server**, luego te posicionas en el directorio del proyecto, clic derecho sobre el archivo **index.html** y "Open with Live Server", esto abrirá la página del juego en tu navegador por defecto.

## Usando un Servidor con Python

Si tienes Python instalado, puedes hacer un servidor en donde correr el proyecto.
En una terminal, posicionarse dentro del directorio del proyecto y ejecuta el comando:

	python -m http.server 8000          // O elegir el puerto que desees

Luego, en un navegador entra en el enlace: http://localhost:8000/index.html

Eso te dirigirá a la página en donde está el proyecto funcionando correctamente.

> Hay varias formas de correr un proyecto como éste, sólo presentamos estas dos.

## Ejecutar con la versión de Golang

Ya vimos cómo ejecutar el proyecto, pero el funcionamiento de las IA's sólo está disponible en su versión con **JavaScript**, si se quiere más rapidez con las respuestas del algoritmo minimax podemos usar la versión implementada con **Golang**.

### Instalar Golang

Primero debemos tener Golang instalado, con este rápido paso a paso:

- [ ] Descarga Go en https://go.dev
- [ ] Instala Go
- [ ] En una terminal ejecuta `go version`, aparecerá la versión que instalaste

Una vez hecho esto podemos levantar el servidor.

### Levantar Servidor de Golang

Como se mencionó, necesitamos enviar datos entre JavaScript y Go, para esto haremos un servidor en donde se manejan las peticiones:

- [ ] En una terminal, posicionarse dentro de la carpeta ***server-IA***
- [ ] Ejecuta todos los archivos .go usando:
		`go run .\main.go .\back.go .\IA.go .\utility_1.go .\utility_2.go`

Quizá te pida permisos de administrador para levantar el servidor. Una vez se levante deberías ver un mensaje en terminal que diga *"Servidor corriendo en..."*

Una vez hecho esto, puedes jugar con la versión de las IA's en Golang, mientras el servidor esté corriendo.

> Hay que tener en cuenta que aunque se ejecute la versión de Golang, hay que tener levantada la parte de JavaScript a la vez, ya sea con los métodos mostrados como Live Server o un Servidor con Python.



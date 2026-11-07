# Misión rescatar la CUN: descripción del juego

## 1. ¿Qué es el juego?

"Misión rescatar la CUN" es un juego de consola en Python. Hay que responder preguntas de programación para abrir las puertas de un servidor infectado por un virus. Sirve para repasar lo básico de Python y está pensado con la metodología de Aprendizaje Basado en Juegos (ABJ), así que la idea es practicar mientras se juega.

**Versión web (principal):** abre `index.html` en el navegador (doble clic). No necesita instalar nada, pero sí internet la primera vez para cargar Pyodide y las fuentes.

**Versión de consola:** hace falta tener Python instalado. Abre una terminal en la carpeta del archivo y escribe `python servidor_CUN.py`.

Estructura de la carpeta:

- `index.html`: juego web completo (HTML, CSS, JS y la lógica en Python, todo en un solo archivo).
- `servidor_CUN.py`: versión de consola.
- `fuentes/`: copias del JavaScript y del Python que están dentro de `index.html`, solo para consultarlas.

## 2. Historia y rol del jugador

Es el año 2045. La Universidad de la CUN depende de un servidor central que maneja la luz, el agua y el tráfico. Un virus, **BUG MAYOR**, lo dañó y todo se está apagando.

Tú eres un **programador aprendiz**, la única persona que puede entrar al servidor. Tiene 5 salas, y cada una está cerrada con un código: si respondes bien, la puerta se abre. En la última sala te enfrentas al virus y, si ganas, restauras el servidor.

## 3. Mecánicas

- Empiezas con **3 vidas** y **0 puntos**.
- Hay **5 salas** con **3 preguntas** cada una, en total 15 preguntas.
- Cada pregunta muestra un fragmento de código en Python. Tienes que escribir qué imprimiría.
- Puedes escribir `pista` una vez por pregunta. Te ayuda, pero ganas menos puntos si aciertas.
- Si fallas, pierdes una vida. El juego te muestra la respuesta correcta y explica por qué.
- Si aciertas, sumas puntos y avanzas.
- Al terminar las 3 preguntas de una sala, la puerta se abre y pasas a la siguiente.

## 4. Puntaje

| Situación | Puntos |
|---|---|
| Respuesta correcta | +10 |
| Respuesta correcta usando la pista | +7 |
| Respuesta incorrecta | 0 y pierdes 1 vida |
| Sala completada sin perder vidas | +5 de bono |

- El puntaje máximo es **175** (5 salas × 30 puntos de preguntas + 5 de bono por sala).
- Al final, tu nivel depende de los puntos:
  - **Experto:** 150 o más.
  - **Intermedio:** de 100 a 149.
  - **Aprendiz:** menos de 100.

## 5. Victoria y derrota

- **Victoria:** superas las 5 salas y te queda al menos 1 vida.
- **Derrota:** te quedas sin vidas. El juego termina ahí, aunque falten salas.

Al final se muestran el resultado, los puntos y el nivel, y se pregunta si quieres jugar otra vez.

## 6. Conceptos de la asignatura

En cada sala no basta con recordar la teoría: hay que leer el código y predecir el resultado.

| Sala | Tema | Qué debes saber |
|---|---|---|
| 1 | Variables y tipos de datos | `int`, `float`, `str`, suma de números y repetición de texto |
| 2 | Operadores matemáticos | división entera `//`, residuo `%`, potencia `**` |
| 3 | Condicionales | `if`, `else`, `elif`, operador lógico `and` |
| 4 | Bucles | `for` con `range`, acumulador de suma, `while` |
| 5 | Listas y funciones | índices de una lista, `append`, `len`, `def` y `return` |

## 7. Cumplimiento de la meta de la actividad

| Requisito de la ACA | Cómo se cumple en el juego |
|---|---|
| Intención pedagógica | Cada pregunta evalúa un concepto del curso, y las salas siguen el orden en que se ven los temas. |
| Mecánicas claras | Pocas reglas: responder, usar la pista, perder vidas y avanzar. Se explican al inicio del juego y en el código. |
| Puntaje definido | Los puntos por acierto, pista y bono son fijos y están en constantes (`PUNTOS_ACIERTO`, `PUNTOS_ACIERTO_CON_PISTA`, `PUNTOS_BONO`). |
| Condiciones de victoria precisas | Se gana al superar las 5 salas con vidas disponibles. Se pierde al llegar a 0 vidas. |
| Reto que exige aplicar conceptos | Hay que interpretar código real de Python y calcular el resultado. Adivinar no sirve de mucho. |
| Narrativa | Rol (programador aprendiz), contexto (la CUN en 2045), enemigo (BUG MAYOR) y misión (restaurar el servidor). Cada sala tiene su escena. |
| Aprendizaje durante el juego | Al fallar, el juego muestra la respuesta y explica el motivo. La pista ayuda sin revelar la respuesta. Como se puede volver a jugar, el jugador repite y mejora. |

## 8. Sobre el código

El código está escrito para alguien que apenas empieza con Python. Solo usa variables, funciones, `if`, `while`, `input` y `print`. Cada sala es una función, y el flujo se puede leer de arriba hacia abajo.

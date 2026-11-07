# MISIÓN SERVIDOR CUN
# Juego de consola para repasar fundamentos de Python.
#
# REGLAS
# - Tienes 3 vidas al empezar.
# - Hay 5 salas y en cada sala hay 3 preguntas.
# - Si contestas bien, ganas 10 puntos.
# - Si contestas bien usando la pista, ganas 7 puntos.
# - Si contestas mal, pierdes 1 vida.
# - Si pasas una sala sin perder vidas, ganas 5 puntos de premio.
# - GANAS si pasas las 5 salas y te quedan vidas.
# - PIERDES si se te acaban las vidas.


# Variables del juego
vidas = 3
puntos = 0

PUNTOS_ACIERTO = 10
PUNTOS_ACIERTO_CON_PISTA = 7
PUNTOS_BONO = 5


def mostrar_introduccion():
    print("==================================================")
    print("              MISIÓN rescatar la CUN")
    print("==================================================")
    print("Año 2045. La Universidad de la CUN depende de un servidor")
    print("central que controla la luz, el agua y el tránsito.")
    print("Un virus llamado BUG MAYOR lo ha dañado.")
    print("")
    print("Eres un programador aprendiz y la única persona")
    print("que puede entrar al servidor.")
    print("Cada sala tiene una cerradura de código.")
    print("Si respondes bien, la puerta se abre.")
    print("Si fallas, pierdes una vida.")
    print("")
    print("Escribe 'pista' si necesitas ayuda.")
    print("==================================================")


def mostrar_estado():
    print("[ Vidas:", vidas, "| Puntos:", puntos, "]")


def hacer_pregunta(respuesta_correcta, pista, explicacion):
    # Esta función pide la respuesta y actualiza vidas y puntos
    global vidas
    global puntos

    uso_pista = False

    # Repite hasta que el jugador escriba una respuesta (no una pista)
    while True:
        respuesta = input("> ")
        respuesta = respuesta.strip().lower()

        if respuesta == "pista":
            if uso_pista == False:
                print("Pista:", pista)
                uso_pista = True
            else:
                print("Ya usaste la pista de esta pregunta.")
        elif respuesta == "":
            print("Escribe una respuesta.")
        else:
            break

    if respuesta == respuesta_correcta:
        if uso_pista == True:
            puntos = puntos + PUNTOS_ACIERTO_CON_PISTA
            print("¡Correcto! +7 puntos")
        else:
            puntos = puntos + PUNTOS_ACIERTO
            print("¡Correcto! +10 puntos")
    else:
        vidas = vidas - 1
        print("Incorrecto. Pierdes 1 vida.")
        print("La respuesta era:", respuesta_correcta)

    print(explicacion)
    mostrar_estado()


def jugar_sala_1():
    print("")
    print("==================================================")
    print("SALA 1: Variables y tipos de datos")
    print("==================================================")
    print("La puerta del servidor está cerrada.")
    print("El panel pide que demuestres que conoces")
    print("los tipos de datos.")

    vidas_al_entrar = vidas

    # Pregunta 1
    print("")
    print("¿Qué tipo de dato es el valor 3.14?")
    print("(escribe: int, float, str o bool)")
    hacer_pregunta(
        "float",
        "Tiene punto decimal.",
        "Los números con decimales son de tipo float."
    )
    if vidas == 0:
        return

    # Pregunta 2
    print("")
    print("x = 5")
    print("y = 2")
    print("print(x + y)")
    print("¿Qué imprime?")
    hacer_pregunta(
        "7",
        "Son dos números, se suman.",
        "Con números, el signo + suma: 5 + 2 = 7."
    )
    if vidas == 0:
        return

    # Pregunta 3
    print("")
    print('nombre = "Ana"')
    print("print(nombre * 2)")
    print("¿Qué imprime? (sin espacios)")
    hacer_pregunta(
        "anaana",
        "Multiplicar un texto lo repite.",
        'El texto "Ana" se repite dos veces: AnaAna.'
    )
    if vidas == 0:
        return

    terminar_sala(vidas_al_entrar)


def jugar_sala_2():
    print("")
    print("==================================================")
    print("SALA 2: Operadores matemáticos")
    print("==================================================")
    print("Un pasillo lleno de cables.")
    print("Para avanzar debes calcular las claves")
    print("con los operadores correctos.")

    vidas_al_entrar = vidas

    # Pregunta 1
    print("")
    print("print(10 // 3)")
    print("¿Qué imprime?")
    hacer_pregunta(
        "3",
        "// es la división entera (sin decimales).",
        "10 entre 3 es 3 y sobra 1. El // se queda con el 3."
    )
    if vidas == 0:
        return

    # Pregunta 2
    print("")
    print("print(10 % 3)")
    print("¿Qué imprime?")
    hacer_pregunta(
        "1",
        "% devuelve lo que sobra de la división.",
        "El % es el residuo: 10 entre 3 sobra 1."
    )
    if vidas == 0:
        return

    # Pregunta 3
    print("")
    print("print(2 ** 3)")
    print("¿Qué imprime?")
    hacer_pregunta(
        "8",
        "** es la potencia.",
        "2 ** 3 es 2 * 2 * 2 = 8."
    )
    if vidas == 0:
        return

    terminar_sala(vidas_al_entrar)


def jugar_sala_3():
    print("")
    print("==================================================")
    print("SALA 3: Condicionales")
    print("==================================================")
    print("El virus bloquea las puertas con decisiones lógicas.")
    print("Si lees bien el if, podrás pasar.")

    vidas_al_entrar = vidas

    # Pregunta 1
    print("")
    print("x = 7")
    print("if x > 5:")
    print('    print("A")')
    print("else:")
    print('    print("B")')
    print("¿Qué imprime? (A o B)")
    hacer_pregunta(
        "a",
        "¿Es 7 mayor que 5?",
        "7 > 5 es verdadero, por eso se ejecuta el if."
    )
    if vidas == 0:
        return

    # Pregunta 2
    print("")
    print("print(5 > 3 and 2 > 4)")
    print("¿Qué imprime? (True o False)")
    hacer_pregunta(
        "false",
        "El and necesita que las DOS condiciones sean verdaderas.",
        "5 > 3 es True, pero 2 > 4 es False. Con and el resultado es False."
    )
    if vidas == 0:
        return

    # Pregunta 3
    print("")
    print("nota = 70")
    print("if nota >= 90:")
    print('    print("A")')
    print("elif nota >= 60:")
    print('    print("B")')
    print("else:")
    print('    print("C")')
    print("¿Qué imprime? (A, B o C)")
    hacer_pregunta(
        "b",
        "Python revisa las condiciones de arriba hacia abajo.",
        "70 no es >= 90, pero sí es >= 60, por eso imprime B."
    )
    if vidas == 0:
        return

    terminar_sala(vidas_al_entrar)


def jugar_sala_4():
    print("")
    print("==================================================")
    print("SALA 4: Bucles")
    print("==================================================")
    print("Un robot de seguridad repite sus rondas sin parar.")
    print("Debes entender sus bucles para engañarlo.")

    vidas_al_entrar = vidas

    # Pregunta 1
    print("")
    print("for i in range(4):")
    print('    print("hola")')
    print('¿Cuántas veces se imprime "hola"?')
    hacer_pregunta(
        "4",
        "range(4) genera los números 0, 1, 2, 3.",
        "range(4) da cuatro valores, por eso el bucle da 4 vueltas."
    )
    if vidas == 0:
        return

    # Pregunta 2
    print("")
    print("suma = 0")
    print("for i in range(1, 4):")
    print("    suma = suma + i")
    print("print(suma)")
    print("¿Qué imprime?")
    hacer_pregunta(
        "6",
        "range(1, 4) genera los números 1, 2, 3.",
        "Se suma 1 + 2 + 3 = 6."
    )
    if vidas == 0:
        return

    # Pregunta 3
    print("")
    print("c = 0")
    print("while c < 3:")
    print("    c = c + 1")
    print("print(c)")
    print("¿Qué imprime?")
    hacer_pregunta(
        "3",
        "El while se detiene cuando c deja de ser menor que 3.",
        "c sube hasta 3. Entonces 3 < 3 es falso y el bucle termina."
    )
    if vidas == 0:
        return

    terminar_sala(vidas_al_entrar)


def jugar_sala_5():
    print("")
    print("==================================================")
    print("SALA 5: Listas y funciones")
    print("==================================================")
    print("¡La sala del núcleo!")
    print("El virus se esconde en el último código.")
    print("Responde bien y restaurarás el servidor.")

    vidas_al_entrar = vidas

    # Pregunta 1
    print("")
    print('frutas = ["pera", "uva", "kiwi"]')
    print("print(frutas[1])")
    print("¿Qué imprime?")
    hacer_pregunta(
        "uva",
        "Las posiciones de una lista empiezan en 0.",
        "La posición 0 es pera y la posición 1 es uva."
    )
    if vidas == 0:
        return

    # Pregunta 2
    print("")
    print("nums = [1, 2]")
    print("nums.append(3)")
    print("print(len(nums))")
    print("¿Qué imprime?")
    hacer_pregunta(
        "3",
        "append agrega un elemento al final de la lista.",
        "La lista queda [1, 2, 3] y len cuenta 3 elementos."
    )
    if vidas == 0:
        return

    # Pregunta 3
    print("")
    print("def doble(n):")
    print("    return n * 2")
    print("")
    print("print(doble(4))")
    print("¿Qué imprime?")
    hacer_pregunta(
        "8",
        "La función multiplica por 2 el valor que recibe.",
        "doble(4) devuelve 4 * 2 = 8."
    )
    if vidas == 0:
        return

    terminar_sala(vidas_al_entrar)


def terminar_sala(vidas_al_entrar):
    # Da el bono si no se perdieron vidas en la sala
    global puntos

    if vidas == vidas_al_entrar:
        puntos = puntos + PUNTOS_BONO
        print("")
        print("Sala perfecta: +5 puntos de bono.")

    print("")
    print("¡La puerta se abre!")


def calcular_nivel():
    if puntos >= 150:
        return "Experto"
    elif puntos >= 100:
        return "Intermedio"
    else:
        return "Aprendiz"


def mostrar_final(nombre):
    print("")
    print("==================================================")

    if vidas > 0:
        print("¡VICTORIA! Has eliminado a BUG MAYOR.")
        print("La CUN vuelve a tener luz, agua y tránsito.")
        print(nombre + ", la ciudad te lo agradece.")
    else:
        print("DERROTA. Te quedaste sin vidas.")
        print("BUG MAYOR sigue dentro del servidor...")
        print("Repasa los temas e inténtalo de nuevo.")

    print("")
    print("Puntos finales:", puntos)
    print("Nivel alcanzado:", calcular_nivel())
    print("==================================================")


def jugar_partida():
    global vidas
    global puntos

    # Reinicia los valores para cada partida nueva
    vidas = 3
    puntos = 0

    mostrar_introduccion()

    nombre = input("¿Cómo te llamas? ")
    nombre = nombre.strip()
    if nombre == "":
        nombre = "Programador"

    # Cada sala solo se juega si todavía quedan vidas
    jugar_sala_1()

    if vidas > 0:
        jugar_sala_2()

    if vidas > 0:
        jugar_sala_3()

    if vidas > 0:
        jugar_sala_4()

    if vidas > 0:
        jugar_sala_5()

    mostrar_final(nombre)


# Programa principal
while True:
    jugar_partida()

    print("")
    otra_vez = input("¿Quieres jugar de nuevo? (s/n): ")
    otra_vez = otra_vez.strip().lower()

    if otra_vez != "s":
        print("¡Gracias por jugar!")
        break

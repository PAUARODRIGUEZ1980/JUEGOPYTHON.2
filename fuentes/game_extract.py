# MISIÓN RESCATAR LA CUN - versión roguelike de salas
# Reglas (igual que el juego de consola):
# - 3 vidas al empezar, 5 salas, 3 preguntas (nodos) por sala.
# - Acierto: +10 puntos. Acierto con pista: +7. Fallo: -1 vida.
# - Sala sin fallar ninguna pregunta: +5 de bono.
# - Los corazones del mapa devuelven 1 vida (hasta un máximo de 3).
# - GANAS al pasar las 5 salas con vidas. PIERDES si llegas a 0 vidas.

import io
import json
import random
import sys
from contextlib import redirect_stdout

ANCHO = 15
ALTO = 11
VIDAS_INICIALES = 3
TOTAL_SALAS = 5
PREGUNTAS_POR_SALA = 3

PUNTOS_ACIERTO = 10
PUNTOS_ACIERTO_CON_PISTA = 7
PUNTOS_BONO = 5
PUNTOS_MAXIMOS = TOTAL_SALAS * (PREGUNTAS_POR_SALA * PUNTOS_ACIERTO + PUNTOS_BONO)

DIRECCIONES = ((1, 0), (-1, 0), (0, 1), (0, -1))

SALAS = [
    {
        "tema": "Variables y tipos de datos",
        "historia": [
            "La puerta del servidor está cerrada.",
            "El panel pide que demuestres que conoces los tipos de datos.",
        ],
        "preguntas": [
            {
                "codigo": "x = 3.14",
                "comprobar": "x = 3.14\nprint(type(x).__name__)",
                "enunciado": "¿Qué tipo de dato es x? (int, float, str o bool)",
                "pista": "Tiene punto decimal.",
                "explicacion": "Los números con decimales son de tipo float.",
            },
            {
                "codigo": "x = 5\ny = 2\nprint(x + y)",
                "enunciado": "¿Qué imprime?",
                "pista": "Son dos números, se suman.",
                "explicacion": "Con números, el signo + suma: 5 + 2 = 7.",
            },
            {
                "codigo": "nombre = \"Ana\"\nprint(nombre * 2)",
                "enunciado": "¿Qué imprime? (sin espacios)",
                "pista": "Multiplicar un texto lo repite.",
                "explicacion": "El texto \"Ana\" se repite dos veces: AnaAna.",
            },
        ],
    },
    {
        "tema": "Operadores matemáticos",
        "historia": [
            "Un pasillo lleno de cables.",
            "Para avanzar debes calcular las claves con los operadores correctos.",
        ],
        "preguntas": [
            {
                "codigo": "print(10 // 3)",
                "enunciado": "¿Qué imprime?",
                "pista": "// es la división entera (sin decimales).",
                "explicacion": "10 entre 3 es 3 y sobra 1. El // se queda con el 3.",
            },
            {
                "codigo": "print(10 % 3)",
                "enunciado": "¿Qué imprime?",
                "pista": "% devuelve lo que sobra de la división.",
                "explicacion": "El % es el residuo: 10 entre 3 sobra 1.",
            },
            {
                "codigo": "print(2 ** 3)",
                "enunciado": "¿Qué imprime?",
                "pista": "** es la potencia.",
                "explicacion": "2 ** 3 es 2 * 2 * 2 = 8.",
            },
        ],
    },
    {
        "tema": "Condicionales",
        "historia": [
            "El virus bloquea las puertas con decisiones lógicas.",
            "Si lees bien el if, podrás pasar.",
        ],
        "preguntas": [
            {
                "codigo": "x = 7\nif x > 5:\n    print(\"A\")\nelse:\n    print(\"B\")",
                "enunciado": "¿Qué imprime? (A o B)",
                "pista": "¿Es 7 mayor que 5?",
                "explicacion": "7 > 5 es verdadero, por eso se ejecuta el if.",
            },
            {
                "codigo": "print(5 > 3 and 2 > 4)",
                "enunciado": "¿Qué imprime? (True o False)",
                "pista": "El and necesita que las DOS condiciones sean verdaderas.",
                "explicacion": "5 > 3 es True, pero 2 > 4 es False. Con and el resultado es False.",
            },
            {
                "codigo": "nota = 70\nif nota >= 90:\n    print(\"A\")\nelif nota >= 60:\n    print(\"B\")\nelse:\n    print(\"C\")",
                "enunciado": "¿Qué imprime? (A, B o C)",
                "pista": "Python revisa las condiciones de arriba hacia abajo.",
                "explicacion": "70 no es >= 90, pero sí es >= 60, por eso imprime B.",
            },
        ],
    },
    {
        "tema": "Bucles",
        "historia": [
            "Un robot de seguridad repite sus rondas sin parar.",
            "Debes entender sus bucles para engañarlo.",
        ],
        "preguntas": [
            {
                "codigo": "for i in range(4):\n    print(\"hola\")",
                "modo": "lineas",
                "enunciado": "¿Cuántas veces se imprime \"hola\"?",
                "pista": "range(4) genera los números 0, 1, 2, 3.",
                "explicacion": "range(4) da cuatro valores, por eso el bucle da 4 vueltas.",
            },
            {
                "codigo": "suma = 0\nfor i in range(1, 4):\n    suma = suma + i\nprint(suma)",
                "enunciado": "¿Qué imprime?",
                "pista": "range(1, 4) genera los números 1, 2, 3.",
                "explicacion": "Se suma 1 + 2 + 3 = 6.",
            },
            {
                "codigo": "c = 0\nwhile c < 3:\n    c = c + 1\nprint(c)",
                "enunciado": "¿Qué imprime?",
                "pista": "El while se detiene cuando c deja de ser menor que 3.",
                "explicacion": "c sube hasta 3. Entonces 3 < 3 es falso y el bucle termina.",
            },
        ],
    },
    {
        "tema": "Listas y funciones",
        "historia": [
            "¡La sala del núcleo! BUG MAYOR custodia la salida.",
            "Responde bien y restaurarás el servidor.",
        ],
        "preguntas": [
            {
                "codigo": "frutas = [\"pera\", \"uva\", \"kiwi\"]\nprint(frutas[1])",
                "enunciado": "¿Qué imprime?",
                "pista": "Las posiciones de una lista empiezan en 0.",
                "explicacion": "La posición 0 es pera y la posición 1 es uva.",
            },
            {
                "codigo": "nums = [1, 2]\nnums.append(3)\nprint(len(nums))",
                "enunciado": "¿Qué imprime?",
                "pista": "append agrega un elemento al final de la lista.",
                "explicacion": "La lista queda [1, 2, 3] y len cuenta 3 elementos.",
            },
            {
                "codigo": "def doble(n):\n    return n * 2\n\nprint(doble(4))",
                "enunciado": "¿Qué imprime?",
                "pista": "La función multiplica por 2 el valor que recibe.",
                "explicacion": "doble(4) devuelve 4 * 2 = 8.",
            },
        ],
    },
]

# Estado de la partida (todo vive en este diccionario)
J = {
    "fase": "titulo",   # titulo, mapa, pregunta, resultado, fin
    "nombre": "Programador",
    "vidas": VIDAS_INICIALES,
    "puntos": 0,
    "sala": 0,
    "uid": 0,
    "mensajes": [],
    "aviso": "",
    "resultado": None,
    "fin": None,
    "eventos": [],      # cosas que pasaron en esta acción (golpes) para que JavaScript las anime
}


# ---------------------------------------------------------------- mensajes
def mensaje(tipo, texto):
    J["mensajes"].append([tipo, texto])
    del J["mensajes"][:-30]


# ---------------------------------------------------------------- partida
def nueva_partida(nombre):
    nombre = nombre.strip()
    if nombre == "":
        nombre = "Programador"
    J["nombre"] = nombre
    J["vidas"] = VIDAS_INICIALES
    J["puntos"] = 0
    J["mensajes"] = []
    J["resultado"] = None
    J["fin"] = None
    J["azar"] = random.Random()
    mensaje("sala", "Año 2045. BUG MAYOR dañó el servidor de la CUN.")
    mensaje("info", nombre + ", eres el único que puede entrar.")
    entrar_sala(1)


def entrar_sala(numero):
    J["sala"] = numero
    J["perdio_vida"] = False
    J["pistas"] = {}
    J["aviso"] = ""
    J["fase"] = "mapa"
    generar_sala(numero)
    datos = SALAS[numero - 1]
    mensaje("sala", f"SALA {numero}: {datos['tema']}")
    for linea in datos["historia"]:
        mensaje("info", linea)


# ---------------------------------------------------------------- mapa
def distancia(a, b):
    return abs(a[0] - b[0]) + abs(a[1] - b[1])


def crear_muros(numero, azar):
    muros = set()
    for x in range(ANCHO):
        muros.add((x, 0))
        muros.add((x, ALTO - 1))
    for y in range(ALTO):
        muros.add((0, y))
        muros.add((ANCHO - 1, y))
    # columnas y bloques al azar; hay más obstáculos en cada sala
    for _ in range(6 + numero * 2):
        x = azar.randint(3, ANCHO - 4)
        y = azar.randint(2, ALTO - 3)
        muros.add((x, y))
        if azar.random() < 0.5:
            muros.add((x + azar.choice([-1, 1]), y))
        else:
            muros.add((x, y + azar.choice([-1, 1])))
    return muros


def alcanzables(inicio, bloqueadas):
    visitadas = {inicio}
    pendientes = [inicio]
    while pendientes:
        x, y = pendientes.pop()
        for dx, dy in DIRECCIONES:
            vecina = (x + dx, y + dy)
            if vecina not in visitadas and vecina not in bloqueadas:
                visitadas.add(vecina)
                pendientes.append(vecina)
    return visitadas


def tiene_vecino(celda, conjunto):
    for dx, dy in DIRECCIONES:
        if (celda[0] + dx, celda[1] + dy) in conjunto:
            return True
    return False


def separados(celdas):
    for i in range(len(celdas)):
        for j in range(i + 1, len(celdas)):
            if distancia(celdas[i], celdas[j]) < 4:
                return False
    return True


def generar_sala(numero):
    azar = J["azar"]
    while True:
        muros = crear_muros(numero, azar)
        inicio = (1, azar.randint(2, ALTO - 3))
        fila_puerta = azar.randint(2, ALTO - 3)
        puerta = (ANCHO - 1, fila_puerta)
        frente = (ANCHO - 2, fila_puerta)
        muros.discard(inicio)
        muros.discard(frente)

        libres = []
        for x in range(3, ANCHO - 2):
            for y in range(1, ALTO - 1):
                if (x, y) not in muros:
                    libres.append((x, y))
        if len(libres) < 12:
            continue

        celdas = azar.sample(libres, PREGUNTAS_POR_SALA)
        if not separados(celdas):
            continue

        # La sala solo vale si se puede llegar a todos los nodos y a la puerta
        alcance = alcanzables(inicio, muros | set(celdas))
        if frente not in alcance:
            continue
        if not all(tiene_vecino(c, alcance) for c in celdas):
            continue
        break

    candidatas = []
    for c in libres:
        if c in alcance and c not in celdas and distancia(c, inicio) > 3:
            candidatas.append(c)
    cantidad = min(len(candidatas), 1 + (numero + 1) // 2)

    J["uid"] += 1
    J["muros"] = muros
    J["jugador"] = inicio
    J["direccion"] = 1
    J["puerta"] = puerta
    J["puerta_abierta"] = False
    J["terminales"] = [{"x": c[0], "y": c[1], "hecha": False, "acierto": False} for c in celdas]
    J["bugs"] = azar.sample(candidatas, cantidad)

    # Corazones para recuperar vidas: 1 por sala (2 en las salas 4 y 5)
    sitios = [c for c in candidatas if c not in J["bugs"]]
    cuantos = min(len(sitios), 1 + (1 if numero >= 4 else 0))
    J["corazones"] = azar.sample(sitios, cuantos)


def mover_bugs():
    azar = J["azar"]
    ocupadas = set(J["muros"])
    ocupadas.add(J["puerta"])
    ocupadas.add(J["jugador"])
    for t in J["terminales"]:
        ocupadas.add((t["x"], t["y"]))
    ocupadas.update(J["corazones"])
    ocupadas.update(J["bugs"])
    for i in range(len(J["bugs"])):
        if azar.random() < 0.6:
            x, y = J["bugs"][i]
            dx, dy = azar.choice(DIRECCIONES)
            nuevo = (x + dx, y + dy)
            if nuevo not in ocupadas:
                ocupadas.discard((x, y))
                ocupadas.add(nuevo)
                J["bugs"][i] = nuevo


def buscar_terminal(celda):
    for i in range(len(J["terminales"])):
        t = J["terminales"][i]
        if (t["x"], t["y"]) == celda:
            return i
    return None


def faltantes():
    n = 0
    for t in J["terminales"]:
        if not t["hecha"]:
            n += 1
    return n


def mover(dx, dy):
    if J["fase"] != "mapa":
        return
    x, y = J["jugador"]
    destino = (x + dx, y + dy)
    if dx != 0:
        J["direccion"] = dx

    if destino == J["puerta"]:
        usar_puerta()
        return
    if destino in J["muros"]:
        return
    indice = buscar_terminal(destino)
    if indice is not None:
        tocar_terminal(indice)
        return
    if destino in J["bugs"]:
        J["bugs"].remove(destino)
        J["eventos"].append({"tipo": "golpe", "x": destino[0], "y": destino[1], "dx": dx, "dy": dy})
        mensaje("info", "¡Aplastaste un bug! (no da puntos)")
    else:
        J["jugador"] = destino
        if destino in J["corazones"]:
            recoger_corazon(destino)
    mover_bugs()


def recoger_corazon(celda):
    # Solo se recoge si falta alguna vida; si no, el corazón se queda para después
    if J["vidas"] < VIDAS_INICIALES:
        J["corazones"].remove(celda)
        J["vidas"] += 1
        J["eventos"].append({"tipo": "vida", "x": celda[0], "y": celda[1]})
        mensaje("ok", f"¡Corazón! Recuperas 1 vida ({J['vidas']}/{VIDAS_INICIALES}).")
    else:
        mensaje("info", "Ya tienes todas las vidas. El corazón te espera para después.")


def usar_puerta():
    if J["puerta_abierta"]:
        if J["sala"] == TOTAL_SALAS:
            terminar_partida()
        else:
            entrar_sala(J["sala"] + 1)
    else:
        n = faltantes()
        mensaje("mal", f"Puerta bloqueada: faltan {n} nodo(s) por resolver.")


# ---------------------------------------------------------------- preguntas
def tocar_terminal(indice):
    if J["terminales"][indice]["hecha"]:
        mensaje("info", f"El nodo {indice + 1} ya está resuelto.")
        return
    J["fase"] = "pregunta"
    J["actual"] = indice
    J["aviso"] = ""
    mensaje("info", f"Te conectas al nodo {indice + 1}...")


def pregunta_actual():
    return SALAS[J["sala"] - 1]["preguntas"][J["actual"]]


def ejecutar_codigo(codigo):
    # Ejecuta de verdad el código de la pregunta y captura lo que imprime
    J["lineas_q"] = codigo.splitlines()
    salida = io.StringIO()
    with redirect_stdout(salida):
        exec(compile(codigo, "<pregunta>", "exec"), {})
    texto = salida.getvalue().strip()
    for linea in texto.splitlines()[:6]:
        anotar("q", "out", 0, linea)
    return texto


def calcular_respuesta(p):
    codigo = p.get("comprobar", p["codigo"])
    salida = ejecutar_codigo(codigo)
    if p.get("modo") == "lineas":
        return str(len(salida.splitlines()))
    return salida.lower()


def responder(texto):
    if J["fase"] != "pregunta":
        return
    respuesta = texto.strip().strip("\"'").lower()
    J["aviso"] = ""
    if respuesta == "pista":
        pedir_pista()
    elif respuesta == "":
        J["aviso"] = "Escribe una respuesta."
    else:
        evaluar(respuesta)


def pedir_pista():
    if J["fase"] != "pregunta":
        return
    if J["pistas"].get(J["actual"], False):
        J["aviso"] = "Ya usaste la pista de esta pregunta."
    else:
        J["pistas"][J["actual"]] = True
        J["aviso"] = ""


def evaluar(respuesta):
    p = pregunta_actual()
    indice = J["actual"]
    correcta = calcular_respuesta(p)
    uso_pista = J["pistas"].get(indice, False)
    terminal = J["terminales"][indice]
    terminal["hecha"] = True

    resultado = {
        "numero": indice + 1,
        "dada": respuesta,
        "esperada": correcta,
        "explicacion": p["explicacion"],
        "extra": [],
    }

    if respuesta == correcta:
        terminal["acierto"] = True
        if uso_pista:
            ganados = PUNTOS_ACIERTO_CON_PISTA
        else:
            ganados = PUNTOS_ACIERTO
        J["puntos"] += ganados
        resultado["correcto"] = True
        resultado["puntos"] = ganados
        mensaje("ok", f"Nodo {indice + 1} resuelto: +{ganados} puntos.")
    else:
        J["vidas"] -= 1
        J["perdio_vida"] = True
        resultado["correcto"] = False
        resultado["puntos"] = 0
        mensaje("mal", f"Nodo {indice + 1}: respuesta incorrecta. Pierdes 1 vida.")

    J["fase"] = "resultado"
    J["resultado"] = resultado
    if J["vidas"] > 0 and faltantes() == 0:
        completar_sala(resultado)


def completar_sala(resultado):
    # Da el bono si no se falló ninguna pregunta en la sala (aunque se recupere vida) y abre la puerta
    if not J["perdio_vida"]:
        J["puntos"] += PUNTOS_BONO
        resultado["extra"].append(f"Sala perfecta: +{PUNTOS_BONO} puntos de bono.")
        mensaje("ok", f"Sala perfecta: +{PUNTOS_BONO} puntos de bono.")
    J["puerta_abierta"] = True
    if J["sala"] == TOTAL_SALAS:
        resultado["extra"].append("¡BUG MAYOR se desploma! La salida está libre.")
        mensaje("sala", "¡BUG MAYOR cae! Cruza la puerta del núcleo.")
    else:
        resultado["extra"].append("¡La puerta se abre!")
        mensaje("sala", "¡La puerta se abre!")


def continuar():
    if J["fase"] != "resultado":
        return
    if J["vidas"] <= 0:
        terminar_partida()
    else:
        J["fase"] = "mapa"


def cerrar_pregunta():
    if J["fase"] == "pregunta":
        J["fase"] = "mapa"
        J["aviso"] = ""


# ---------------------------------------------------------------- final
def calcular_nivel():
    if J["puntos"] >= 150:
        return "Experto"
    elif J["puntos"] >= 100:
        return "Intermedio"
    else:
        return "Aprendiz"


def terminar_partida():
    J["fase"] = "fin"
    victoria = J["vidas"] > 0
    if victoria:
        lineas = [
            "¡VICTORIA! Has eliminado a BUG MAYOR.",
            "La CUN vuelve a tener luz, agua y tránsito.",
            J["nombre"] + ", la ciudad te lo agradece.",
        ]
    else:
        lineas = [
            "DERROTA. Te quedaste sin vidas.",
            "BUG MAYOR sigue dentro del servidor...",
            "Repasa los temas e inténtalo de nuevo.",
        ]
    J["fin"] = {
        "victoria": victoria,
        "lineas": lineas,
        "puntos": J["puntos"],
        "maximo": PUNTOS_MAXIMOS,
        "nivel": calcular_nivel(),
    }


# ---------------------------------------------------------------- estado hacia JavaScript
def estado():
    e = {
        "fase": J["fase"],
        "nombre": J["nombre"],
        "vidas": J["vidas"],
        "vidas_max": VIDAS_INICIALES,
        "puntos": J["puntos"],
        "maximo": PUNTOS_MAXIMOS,
        "sala": J["sala"],
        "total_salas": TOTAL_SALAS,
        "mensajes": J["mensajes"][-7:],
        "aviso": J["aviso"],
        "resultado": J["resultado"],
        "fin": J["fin"],
        "nivel": calcular_nivel(),
        "eventos": J["eventos"],
    }
    if J["sala"] > 0:
        e["tema"] = SALAS[J["sala"] - 1]["tema"]
        e["mapa"] = {"ancho": ANCHO, "alto": ALTO, "uid": J["uid"], "muros": sorted(J["muros"])}
        e["jugador"] = J["jugador"]
        e["direccion"] = J["direccion"]
        e["puerta"] = {"x": J["puerta"][0], "y": J["puerta"][1], "abierta": J["puerta_abierta"]}
        e["jefe"] = J["sala"] == TOTAL_SALAS and not J["puerta_abierta"]
        e["terminales"] = J["terminales"]
        e["bugs"] = J["bugs"]
        e["corazones"] = J["corazones"]
    if J["fase"] in ("pregunta", "resultado"):
        p = pregunta_actual()
        usada = J["pistas"].get(J["actual"], False)
        e["pregunta"] = {
            "numero": J["actual"] + 1,
            "total": PREGUNTAS_POR_SALA,
            "codigo": p["codigo"],
            "enunciado": p["enunciado"],
            "pista_usada": usada,
            "pista": p["pista"] if usada else "",
        }
    return e


# ---------------------------------------------------------------- traza (lo que ve el panel derecho)
TRAZA = []
LLAMADAS = {}
CONTADORES = {}
MAX_TRAZA = 280
MAX_LLAMADAS = 4
REPETIR = 4
SILENCIO = {"anotar", "tracer", "estado", "api", "mensaje", "distancia", "consultar",
            "descripcion_llamada", "tiene_vecino", "separados"}
LINEAS = SRC_JUEGO.splitlines()


def anotar(origen, tipo, numero, texto):
    if len(TRAZA) >= MAX_TRAZA:
        if TRAZA[-1][1] != "rep":
            TRAZA.append(["j", "rep", 0, "... traza recortada"])
        return
    if len(texto) > 110:
        texto = texto[:109] + "…"
    TRAZA.append([origen, tipo, numero, texto])


def descripcion_llamada(frame):
    c = frame.f_code
    valores = []
    for nombre in c.co_varnames[:c.co_argcount]:
        valor = repr(frame.f_locals.get(nombre))
        if len(valor) > 22:
            valor = valor[:21] + "…"
        valores.append(valor)
    return c.co_name + "(" + ", ".join(valores) + ")"


def tracer(frame, evento, arg):
    c = frame.f_code
    if c.co_filename == "<juego>":
        origen, fuente = "j", LINEAS
    elif c.co_filename == "<pregunta>":
        origen, fuente = "q", J["lineas_q"]
    else:
        return None
    nombre = c.co_name
    if nombre in SILENCIO:
        return None

    if evento == "call":
        veces = LLAMADAS.get(nombre, 0) + 1
        LLAMADAS[nombre] = veces
        if veces > MAX_LLAMADAS:
            return None
        CONTADORES[id(frame)] = {}
        if nombre != "<module>":
            anotar(origen, "call", c.co_firstlineno, descripcion_llamada(frame))
        return tracer

    if evento == "line":
        cont = CONTADORES.setdefault(id(frame), {})
        n = cont.get(frame.f_lineno, 0) + 1
        cont[frame.f_lineno] = n
        if n <= REPETIR and 0 < frame.f_lineno <= len(fuente):
            anotar(origen, "line", frame.f_lineno, fuente[frame.f_lineno - 1].rstrip())

    elif evento == "return":
        cont = CONTADORES.pop(id(frame), {})
        extra = 0
        for n in cont.values():
            if n > REPETIR:
                extra += n - REPETIR
        if extra > 0:
            anotar(origen, "rep", 0, f"... {extra} ejecuciones más de líneas repetidas")
        if arg is not None and nombre != "<module>":
            anotar(origen, "ret", frame.f_lineno, repr(arg))
    return tracer


def consultar():
    pass


ACCIONES = {
    "consultar": consultar,
    "nueva_partida": nueva_partida,
    "mover": mover,
    "responder": responder,
    "pista": pedir_pista,
    "continuar": continuar,
    "cerrar": cerrar_pregunta,
}


def api(accion, *args):
    # Punto de entrada desde JavaScript: ejecuta la acción con la traza activada
    del TRAZA[:]
    J["eventos"] = []
    LLAMADAS.clear()
    CONTADORES.clear()
    sys.settrace(tracer)
    try:
        ACCIONES[accion](*args)
    except Exception as error:
        TRAZA.append(["j", "err", 0, repr(error)])
    finally:
        sys.settrace(None)
    for nombre, veces in LLAMADAS.items():
        if veces > MAX_LLAMADAS:
            TRAZA.append(["j", "rep", 0, f"... {nombre}() se llamó {veces - MAX_LLAMADAS} veces más"])
    return json.dumps({"estado": estado(), "traza": TRAZA})

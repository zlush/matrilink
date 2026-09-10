#!/usr/bin/env python3
"""Gestiona los custom values de evento en GoHighLevel.

Mantiene un custom value por cada custom field de evento del contacto, que es
lo que la automatización copia al etiquetar al invitado, y los carga con los
datos de un evento —del JSON de respaldo o de una fila de la hoja de respuestas.

    python scripts/custom_values_ghl.py                      # dry-run del demo
    python scripts/custom_values_ghl.py --origen hoja.csv --evento mimi-2026
    python scripts/custom_values_ghl.py --send               # aplica los cambios
    python scripts/custom_values_ghl.py --crear-faltantes    # crea los que no existan
    python scripts/custom_values_ghl.py --renombrar          # agrupa con el prefijo
    python scripts/custom_values_ghl.py --self-test          # prueba sin tocar la red

El token va en la variable de entorno GHL_PIT (Settings → Private Integrations
en GHL). Nunca se escribe en el repositorio ni se imprime.

Ojo con dos trampas ya conocidas de esta API:
  · Cloudflare bloquea el user-agent de Python en este dominio, así que las
    llamadas salen por curl.
  · Los custom values son uno solo por sub-cuenta: cargar un evento pisa al
    anterior. Sirve con un evento activo a la vez.
"""

import argparse
import csv
import json
import os
import subprocess
import sys
import unicodedata

# La consola de Windows usa cp1252 y revienta con ✓ o ·. Un error de impresión
# no puede abortar un proceso de escritura a medio camino.
for flujo in (sys.stdout, sys.stderr):
    try:
        flujo.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):
        pass

LOCATION_ID = "kEZKnFdhkbuCT1BBR0pv"
API = "https://services.leadconnectorhq.com"
VERSION = "2021-07-28"
BASE_URL = "https://invitia-weld.vercel.app/eventos/"

# Columna de la hoja  ->  fieldKey del custom value en GHL
# El WhatsApp va a whatsapp_del_anfitrion: whatsapp_de_contacto es el custom
# value de marca, con el número de Invitia, y no se toca.
MAPA = [
    ("codigo_evento", "codigo_del_evento"),
    ("tipo_evento", "tipo_de_evento"),
    ("nombre_evento", "nombre_del_evento"),
    ("nombre_anfitriones", "nombre_del_anfitrion"),
    ("fecha_evento", "fecha_del_evento"),
    ("hora_evento", "hora_del_evento"),
    ("fecha_limite_confirmacion", "fecha_limite_de_confirmacion"),
    ("lugar_nombre", "lugar_del_evento"),
    ("direccion", "direccion_del_evento"),
    ("link_ubicacion", "link_de_ubicacion"),
    ("whatsapp_contacto", "whatsapp_del_anfitrion"),
]

MARCA = {
    "email_de_contacto", "horario_de_atencion", "instagram", "link_de_whatsapp",
    "link_de_politica_de_privacidad", "link_de_terminos_y_condiciones",
    "link_para_agendar_demo", "nombre_de_la_marca", "nombre_del_asesor",
    "sitio_web", "whatsapp_de_contacto",
}

DIAS = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]
MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
         "agosto", "septiembre", "octubre", "noviembre", "diciembre"]


def fecha_en_texto(iso):
    """2026-12-12 -> sábado 12 de diciembre de 2026 (igual que datos.js)."""
    import datetime
    try:
        f = datetime.date.fromisoformat(str(iso).strip())
    except ValueError:
        return ""
    return f"{DIAS[f.weekday()]} {f.day} de {MESES[f.month - 1]} de {f.year}"

# Mismos alias que invitia/eventos/datos.js: los títulos naturales del
# formulario no normalizan a la clave canónica ("Código del evento" da
# codigo_del_evento, no codigo_evento).
ALIAS = {
    "codigo_evento": ["codigo_del_evento", "codigo"],
    "tipo_evento": ["tipo_de_evento", "tipo"],
    "nombre_evento": ["nombre_del_evento"],
    "nombre_anfitriones": ["nombre_del_anfitrion", "nombre_de_los_anfitriones", "anfitriones"],
    "fecha_evento": ["fecha_del_evento", "fecha"],
    "hora_evento": ["hora_del_evento", "hora"],
    "fecha_limite_confirmacion": ["fecha_limite_de_confirmacion", "fecha_limite"],
    "lugar_nombre": ["lugar_del_evento", "nombre_del_lugar", "lugar"],
    "direccion": ["direccion_del_evento"],
    "link_ubicacion": ["link_de_ubicacion", "link_de_la_ubicacion"],
    "whatsapp_contacto": ["whatsapp_de_contacto", "whatsapp"],
}


def normalizar_clave(s):
    s = unicodedata.normalize("NFD", str(s or "").strip().lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    out = []
    for c in s:
        out.append(c if c.isalnum() else "_")
    return "_".join(x for x in "".join(out).split("_") if x)


def valor_de(fila, clave):
    if fila.get(clave, "").strip():
        return fila[clave].strip()
    for alt in ALIAS.get(clave, []):
        if fila.get(alt, "").strip():
            return fila[alt].strip()
    return ""


def valores_del_evento(fila, base_url=BASE_URL):
    """Fila del formulario -> {fieldKey del custom value: valor}."""
    valores = {}
    for columna, field_key in MAPA:
        valores[field_key] = valor_de(fila, columna)
    codigo = valor_de(fila, "codigo_evento")
    valores["link_de_la_invitacion"] = f"{base_url}?evento={codigo}" if codigo else ""
    valores["fecha_del_evento_en_texto"] = fecha_en_texto(valor_de(fila, "fecha_evento"))

    # Guarda dura: los custom values de marca son de la sub-cuenta, no del
    # evento. Escribir sobre ellos ya pisó una vez el WhatsApp de Invitia.
    invasores = sorted(set(valores) & MARCA)
    if invasores:
        raise SystemExit("El mapeo apunta a custom values de marca: " + ", ".join(invasores))
    return valores


def leer_fila(origen, codigo=""):
    if origen.endswith(".json"):
        crudo = json.loads(open(origen, encoding="utf-8").read())
        return {normalizar_clave(k): str(v) for k, v in crudo.items()}
    with open(origen, encoding="utf-8-sig", newline="") as f:
        filas = list(csv.reader(f))
    if not filas:
        raise SystemExit(f"{origen} está vacío")
    cabecera = [normalizar_clave(c) for c in filas[0]]
    objetos = [dict(zip(cabecera, fila)) for fila in filas[1:]]
    if not codigo:
        return objetos[-1]
    # La última, no la primera: Forms agrega una fila por envío y la corrección
    # más reciente queda más abajo en la hoja.
    coincidencias = [o for o in objetos
                     if valor_de(o, "codigo_evento").lower() == codigo.strip().lower()]
    if not coincidencias:
        raise SystemExit(f"No hay ninguna fila con código '{codigo}' en {origen}")
    if len(coincidencias) > 1:
        print(f"Aviso: {len(coincidencias)} respuestas con el código '{codigo}'; se usa la última.")
    return coincidencias[-1]


def curl(metodo, ruta, token, cuerpo=None):
    cmd = ["curl", "-s", "-X", metodo, f"{API}{ruta}",
           "-H", f"Authorization: Bearer {token}",
           "-H", f"Version: {VERSION}",
           "-H", "Accept: application/json"]
    entrada = None
    if cuerpo is not None:
        # El cuerpo va por stdin, no como argumento: en Windows los argumentos
        # de la línea de comandos se recodifican a cp1252 y las tildes llegan
        # rotas ("Código" queda como "CÃ³digo" del lado de GHL).
        cmd += ["-H", "Content-Type: application/json; charset=utf-8", "-d", "@-"]
        entrada = json.dumps(cuerpo, ensure_ascii=False).encode("utf-8")
    r = subprocess.run(cmd, input=entrada, capture_output=True)
    if r.returncode != 0:
        raise SystemExit(f"curl falló: {r.stderr.decode('utf-8', 'replace')[:300]}")
    salida = r.stdout.decode("utf-8", "replace")
    try:
        return json.loads(salida or "{}")
    except json.JSONDecodeError:
        raise SystemExit(f"Respuesta no JSON de {ruta}: {salida[:300]}")


def listar_custom_values(token):
    datos = curl("GET", f"/locations/{LOCATION_ID}/customValues", token)
    items = datos.get("customValues") or datos.get("customValue") or []
    if not items and "message" in datos:
        raise SystemExit(f"GHL respondió: {datos['message']}")
    porkey = {}
    for cv in items:
        fk = normalizar_clave((cv.get("fieldKey") or "").replace("custom_values.", "").strip("{} "))
        porkey[fk] = cv
    return porkey



# ---------------------------------------------------------------------------
# Custom values análogos a los custom fields del evento
#
# Los 13 campos que la automatización copia al contacto necesitan un custom
# value equivalente. Once ya existen; estos son los que faltan.
#
# Se crean con el nombre SIN tildes y se renombran después: GHL arma el
# fieldKey borrando las letras acentuadas ("Código" da cdigo), y la propia
# documentación confirma que renombrar no toca la clave.
#
# Las carpetas no se pueden asignar por API —POST /customValues solo acepta
# name y value—, así que el prefijo deja los valores juntos por orden
# alfabético y la carpeta se arma en Settings → Custom Values → Folders.
# ---------------------------------------------------------------------------

PREFIJO = "Evento · "

# (clave del custom value, nombre con el que se crea, nombre final, custom field
#  del contacto sobre el que la automatización lo imprime)
CANONICOS = [
    ("codigo_del_evento", "Codigo del evento", "Código del evento", "contact.codigo_del_evento"),
    ("tipo_de_evento", "Tipo de evento", "Tipo de evento", "contact.tipo_de_evento"),
    ("nombre_del_evento", "Nombre del evento", "Nombre del evento", "contact.nombre_del_evento"),
    ("nombre_del_anfitrion", "Nombre del anfitrion", "Nombre del anfitrión", "contact.nombre_del_anfitrion"),
    ("fecha_del_evento", "Fecha del evento", "Fecha del evento", "contact.fecha_del_evento"),
    ("fecha_del_evento_en_texto", "Fecha del evento en texto", "Fecha del evento en texto", "contact.fecha_del_evento_en_texto"),
    ("hora_del_evento", "Hora del evento", "Hora del evento", "contact.hora_del_evento"),
    ("lugar_del_evento", "Lugar del evento", "Lugar del evento", "contact.lugar_del_evento"),
    ("direccion_del_evento", "Direccion del evento", "Dirección del evento", "contact.direccion_del_evento"),
    ("link_de_ubicacion", "Link de ubicacion", "Link de ubicación", "contact.link_de_ubicacion"),
    ("link_de_la_invitacion", "Link de la invitacion", "Link de la invitación", "contact.link_de_la_invitacion"),
    ("fecha_limite_de_confirmacion", "Fecha limite de confirmacion", "Fecha límite de confirmación", "contact.fecha_limite_de_confirmacion"),
    # Se llama "del anfitrión" a propósito: whatsapp_de_contacto ya está tomado
    # por el custom value de marca, con el número de Invitia.
    ("whatsapp_del_anfitrion", "Whatsapp del anfitrion", "WhatsApp del anfitrión", "contact.whatsapp_de_contacto"),
]

# Sin token no se puede consultar la sub-cuenta: para planificar se asume el
# estado verificado el 2026-09-09, donde no existe ningún custom value de evento.
YA_EXISTIAN = set()


def faltantes(existentes):
    """Claves canónicas que no están en la sub-cuenta."""
    return [c for c in CANONICOS if c[0] not in existentes]


def crear_faltantes(token, prefijo, aplicar):
    existentes = listar_custom_values(token) if aplicar else {k: {} for k in YA_EXISTIAN}
    faltan = faltantes(existentes)

    print(f"Custom values de evento esperados: {len(CANONICOS)}")
    print(f"Ya existen: {len(CANONICOS) - len(faltan)}   ·   Faltan: {len(faltan)}")
    print()
    if not faltan:
        print("No hay nada que crear.")
    for clave, sin_tildes, bonito, campo in faltan:
        destino = prefijo + bonito
        print(f"  + {clave}")
        print(f"      crear como  '{sin_tildes}'   -> fieldKey {{{{ custom_values.{clave} }}}}")
        print(f"      renombrar a '{destino}'")
        print(f"      se imprime en  {campo}")
        if clave in MARCA:
            print("      ! choca con un custom value de marca, hay que renombrarlo")
        if not aplicar:
            continue
        r = curl("POST", f"/locations/{LOCATION_ID}/customValues", token,
                 {"name": sin_tildes, "value": ""})
        cv = r.get("customValue") or r
        cv_id = cv.get("id")
        if not cv_id:
            print(f"      ✗ no se pudo crear: {str(r)[:160]}")
            continue
        real = normalizar_clave((cv.get("fieldKey") or "").replace("custom_values.", "").strip("{} "))
        if real != clave:
            print(f"      ! GHL generó la clave '{real}' en vez de '{clave}'")
        r2 = curl("PUT", f"/locations/{LOCATION_ID}/customValues/{cv_id}", token,
                  {"name": destino, "value": ""})
        ok = "customValue" in r2 or "id" in r2
        print(f"      {'✓ creado y renombrado' if ok else '✗ creado, pero falló el renombrado'}")

    if aplicar:
        print()
        print("Falta un paso manual: crear la carpeta en Settings → Custom Values → Folders")
        print("y mover ahí los valores con Bulk Actions. La API no permite asignar carpeta.")


def renombrar_con_prefijo(token, prefijo, aplicar):
    """Antepone el prefijo a los custom values de evento que ya existen."""
    existentes = listar_custom_values(token)
    tocados = 0
    for clave, _, bonito, _campo in CANONICOS:
        cv = existentes.get(clave)
        if not cv:
            continue
        actual = cv.get("name", "")
        destino = prefijo + bonito
        if actual == destino:
            continue
        print(f"  {actual}  ->  {destino}")
        tocados += 1
        if aplicar:
            curl("PUT", f"/locations/{LOCATION_ID}/customValues/{cv['id']}", token,
                 {"name": destino, "value": cv.get("value", "")})
    print()
    print(f"{tocados} por renombrar. La clave no cambia al renombrar.")


def self_test():
    fila = {
        "codigo_del_evento": "mimi-2026",
        "tipo_de_evento": "matrimonio",
        "nombre_del_evento": "Matrimonio de Mimi",
        "nombre_del_anfitrion": "Mimi & Beto",
        "fecha_del_evento": "2026-12-12",
        "hora_del_evento": "17:30",
        "lugar_del_evento": "Viña Santa Elena",
        "direccion_del_evento": "Casablanca",
        "whatsapp_de_contacto": "+56 9 1234 5678",
    }
    v = valores_del_evento(fila, "https://ejemplo.cl/eventos/")
    assert v["tipo_de_evento"] == "matrimonio", v
    assert v["nombre_del_anfitrion"] == "Mimi & Beto", v
    assert v["link_de_la_invitacion"] == "https://ejemplo.cl/eventos/?evento=mimi-2026", v
    assert v["fecha_limite_de_confirmacion"] == "", v      # ausente = vacío, no falla
    assert v["whatsapp_del_anfitrion"] == "+56 9 1234 5678", v
    assert "whatsapp_de_contacto" not in v, "no se toca el custom value de marca"
    assert len(v) == 13, f"se esperaban 13 custom values, hay {len(v)}"
    assert normalizar_clave("Fecha límite de confirmación") == "fecha_limite_de_confirmacion"
    assert valores_del_evento({})["link_de_la_invitacion"] == ""
    assert len(CANONICOS) == 13, len(CANONICOS)
    assert len(faltantes(YA_EXISTIAN)) == 13, "hoy no existe ningún custom value de evento"
    assert not faltantes({c[0] for c in CANONICOS}), "con todos presentes no debe faltar ninguno"
    # El nombre con el que se crea no lleva tildes ni prefijo: es lo que deja
    # limpio el fieldKey, porque GHL borra las letras acentuadas.
    for clave, sin_tildes, _, campo in CANONICOS:
        assert normalizar_clave(sin_tildes) == clave, (sin_tildes, clave)
        assert campo.startswith("contact."), campo
    # Ninguno puede pisar un custom value de marca ya existente.
    choques = [c[0] for c in CANONICOS if c[0] in MARCA]
    assert not choques, f"colisión con custom values de marca: {choques}"
    v13 = valores_del_evento({"codigo_del_evento": "x", "fecha_del_evento": "2026-12-12"})
    assert len(v13) == 13, f"la carga debe cubrir los 13, cubre {len(v13)}"
    assert set(v13) == {c[0] for c in CANONICOS}, set(v13) ^ {c[0] for c in CANONICOS}
    assert not set(v13) & MARCA, "la carga nunca puede tocar un custom value de marca"
    assert v13["fecha_del_evento_en_texto"] == "sábado 12 de diciembre de 2026", v13["fecha_del_evento_en_texto"]
    assert fecha_en_texto("no es fecha") == ""
    print("self-test OK: 13 custom values de evento, ninguno choca con los de marca")
    print("             mapeo custom value -> custom field completo")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--origen", default="invitia/eventos/datos/demo.json",
                    help="JSON del evento o CSV de la hoja de respuestas")
    ap.add_argument("--evento", default="", help="código del evento, si el origen es un CSV con varias filas")
    ap.add_argument("--base-url", default=BASE_URL, help="URL de la plantilla publicada")
    ap.add_argument("--send", action="store_true", help="aplica los cambios (por defecto solo muestra)")
    ap.add_argument("--self-test", action="store_true", help="prueba el mapeo sin tocar la red")
    ap.add_argument("--crear-faltantes", action="store_true",
                    help="crea los custom values de evento que no existan")
    ap.add_argument("--renombrar", action="store_true",
                    help="antepone el prefijo a los custom values de evento ya creados")
    ap.add_argument("--prefijo", default=PREFIJO, help="prefijo de agrupación (por defecto 'Evento · ')")
    args = ap.parse_args()

    if args.self_test:
        return self_test()

    if args.crear_faltantes or args.renombrar:
        token = os.environ.get("GHL_PIT", "").strip()
        if args.send and not token:
            raise SystemExit("Falta el token: exporta GHL_PIT con el Private Integration Token.")
        if args.crear_faltantes:
            crear_faltantes(token, args.prefijo, args.send)
        if args.renombrar:
            if not token:
                raise SystemExit("--renombrar necesita GHL_PIT para leer los nombres actuales.")
            renombrar_con_prefijo(token, args.prefijo, args.send)
        if not args.send:
            print()
            print("Dry-run: no se creó ni renombró nada. Agrega --send para aplicar.")
        return

    fila = leer_fila(args.origen, args.evento)
    valores = valores_del_evento(fila, args.base_url)

    print(f"Origen: {args.origen}" + (f" (evento {args.evento})" if args.evento else ""))
    print(f"Sub-cuenta: {LOCATION_ID}\n")
    ancho = max(len(k) for k in valores)
    for k, v in valores.items():
        print(f"  {k:<{ancho}}  {v or '(vacío)'}")

    if not args.send:
        print("\nDry-run: no se escribió nada. Agrega --send para aplicar.")
        return

    token = os.environ.get("GHL_PIT", "").strip()
    if not token:
        raise SystemExit("\nFalta el token: exporta GHL_PIT con el Private Integration Token de GHL.")

    existentes = listar_custom_values(token)
    print(f"\nCustom values en la sub-cuenta: {len(existentes)}")
    escritos, faltantes = 0, []
    for field_key, valor in valores.items():
        cv = existentes.get(field_key)
        if not cv:
            faltantes.append(field_key)
            continue
        r = curl("PUT", f"/locations/{LOCATION_ID}/customValues/{cv['id']}", token,
                 {"name": cv.get("name", field_key), "value": valor})
        ok = "customValue" in r or "id" in r
        print(f"  {'✓' if ok else '✗'} {field_key} = {valor or '(vacío)'}"
              + ("" if ok else f"  -> {str(r)[:120]}"))
        escritos += 1 if ok else 0

    print(f"\nActualizados {escritos} de {len(valores)}.")
    if faltantes:
        print("No existen en la sub-cuenta (hay que crearlos primero): " + ", ".join(faltantes))


if __name__ == "__main__":
    main()

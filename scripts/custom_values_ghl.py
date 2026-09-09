#!/usr/bin/env python3
"""Actualiza los custom values de evento en GoHighLevel.

Toma los datos de un evento —del JSON de respaldo o de una fila de la hoja de
respuestas del formulario— y los escribe en los 11 custom values de la
sub-cuenta, incluyendo el link de la invitación publicada en Vercel.

    python scripts/custom_values_ghl.py                      # dry-run del demo
    python scripts/custom_values_ghl.py --origen hoja.csv --evento mimi-2026
    python scripts/custom_values_ghl.py --send               # aplica los cambios
    python scripts/custom_values_ghl.py --self-test          # prueba el mapeo

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

LOCATION_ID = "kEZKnFdhkbuCT1BBR0pv"
API = "https://services.leadconnectorhq.com"
VERSION = "2021-07-28"
BASE_URL = "https://invitia-weld.vercel.app/eventos/"

# Columna de la hoja  ->  fieldKey del custom value en GHL
MAPA = [
    ("tipo_evento", "tipo_de_evento"),
    ("nombre_evento", "nombre_del_evento"),
    ("nombre_anfitriones", "nombre_del_anfitrion"),
    ("fecha_evento", "fecha_del_evento"),
    ("hora_evento", "hora_del_evento"),
    ("fecha_limite_confirmacion", "fecha_limite_de_confirmacion"),
    ("lugar_nombre", "lugar_del_evento"),
    ("direccion", "direccion_del_evento"),
    ("link_ubicacion", "link_de_ubicacion"),
    ("whatsapp_contacto", "whatsapp_de_contacto"),
]

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
        return objetos[0]
    for o in objetos:
        if valor_de(o, "codigo_evento").lower() == codigo.strip().lower():
            return o
    raise SystemExit(f"No hay ninguna fila con código '{codigo}' en {origen}")


def curl(metodo, ruta, token, cuerpo=None):
    cmd = ["curl", "-s", "-X", metodo, f"{API}{ruta}",
           "-H", f"Authorization: Bearer {token}",
           "-H", f"Version: {VERSION}",
           "-H", "Accept: application/json"]
    if cuerpo is not None:
        cmd += ["-H", "Content-Type: application/json", "-d", json.dumps(cuerpo, ensure_ascii=False)]
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    if r.returncode != 0:
        raise SystemExit(f"curl falló: {r.stderr[:300]}")
    try:
        return json.loads(r.stdout or "{}")
    except json.JSONDecodeError:
        raise SystemExit(f"Respuesta no JSON de {ruta}: {r.stdout[:300]}")


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
    assert len(v) == 11, f"se esperaban 11 custom values, hay {len(v)}"
    assert normalizar_clave("Fecha límite de confirmación") == "fecha_limite_de_confirmacion"
    assert valores_del_evento({})["link_de_la_invitacion"] == ""
    print("self-test OK: 11 custom values, alias y tildes resueltos")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--origen", default="invitia/eventos/datos/demo.json",
                    help="JSON del evento o CSV de la hoja de respuestas")
    ap.add_argument("--evento", default="", help="código del evento, si el origen es un CSV con varias filas")
    ap.add_argument("--base-url", default=BASE_URL, help="URL de la plantilla publicada")
    ap.add_argument("--send", action="store_true", help="aplica los cambios (por defecto solo muestra)")
    ap.add_argument("--self-test", action="store_true", help="prueba el mapeo sin tocar la red")
    args = ap.parse_args()

    if args.self_test:
        return self_test()

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

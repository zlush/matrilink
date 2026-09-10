# Imprint del evento: de custom values a custom fields

## La idea

Los custom values son **uno solo por sub-cuenta**: sirven como *el evento que se
está cargando ahora*, no como el archivo de todos los eventos. Al etiquetar a un
invitado, un workflow copia esos valores a sus custom fields —donde quedan
congelados— y crea su oportunidad. Después puedes reescribir los custom values
con el evento siguiente sin afectar a nadie ya procesado.

```
Formulario  ->  Custom values del evento   (se reescriben en cada evento)
                        |
                  tag evento:<codigo>
                        |
                        v
                Custom fields del contacto  (quedan congelados por invitado)
                        +
                   Oportunidad en el pipeline
                        |
                        v
                Plantillas de WhatsApp  ({{contact.…}})
```

**El orden importa y no perdona.** Si cambias los custom values al evento
siguiente y quedaron invitados del anterior sin etiquetar, esos heredarán los
datos equivocados. La regla: cargar valores → etiquetar a todos → recién ahí
cargar el evento siguiente.

## Lo que hay hoy en la sub-cuenta

Verificado el 2026-09-09 en `kEZKnFdhkbuCT1BBR0pv`: los 11 custom values que
existen son **de marca**, en la carpeta *Invitia* — Nombre de la marca, Sitio
web, WhatsApp de contacto, Instagram, Horario de atención, y los links de
privacidad, términos, WhatsApp y agendamiento. **Ninguno es del evento.**

Esos no se tocan. Los 13 de abajo son nuevos.

## Los 13 custom values a crear

| Crear con este nombre | Renombrar a | Clave resultante | Se imprime en |
|---|---|---|---|
| Codigo del evento | Evento · Código del evento | `codigo_del_evento` | `contact.codigo_del_evento` |
| Tipo de evento | Evento · Tipo de evento | `tipo_de_evento` | `contact.tipo_de_evento` |
| Nombre del evento | Evento · Nombre del evento | `nombre_del_evento` | `contact.nombre_del_evento` |
| Nombre del anfitrion | Evento · Nombre del anfitrión | `nombre_del_anfitrion` | `contact.nombre_del_anfitrion` |
| Fecha del evento | Evento · Fecha del evento | `fecha_del_evento` | `contact.fecha_del_evento` |
| Fecha del evento en texto | Evento · Fecha del evento en texto | `fecha_del_evento_en_texto` | `contact.fecha_del_evento_en_texto` |
| Hora del evento | Evento · Hora del evento | `hora_del_evento` | `contact.hora_del_evento` |
| Lugar del evento | Evento · Lugar del evento | `lugar_del_evento` | `contact.lugar_del_evento` |
| Direccion del evento | Evento · Dirección del evento | `direccion_del_evento` | `contact.direccion_del_evento` |
| Link de ubicacion | Evento · Link de ubicación | `link_de_ubicacion` | `contact.link_de_ubicacion` |
| Link de la invitacion | Evento · Link de la invitación | `link_de_la_invitacion` | `contact.link_de_la_invitacion` |
| Fecha limite de confirmacion | Evento · Fecha límite de confirmación | `fecha_limite_de_confirmacion` | `contact.fecha_limite_de_confirmacion` |
| **Whatsapp del anfitrion** | Evento · WhatsApp del anfitrión | `whatsapp_del_anfitrion` | `contact.whatsapp_de_contacto` |

**El último es el único que cambia de nombre entre value y field**, y es a
propósito: `whatsapp_de_contacto` ya existe como custom value de marca con el
número de Invitia (+56 9 5994 7563). Si el del evento se llamara igual, uno
pisaría al otro. Como value se llama *del anfitrión*; como campo del contacto
sigue siendo `whatsapp_de_contacto`, así que las plantillas de WhatsApp no
cambian.

**Crear sin tildes y renombrar después.** GHL arma la clave borrando las letras
acentuadas —"Código" produce `cdigo`— y la documentación confirma que renombrar
no la modifica. Por eso la primera columna va sin tildes y sin el prefijo
`Evento · `: si lo pusieras al crear, la clave saldría `evento_codigo_del_evento`.

## La carpeta

`POST /customValues` acepta solo `name` y `value`, así que la carpeta **no se
puede asignar por API**. Se hace en la interfaz:

1. **Settings → Custom Values → Folders → Add New Custom Value Folder**, con un
   nombre como "Evento activo".
2. Vuelve a **All values**, marca los 13 con las casillas y usa
   **Bulk Actions → Move To Folder**.

Mientras tanto el prefijo `Evento · ` los deja juntos por orden alfabético, que
para leerlos rápido cumple casi lo mismo.

## El workflow del imprint

En **Automation → Workflows**:

- **Trigger:** Contact Tag Added, con el tag `evento:<codigo>` (o uno genérico
  tipo `cargar-evento` si prefieres no crear un tag por evento; el código igual
  viaja en `codigo_del_evento`).
- **Acción 1 — Update Contact Field**, una línea por campo, con el valor tomado
  del custom value: `{{ custom_values.codigo_del_evento }}`,
  `{{ custom_values.fecha_del_evento }}`, y así con los 13 de la tabla.
- **Acción 2 — Create/Update Opportunity**, en el pipeline del evento, etapa
  "Invitado". Un nombre útil es `{{ custom_values.nombre_del_evento }} ·
  {{ contact.first_name }}`, que deja el pipeline legible cuando hay varios
  eventos conviviendo.

Después, la etapa de la oportunidad sigue al `estado_de_confirmacion` —Invitado,
Confirmado, No asiste, Asistió— y el pipeline funciona como tablero del evento.

## Crearlos con el script

```bash
python scripts/custom_values_ghl.py --crear-faltantes            # muestra el plan
python scripts/custom_values_ghl.py --crear-faltantes --send     # los crea
```

Consulta primero qué existe, así que crear dos veces no duplica nada. Necesita
`GHL_PIT` en el entorno. Después, para cargar un evento:

```bash
python scripts/custom_values_ghl.py --origen hoja.csv --evento mimi-2026 --send
```

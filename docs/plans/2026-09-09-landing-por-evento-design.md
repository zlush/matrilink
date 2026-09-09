# Landing page por evento — Diseño

**Fecha:** 2026-09-09
**Estado:** propuesta, pendiente de aprobación
**Contexto previo:** [invitia/README.md](../../invitia/README.md), memoria del proyecto
(`invitia-modelo-multi-evento`, `ghl-invitia-location`, `ghl-mcp-no-escribe-custom-fields`)

---

## 1. Problema

Cada evento que entra a Invitia necesita una página propia: la invitación que el
anfitrión comparte con sus invitados. Hoy no existe ese proceso. Hace falta que:

1. El cliente entregue la información de su evento de forma ordenada, sin
   entrevistas ni cadenas de WhatsApp.
2. Esa información alimente el CRM (los 11 custom values de evento que ya
   existen en GoHighLevel).
3. La landing del evento se arme sola con esa misma información.
4. La primera landing —un matrimonio— quede lo bastante bien hecha como para
   servir de plantilla a todos los eventos siguientes, de cualquier tipo.

## 2. Decisión de arquitectura

**Elegida por el usuario el 2026-09-09: Google Sheet publicada.**

```
Google Form  ──►  Google Sheet  ──►  publicada como CSV
 (lo llena         (1 fila por          │
  el cliente)       evento)             ├──►  Landing:  /eventos/?evento=<codigo>
                                        │      lee su fila y se pinta sola
                                        │
                                        └──►  script sheet_a_ghl.py
                                               escribe los 11 custom values en GHL
```

Una sola aplicación desplegada sirve a todos los eventos. El cliente corrige sus
datos en el formulario y la página se actualiza sin que nadie toque código ni
haga un deploy.

**Alternativas descartadas.** Un `evento.json` por evento con deploy manual era
más simple y sin dependencias externas, pero obliga a un deploy por cada cambio
de dato. Leer GHL en vivo mantendría el CRM como fuente única, pero exige un
proxy serverless para no exponer el token y arrastra el problema de los custom
values (ver riesgo R1).

### Cómo se lee la Sheet

`https://docs.google.com/spreadsheets/d/<ID>/pub?gid=<GID>&single=true&output=csv`

El CSV publicado responde con `Access-Control-Allow-Origin: *`, así que se puede
pedir con `fetch` desde el navegador sin proxy. Se parsea con un lector de CSV
propio (comillas dobles, comas y saltos de línea dentro de celdas incluidos), no
con `split(",")`.

**Degradación:** si el `fetch` falla —Google caído, hoja despublicada, sin red—
la página cae a un JSON local de respaldo y muestra el evento de demostración en
lugar de una pantalla en blanco. El mismo mecanismo permite desarrollar y probar
sin depender de la red.

## 3. Modelo de datos

Una fila por evento. La columna `codigo_evento` es la clave (`mimi-2026`), la
misma que ya usa `contact.codigo_del_evento` en GHL y la etiqueta `evento:<codigo>`.

| Bloque | Columnas del formulario | Custom value en GHL |
|---|---|---|
| Identificación | `codigo_evento`, `tipo_evento`, `nombre_evento`, `nombre_anfitriones` | `tipo_de_evento`, `nombre_del_evento`, `nombre_del_anfitrion` |
| Cuándo | `fecha_evento`, `hora_evento`, `fecha_limite_confirmacion` | `fecha_del_evento`, `hora_del_evento`, `fecha_limite_de_confirmacion` |
| Dónde | `lugar_nombre`, `direccion`, `link_ubicacion`, `ceremonia_lugar`, `ceremonia_hora` | `lugar_del_evento`, `direccion_del_evento`, `link_de_ubicacion` |
| Contacto | `whatsapp_contacto`, `link_lista_invitados` | `whatsapp_de_contacto` |
| Contenido | `historia`, `programa`, `dress_code`, `regalos`, `alojamiento`, `fotos`, `faq`, `color_acento` | — |

`link_de_la_invitacion` no se pide: lo genera el proceso como
`https://<dominio>/eventos/?evento=<codigo_evento>` y se escribe de vuelta en GHL.

Las columnas de contenido son opcionales. **Una sección sin datos no se
renderiza**, y ese es el mecanismo que hace genérica la plantilla: un cumpleaños
simplemente deja vacías "historia" y "dress code", y su página no las muestra.

`programa` se escribe una actividad por línea con el formato `18:00 | Ceremonia`.
`fotos` acepta URLs, una por línea; si viene vacía se usan las fotos de stock
por defecto según `tipo_evento`.

## 4. La plantilla

Ubicación: `invitia/eventos/`, de modo que se despliega con el mismo
`vercel deploy --prod` que ya usa el sitio, y queda en `/eventos/`.

```
invitia/eventos/
  index.html          app + meta dinámicos
  styles.css          sistema visual de la invitación
  app.jsx             render de secciones desde el objeto EVENTO
  datos.js            lector de CSV + mapeo fila → EVENTO + respaldo local
  datos/demo.json     evento de demostración (respaldo)
  fotos/              stock por tipo de evento
```

### Secciones (todas condicionales salvo el hero)

1. **Hero** a pantalla completa: foto, nombres, fecha, cuenta regresiva viva y
   CTA de confirmación.
2. **Navegación sticky** que aparece al salir del hero.
3. **Nuestra historia** — línea de tiempo.
4. **Cuándo y dónde** — ceremonia y fiesta, mapa embebido y botón "cómo llegar".
5. **Programa del día** — línea de tiempo por horas.
6. **Confirmación** — botón a WhatsApp con mensaje prellenado y, para
   matrimonios, link a la lista de invitados.
7. **Dress code**, **Regalos**, **Alojamiento y traslados**.
8. **Galería**, **Preguntas frecuentes**, footer con contacto.

El mapa es un `<iframe>` de Google Maps con `output=embed`, que no necesita API
key ni facturación.

### Dirección visual

Deliberadamente distinta del sitio comercial de Invitia: aquella es una landing
de producto con gradiente coral→violeta; esta es una invitación. Editorial y
cálida — serif display para los títulos, sans neutra para el texto, paleta
crema/tinta con un acento que **viene del JSON** (`color_acento`), para que la
misma plantilla sirva a un matrimonio sobrio y a un cumpleaños de 40.

Animaciones: entrada escalonada en el hero, parallax suave de la foto, reveal al
hacer scroll con `IntersectionObserver`, cuenta regresiva viva, transiciones en
tarjetas. Todo bajo `@media (prefers-reduced-motion: reduce)`.

Se aplican las skills `ui-ux-pro-max` (paleta y tipografía), `soft-skill`
(espaciado, sombras, coreografía de movimiento) y `taste-skill` (arquitectura
CSS y aceleración por hardware).

## 5. Del formulario al CRM

`scripts/sheet_a_ghl.py` lee la fila del evento y escribe los 11 custom values
por API REST, con `--dry-run` por defecto y `--send` para aplicar. Usa `curl`
—no `urllib`— porque Cloudflare bloquea el user-agent de Python en ese dominio,
y no crea campos con tildes en el nombre por el problema del `fieldKey`; ambas
cosas están documentadas en la memoria del proyecto.

Copiar y pegar a mano desde la Sheet sigue siendo una salida válida para el
primer evento, mientras el script no exista.

## 6. Riesgos

**R1 — Los custom values se pisan entre eventos.** Son uno solo por sub-cuenta y
todos los eventos comparten la de Matrilink. El proceso funciona con un evento
activo a la vez. Con dos en paralelo hay que mover los datos del evento a custom
fields del contacto, que es la decisión ya registrada en memoria. **No bloquea
la landing**, porque la página lee de la Sheet, no de GHL.

**R2 — Dependencia de Google.** Si la hoja se despublica, la página cae al
respaldo local. Conviene monitorearlo antes de cada evento.

**R3 — Los datos del evento quedan públicos** en la Sheet publicada. No poner
ahí nada sensible: la lista de invitados va aparte, en su propio link.

## 7. Verificación

- Pruebas del lector de CSV y del mapeo fila → EVENTO, escritas antes del código
  (comillas, comas y saltos de línea dentro de celdas, columnas faltantes,
  secciones vacías, fechas).
- Render con Playwright: sin errores de consola, sin overflow horizontal,
  capturas en escritorio y móvil.
- Prueba del camino real contra la Sheet publicada **una vez que exista**; hasta
  entonces se verifica contra un CSV servido en local con el mismo formato.

## 8. Fuera de alcance

Editor visual de la invitación, dominio propio por evento, subida de fotos desde
el formulario (por ahora se pegan URLs), y la migración de custom values a
custom fields del contacto (R1).

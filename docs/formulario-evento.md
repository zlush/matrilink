# Formulario del evento — preguntas para Google Forms

Este es el formulario que llena el cliente. Cada respuesta alimenta dos cosas: la
landing de su evento y los custom values del CRM.

**Cómo montarlo:** crea un formulario nuevo en Google Forms, pega las preguntas
de abajo respetando el título exacto de cada una, y al terminar ve a
**Responses → Link to Sheets** para crear la hoja. Luego, en la hoja:
**File → Share → Publish to web → Comma-separated values (.csv)**. Esa URL es la
que va en `sheetUrl`, dentro de [invitia/eventos/index.html](../invitia/eventos/index.html).

Los títulos importan: la plantilla convierte cada título de columna a una clave
(minúsculas, sin tildes, con guiones bajos). "Código del evento" llega como
`codigo_evento`. Si cambias un título, cambia la clave.

---

## Bloque 1 · Identificación

| # | Pregunta (título exacto) | Tipo | Obligatoria | Ayuda para el cliente |
|---|---|---|---|---|
| 1 | Código del evento | Respuesta corta | Sí | Un identificador corto, en minúsculas y sin espacios. Ejemplo: `camila-diego-2026`. Es lo que va en el link de la invitación. |
| 2 | Tipo de evento | Selección múltiple | Sí | Matrimonio · Cumpleaños · Evento corporativo · Graduación · Baby shower · Quinceañero · Aniversario · Otro |
| 3 | Nombre del evento | Respuesta corta | Sí | Como quieres que aparezca en la pestaña del navegador. Ejemplo: "Matrimonio de Camila y Diego". |
| 4 | Nombre anfitriones | Respuesta corta | Sí | Los nombres que van grandes en la portada. Si son dos, sepáralos con `&`: "Camila & Diego". |

## Bloque 2 · Cuándo

| # | Pregunta | Tipo | Obligatoria | Ayuda |
|---|---|---|---|---|
| 5 | Fecha evento | Fecha | Sí | — |
| 6 | Hora evento | Hora | Sí | Hora de inicio, formato 24 h. |
| 7 | Fecha límite confirmación | Fecha | No | Hasta cuándo pueden confirmar los invitados. |

## Bloque 3 · Dónde

| # | Pregunta | Tipo | Obligatoria | Ayuda |
|---|---|---|---|---|
| 8 | Lugar nombre | Respuesta corta | Sí | Nombre del lugar. Ejemplo: "Viña Santa Elena". |
| 9 | Dirección | Respuesta corta | Sí | Dirección completa con comuna y región: es lo que busca el mapa. |
| 10 | Link ubicación | Respuesta corta | No | Link de Google Maps para el botón "Cómo llegar". Si lo dejas vacío se arma con la dirección. |
| 11 | Ceremonia lugar | Respuesta corta | No | Solo si la ceremonia es en un lugar distinto de la celebración. |
| 12 | Ceremonia hora | Respuesta corta | No | — |

## Bloque 4 · Contacto y confirmación

| # | Pregunta | Tipo | Obligatoria | Ayuda |
|---|---|---|---|---|
| 13 | WhatsApp contacto | Respuesta corta | Sí | Número al que escriben los invitados para confirmar, con código de país. |
| 14 | Link lista invitados | Respuesta corta | No | Link a la lista de invitados. Aparece como botón en la sección de confirmación. |

## Bloque 5 · Contenido de la invitación

Todo este bloque es opcional, y ahí está la gracia: **la sección que quede
vacía no se muestra en la página**. Un cumpleaños que no llena "historia" ni
"dress code" simplemente no las tiene.

| # | Pregunta | Tipo | Ayuda |
|---|---|---|---|
| 15 | Historia | Párrafo | El relato que va en "Cómo llegamos hasta aquí". Dos o tres frases bastan. |
| 16 | Programa | Párrafo | Una actividad por línea, con este formato: `17:30 \| Ceremonia`. La barra separa la hora de la actividad. |
| 17 | Dress code | Párrafo | — |
| 18 | Regalos | Párrafo | Si hay datos de transferencia, escríbelos aquí completos. |
| 19 | Alojamiento | Párrafo | Hoteles con convenio, buses, traslados. |
| 20 | Foto portada | Respuesta corta | URL de la foto grande de la portada. Si la dejas vacía se usa una foto de archivo según el tipo de evento. |
| 21 | Fotos | Párrafo | URLs de la galería, una por línea. La primera se usa además para ilustrar la historia. Mínimo 3 para que la galería aparezca. |
| 22 | FAQ | Párrafo | Una por línea, con este formato: `¿Puedo llevar niños? \| Sí, cuéntanos cuántos al confirmar`. |
| 23 | Color acento | Respuesta corta | Color en formato `#8C6A3F`. Tiñe botones, detalles y títulos. Si se deja vacío queda el dorado por defecto. |

---

## Correspondencia con GoHighLevel

Once respuestas alimentan directamente los custom values que ya existen en la
sub-cuenta (`kEZKnFdhkbuCT1BBR0pv`):

| Respuesta del formulario | Custom value en GHL |
|---|---|
| Tipo de evento | `{{ custom_values.tipo_de_evento }}` |
| Nombre del evento | `{{ custom_values.nombre_del_evento }}` |
| Nombre anfitriones | `{{ custom_values.nombre_del_anfitrion }}` |
| Fecha evento | `{{ custom_values.fecha_del_evento }}` |
| Hora evento | `{{ custom_values.hora_del_evento }}` |
| Fecha límite confirmación | `{{ custom_values.fecha_limite_de_confirmacion }}` |
| Lugar nombre | `{{ custom_values.lugar_del_evento }}` |
| Dirección | `{{ custom_values.direccion_del_evento }}` |
| Link ubicación | `{{ custom_values.link_de_ubicacion }}` |
| WhatsApp contacto | `{{ custom_values.whatsapp_de_contacto }}` |
| *(se genera solo)* | `{{ custom_values.link_de_la_invitacion }}` → `https://<dominio>/eventos/?evento=<codigo_evento>` |

Por ahora esto se copia y pega a mano desde la hoja a GHL. El script que lo
automatiza está pendiente (ver el documento de diseño).

> **Un evento a la vez.** Los custom values son uno solo por sub-cuenta y todos
> los eventos comparten la de Matrilink, así que cargar un evento nuevo pisa al
> anterior. La landing no se ve afectada —lee de la hoja, no de GHL— pero los
> mensajes de WhatsApp sí. Con dos eventos activos en paralelo hay que mover los
> datos del evento a custom fields del contacto.

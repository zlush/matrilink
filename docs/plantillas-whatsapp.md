# Plantillas de WhatsApp — Invitia

Todas usan **custom fields del contacto** (`{{contact.…}}`), nunca custom values.
Los custom values son uno solo por sub-cuenta y el segundo evento pisaría al
primero; sobre el contacto, en cambio, los datos quedan congelados en cada
invitado y las plantillas resuelven bien aunque haya varios eventos en paralelo.

El flujo que hace posible esto es el tuyo: al agregar la etiqueta
`evento:<codigo>`, la automatización copia los custom values al contacto y crea
la oportunidad. **Las plantillas se envían después de ese paso**, nunca antes,
o los campos llegan vacíos (ver la advertencia del final, que es la que más
envíos rompe).

---

## Campos que faltan crear

Los 13 campos de invitado ya existen. Los del evento, que son los que estas
plantillas necesitan para decir fecha, lugar y link, **todavía no**. Hay que
crearlos como custom fields de contacto:

| Nombre al crearlo (sin tildes) | fieldKey resultante | Tipo | Para qué |
|---|---|---|---|
| Codigo del evento | `contact.codigo_del_evento` | TEXT | Clave de unión y segmentación |
| Tipo de evento | `contact.tipo_de_evento` | TEXT | Ajustar el texto según matrimonio/cumpleaños |
| Nombre del evento | `contact.nombre_del_evento` | TEXT | Asunto y referencias |
| Nombre del anfitrion | `contact.nombre_del_anfitrion` | TEXT | "el matrimonio de Camila y Diego" |
| Fecha del evento | `contact.fecha_del_evento` | DATE | Disparar recordatorios relativos |
| Fecha del evento en texto | `contact.fecha_del_evento_en_texto` | TEXT | **Redactar** el mensaje |
| Hora del evento | `contact.hora_del_evento` | TEXT | — |
| Lugar del evento | `contact.lugar_del_evento` | TEXT | — |
| Direccion del evento | `contact.direccion_del_evento` | TEXT | — |
| Link de ubicacion | `contact.link_de_ubicacion` | TEXT | Cómo llegar |
| Link de la invitacion | `contact.link_de_la_invitacion` | TEXT | La landing del evento |
| Fecha limite de confirmacion | `contact.fecha_limite_de_confirmacion` | TEXT | Urgencia en el recordatorio |
| Whatsapp de contacto | `contact.whatsapp_de_contacto` | TEXT | A quién derivar dudas |

**Créalos sin tildes y renómbralos después.** GHL genera el `fieldKey`
*eliminando* las letras acentuadas en vez de transliterarlas: "Código del
evento" produce `contact.cdigo_del_evento`. Al renombrar, el fieldKey ya no
cambia.

**Cada uno necesita su custom value análogo**, que es lo que la automatización
imprime sobre el contacto. Ninguno existe todavía: los 11 custom values de la
sub-cuenta son de marca. El mapeo completo y cómo crearlos está en
[imprint-evento-ghl.md](imprint-evento-ghl.md).

**Fecha del evento va dos veces, y no es redundancia.** El campo DATE sirve para
que el workflow dispare "3 días antes", pero al imprimirlo en un mensaje sale en
formato crudo. El campo TEXT es el que se lee bien: "sábado 12 de diciembre".

---

## 1 · Invitación

**Nombre:** `invitia_invitacion` · **Categoría:** MARKETING · **Idioma:** es

**Body**
```
Hola {{contact.nombre_para_el_mensaje}}, tenemos algo que contarte.

{{contact.nombre_del_anfitrion}} te invita a {{contact.nombre_del_evento}}.

Cuándo: {{contact.fecha_del_evento_en_texto}}, a las {{contact.hora_del_evento}} horas.
Dónde: {{contact.lugar_del_evento}}.

Aquí están todos los detalles, el mapa y el programa del día: {{contact.link_de_la_invitacion}}

¿Nos acompañas?
```

**Botones (respuesta rápida):** `Confirmo asistencia` · `No podré asistir` · `Tengo una pregunta`

**Ejemplo**
> Hola Sofía, tenemos algo que contarte.
> Camila & Diego te invita a Matrimonio de Camila y Diego.
> Cuándo: sábado 12 de diciembre de 2026, a las 17:30 horas.
> Dónde: Viña Santa Elena.
> Aquí están todos los detalles, el mapa y el programa del día: https://invitia-weld.vercel.app/eventos/?evento=demo-matrimonio
> ¿Nos acompañas?

---

## 2 · Recordatorio a quienes no han confirmado

**Nombre:** `invitia_recordatorio_rsvp` · **Categoría:** MARKETING · **Idioma:** es

Se envía solo a los contactos cuyo `estado_de_confirmacion` sigue pendiente.

**Body**
```
Hola {{contact.nombre_para_el_mensaje}}, te escribimos por {{contact.nombre_del_evento}}.

Todavía no tenemos tu respuesta y necesitamos cerrar la lista antes del {{contact.fecha_limite_de_confirmacion}}.

Los detalles están en {{contact.link_de_la_invitacion}} y puedes confirmar con los botones de aquí abajo.
```

**Botones:** `Confirmo asistencia` · `No podré asistir` · `Tengo una pregunta`

---

## 3 · Confirmación recibida

**Nombre:** `invitia_confirmacion_recibida` · **Categoría:** UTILITY · **Idioma:** es

**Body**
```
Listo {{contact.nombre_para_el_mensaje}}, quedaste confirmado para {{contact.nombre_del_evento}}.

Te esperamos el {{contact.fecha_del_evento_en_texto}} a las {{contact.hora_del_evento}} horas en {{contact.lugar_del_evento}}.

Para elegir tu menú y contarnos si tienes alguna restricción alimentaria, responde con el botón de abajo.
```

**Botones:** `Elegir mi menú` · `Tengo una restricción` · `Todo listo, gracias`

---

## 4 · Acompañantes y cupos

**Nombre:** `invitia_acompanantes` · **Categoría:** UTILITY · **Idioma:** es

Solo a quienes tienen acompañante permitido y no han detallado con quién vienen.

**Body**
```
Una última cosa, {{contact.nombre_para_el_mensaje}}.

Para cerrar el número con el catering nos falta un dato: {{contact.que_falta_confirmar}}.

¿Nos lo confirmas por aquí? Con responder a este mensaje basta.
```

**Sin botones.** Es una pregunta abierta y la respuesta la procesa el asistente.

---

## 5 · Recordatorio, tres días antes

**Nombre:** `invitia_recordatorio_evento` · **Categoría:** UTILITY · **Idioma:** es

Disparado por `contact.fecha_del_evento` menos 3 días, solo a confirmados.

**Body**
```
Ya falta poco, {{contact.nombre_para_el_mensaje}}: se viene {{contact.nombre_del_evento}}.

Es el {{contact.fecha_del_evento_en_texto}} a las {{contact.hora_del_evento}} horas, en {{contact.lugar_del_evento}}. La dirección es {{contact.direccion_del_evento}}.

Cómo llegar: {{contact.link_de_ubicacion}}

Si necesitas algo antes del día, escríbenos por aquí mismo y te respondemos.
```

> Meta no acepta que el body empiece con una variable. Si dejas
> `{{contact.nombre_para_el_mensaje}}` al inicio, la plantilla se rechaza: parte
> con "Hola" o con cualquier palabra antes de la variable.

---

## 6 · El día del evento

**Nombre:** `invitia_dia_del_evento` · **Categoría:** UTILITY · **Idioma:** es

**Body**
```
Hoy es el día, {{contact.nombre_para_el_mensaje}}.

Te esperamos a las {{contact.hora_del_evento}} horas en {{contact.lugar_del_evento}}.
Tu mesa es la {{contact.mesa_asignada}}.

Cómo llegar: {{contact.link_de_ubicacion}}

Nos vemos allá.
```

**Cuidado con `mesa_asignada`:** si no está asignada, el envío falla. Manda esta
plantilla solo al segmento que ya tiene mesa, o crea una variante sin ese campo.

---

## 7 · Cambio de último minuto

**Nombre:** `invitia_aviso` · **Categoría:** UTILITY · **Idioma:** es

**Body**
```
Hola {{contact.nombre_para_el_mensaje}}, tenemos un aviso importante sobre {{contact.nombre_del_evento}}.

Esto es lo que cambió: {{contact.notas_del_invitado}}

Cualquier duda, respóndenos por aquí y te ayudamos.
```

Reutiliza `notas_del_invitado` como campo de mensaje libre: el workflow lo
escribe justo antes de enviar. Si prefieres no mezclarlo con las notas del
invitado, crea un campo `Mensaje del aviso` aparte.

---

## 8 · Después del evento: fotos y recuerdos

**Nombre:** `invitia_recuerdos` · **Categoría:** MARKETING · **Idioma:** es

**Body**
```
Gracias por acompañarnos, {{contact.nombre_para_el_mensaje}}.

Ahora viene la mejor parte: {{contact.nombre_del_anfitrion}} quiere juntar las fotos y videos de todos para armar el recuerdo de {{contact.nombre_del_evento}}.

Sube los tuyos aquí, toma menos de un minuto: {{contact.link_de_la_invitacion}}

Mientras más miradas, mejor queda.
```

**Botones:** `Subir mis fotos` · `Dejar un mensaje`

---

## Antes de enviarlas

**Un campo vacío rompe el envío.** Es el error más común y no es evidente: si
`{{contact.mesa_asignada}}` está en blanco, Meta rechaza el mensaje completo con
"parameter value is empty", no lo manda con un hueco. Antes de cada envío
masivo, filtra el segmento por "campo no está vacío" para todos los campos que
usa esa plantilla.

**Categoría.** Las invitaciones y el mensaje de recuerdos son MARKETING: exigen
opt-in previo y cuestan más. Las confirmaciones y recordatorios de un evento ya
confirmado califican como UTILITY, que es más barato y se aprueba más fácil. Si
Meta te reclasifica una plantilla, suele ser por incluir frases promocionales en
una UTILITY.

**La ventana de 24 horas.** Fuera de ella solo puedes iniciar conversación con
plantilla aprobada. Dentro —cuando el invitado respondió hace menos de un día—
puedes escribir libre, y ahí es donde funcionan el asistente y las preguntas
abiertas.

**Al registrar en Meta las variables van numeradas** (`{{1}}`, `{{2}}`) con un
valor de ejemplo cada una. GHL hace el puente con los custom fields al crear la
plantilla desde su interfaz; si la registras directamente en el Business
Manager, tendrás que mapearlas a mano.

**Sobre la oportunidad.** Si la automatización la crea al mismo tiempo, conviene
que la etapa siga al `estado_de_confirmacion` —Invitado, Confirmado, No asiste,
Asistió— porque así el pipeline sirve de tablero del evento sin construir nada
aparte. Los campos de oportunidad, eso sí, **no están disponibles en plantillas
de mensaje**: por eso los datos van en el contacto.

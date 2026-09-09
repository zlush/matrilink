# Invitia · plantilla de invitación

Una sola página que sirve a todos los eventos. El evento se elige por la URL y
los datos salen de la hoja de respuestas del formulario:

    /eventos/?evento=camila-diego-2026

Sin parámetro, o si la hoja no responde, muestra el evento de demostración de
`datos/demo.json`.

## Publicar un evento nuevo

1. El cliente llena el formulario ([las preguntas están aquí](../../docs/formulario-evento.md)).
2. Verifica que la fila quedó en la hoja y que `Código del evento` es único.
3. Comparte el link `…/eventos/?evento=<codigo>`.
4. Copia los datos a los custom values de GoHighLevel (uno a uno; el script que
   lo automatiza está pendiente).

No hace falta desplegar de nuevo por cada evento: la página lee la hoja en cada
carga. Solo se despliega cuando cambia la plantilla misma.

## Conectar la hoja

En [index.html](index.html), `window.INVITIA_CONFIG.sheetUrl` recibe la URL del
CSV publicado:

```js
window.INVITIA_CONFIG = {
  sheetUrl: "https://docs.google.com/spreadsheets/d/<ID>/pub?gid=<GID>&single=true&output=csv",
  respaldo: "datos/demo.json"
};
```

Se obtiene en la hoja de respuestas con **File → Share → Publish to web →
Comma-separated values (.csv)**. Mientras esté vacío, la plantilla funciona
igual con el respaldo local.

## Archivos

| Archivo | Qué hace |
|---|---|
| `index.html` | Carga fuentes, estilos y configuración. |
| `styles.css` | Sistema visual: crema y tinta, acento por evento, animaciones. |
| `datos.js` | Lee el CSV, arma el objeto del evento, fechas y enlaces. Corre en el navegador y en Node. |
| `app.js` | Pinta las secciones y activa cuenta regresiva, reveals y acordeón. |
| `datos/demo.json` | Evento de demostración y respaldo. |
| `tests/datos.test.js` | Pruebas de `datos.js`. |

## Pruebas

```bash
node --test invitia/eventos/tests/datos.test.js
```

Cubren el lector de CSV (comas, comillas y saltos de línea dentro de celdas),
el mapeo de la fila al evento, las secciones vacías, las fechas en español, la
cuenta regresiva y el escapado de lo que escribe el cliente.

## Decisiones que conviene conocer

**Sin React ni Babel, a diferencia del resto de Invitia.** El sitio comercial es
una landing de producto y carga React por CDN. Esto lo abren invitados desde el
celular, muchas veces con datos móviles: 1,5 MB de runtime para pintar una
invitación no se justifica. La lógica testeable vive en `datos.js` y `app.js`
solo arma HTML.

**Una sección sin datos no se renderiza.** Es lo que permite que la misma
plantilla sirva a un matrimonio con historia, dress code y programa, y a un
cumpleaños que solo tiene fecha, lugar y confirmación.

**Todo lo que escribe el cliente pasa por `escapeHtml` y las URLs por
`urlSegura`.** El contenido viene de un formulario, no del repositorio.

**El mapa es un iframe de Google Maps con `output=embed`**, sin API key ni
facturación. Tarda varios segundos más que el resto de la página en aparecer:
es normal, no es un error de carga.

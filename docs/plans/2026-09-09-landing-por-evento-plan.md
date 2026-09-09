# Landing por evento — Plan de implementación

**Objetivo:** Entregar la plantilla de invitación de matrimonio, lista para
consumir la Sheet, verificada con datos de demostración.
**Arquitectura:** Sitio estático sin build (React + Babel por CDN, igual que el
resto de Invitia). `datos.js` obtiene el evento —Sheet publicada o respaldo
local— y `app.jsx` renderiza solo las secciones que tienen datos.
**Stack:** HTML/CSS/JSX vanilla, Cormorant Garamond + Plus Jakarta Sans,
`IntersectionObserver` para las animaciones, `node --test` para las pruebas.

## Lote 1 — Núcleo de datos (TDD)

1. Escribir `invitia/eventos/tests/datos.test.js` con los casos: CSV con comas y
   saltos de línea dentro de comillas, CRLF, búsqueda de evento por código,
   mapeo fila → EVENTO, secciones vacías omitidas, `programa` con formato
   `HH:MM | actividad`, fecha larga en español, cuenta regresiva.
2. Correr `node --test` y confirmar que **fallan** por la razón correcta.
3. Implementar `invitia/eventos/datos.js` (UMD mínimo: `module.exports` en Node,
   `window.InvitiaDatos` en el navegador).
4. Correr `node --test` y confirmar que pasan.

## Lote 2 — Plantilla visual

5. `invitia/eventos/datos/demo.json` — matrimonio de demostración completo.
6. Verificar con `curl` que las fotos de stock devuelven 200 antes de usarlas.
7. `invitia/eventos/styles.css` — sistema visual: crema/tinta, acento por
   variable CSS, escala tipográfica, arquitectura de tarjeta anidada, grano
   sutil fijo, `prefers-reduced-motion`.
8. `invitia/eventos/index.html` + `app.jsx` — secciones condicionales, cuenta
   regresiva viva, mapa embebido, CTA de WhatsApp con mensaje prellenado.

## Lote 3 — Verificación y entrega

9. Servir en local y renderizar con Playwright: consola sin errores, sin scroll
   horizontal, capturas en 1440 y 390 px.
10. Probar el camino de la Sheet contra un CSV local del mismo formato.
11. `docs/formulario-evento.md` — las preguntas exactas para el Google Form y su
    correspondencia con los custom values de GHL.
12. `invitia/eventos/README.md` — cómo publicar un evento nuevo.

## Fuera de este plan

`scripts/sheet_a_ghl.py` y la prueba contra la Sheet real, que requieren que la
hoja exista (ver el documento de diseño, sección 8).

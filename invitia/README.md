# Invitia

Landing de Invitia: el mismo motor de MatriLink (invitaciones, confirmaciones y
recuerdos por WhatsApp) pero genérico para **todo tipo de eventos** —
matrimonios, cumpleanos, corporativos, graduaciones, baby showers, quinceaneros,
conferencias, aniversarios.

## Ejecutar

Sitio estatico con React + Babel por CDN, sin build:

    python -m http.server 8000

y abrir http://localhost:8000 (hace falta servirlo por HTTP: los .jsx se cargan
como scripts externos).

## Archivos

- `index.html` — meta, fuentes (Plus Jakarta Sans + Inter + JetBrains Mono), CDNs.
- `styles.css` — sistema visual completo (paleta tomada del logo).
- `components.jsx` — logo, botones, iconos, `EVENTS`, mockup de WhatsApp, dashboard.
- `sections.jsx` — todas las secciones de la landing.
- `app.jsx` — formulario, contacto, CTA final y composicion de la App.
- `assets/` — logo.png, logo-light.png (para fondos oscuros), mark.png (favicon).
- `screenshots/` — referencia visual del render actual.

## Pendientes antes de publicar

- `WEBHOOK_URL` en `app.jsx` apunta al workflow de MatriLink en GoHighLevel.
- `WHATSAPP_URL` en `app.jsx` usa un numero placeholder (+56 9 0000 0000).
- Email, Instagram y telefono del footer son placeholders.
- Las fotos del banner y del collage son de Unsplash (reemplazar por fotos propias).
- Las metricas del hero (+12.000 invitaciones, 94% de confirmacion) hay que validarlas.

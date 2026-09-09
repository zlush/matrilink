// ==========================================================
// Invitia · plantilla de invitación (render)
//
// Sin React ni Babel a propósito: esto lo abren invitados desde el celular,
// muchas veces con datos móviles. El resto de Invitia usa React por CDN porque
// es una landing de producto; aquí el costo de 1,5 MB de runtime no se paga.
// La lógica testeable vive en datos.js; este archivo solo pinta.
// ==========================================================
(function () {
  "use strict";

  const D = window.InvitiaDatos;
  const CFG = window.INVITIA_CONFIG || {};
  const app = document.getElementById("app");

  const esc = D.escapeHtml;
  const url = D.urlSegura;

  // Portada de respaldo cuando el evento no trae fotos propias.
  const PORTADA_POR_TIPO = {
    matrimonio: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80",
    cumpleanos: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=2000&q=80",
    corporativo: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=2000&q=80",
    graduacion: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=2000&q=80",
  };

  const EYEBROW_POR_TIPO = {
    matrimonio: "Nos casamos",
    cumpleanos: "Estás invitado",
    corporativo: "Te esperamos",
    graduacion: "Nos graduamos",
  };

  const ICO = {
    flecha: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    whatsapp: '<svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 2a8 8 0 00-7 11.8L2 18l4.4-1A8 8 0 1010 2z" stroke="currentColor" stroke-width="1.3"/><path d="M7 7.4c0-.3.2-.5.5-.5h.7c.2 0 .4.1.5.3l.5 1.2c0 .2 0 .4-.1.5l-.4.4c-.1.1-.1.3 0 .4.4.7 1 1.3 1.7 1.7.1.1.3.1.4 0l.4-.4c.1-.1.3-.2.5-.1l1.2.5c.2.1.3.3.3.5v.7c0 .3-.2.5-.5.5-2.9 0-6-3.1-6-6z" fill="currentColor"/></svg>',
    regalo: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2.5 7.5h11v5.5a1 1 0 01-1 1h-9a1 1 0 01-1-1V7.5z" stroke="currentColor" stroke-width="1.2"/><path d="M1.8 5h12.4v2.5H1.8V5zM8 5v9" stroke="currentColor" stroke-width="1.2"/><path d="M8 5S6.6 2 5.2 2.6 5.4 5 8 5zm0 0s1.4-3 2.8-2.4S10.6 5 8 5z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>',
    pin: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 14s5-4.2 5-8A5 5 0 003 6c0 3.8 5 8 5 8z" stroke="currentColor" stroke-width="1.2"/><circle cx="8" cy="6" r="1.8" stroke="currentColor" stroke-width="1.2"/></svg>',
    reloj: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.2"/><path d="M8 4.8V8l2.2 1.6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>',
    mas: '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 1.5v9M1.5 6h9" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  };

  function boton(href, texto, clase, icono) {
    const destino = url(href);
    if (!destino) return "";
    return `<a class="btn ${clase}" href="${esc(destino)}" target="_blank" rel="noopener noreferrer">
      <span>${esc(texto)}</span><span class="btn__ico">${icono || ICO.flecha}</span></a>`;
  }

  // ---------- secciones ----------

  function hero(e) {
    const portada = url(e.portada) || PORTADA_POR_TIPO[e.tipo] || PORTADA_POR_TIPO.matrimonio;
    const eyebrow = EYEBROW_POR_TIPO[e.tipo] || "Estás invitado";
    const partes = e.anfitriones.split(/\s*&\s*/);
    const nombres = partes.length === 2
      ? `${esc(partes[0])}<span class="y">&amp;</span>${esc(partes[1])}`
      : esc(e.anfitriones || e.nombre);

    const fecha = e.fecha.texto || esc(e.fecha.iso);
    const hora = e.fecha.hora ? ` · ${esc(e.fecha.hora)} h` : "";

    return `<section class="hero">
      <div class="hero__foto" style="background-image:url('${esc(portada)}')" role="img" aria-label="Foto del evento"></div>
      <div class="hero__velo"></div>
      <div class="hero__contenido">
        <span class="eyebrow entra d1">${esc(eyebrow)}</span>
        <h1 class="hero__nombres entra d2">${nombres}</h1>
        <div class="hero__datos entra d3">${esc(fecha)}${hora}</div>
        ${e.lugar.nombre ? `<div class="hero__lugar entra d3">${esc(e.lugar.nombre)}</div>` : ""}
        <div class="hero__acciones entra d4">
          ${boton(D.linkWhatsapp(e), "Confirmar asistencia", "btn--claro", ICO.whatsapp)}
          <a class="btn btn--fantasma" href="#detalles"><span>Ver los detalles</span><span class="btn__ico">${ICO.flecha}</span></a>
        </div>
      </div>
      <div class="hero__scroll entra d5" aria-hidden="true"></div>
    </section>`;
  }

  function cuentaRegresiva(e) {
    if (!e.fecha.iso) return "";
    return `<section class="seccion" id="detalles">
      <div class="wrap-angosto reveal">
        <div class="shell"><div class="core">
          <div class="cuenta" id="cuenta" role="timer" aria-live="off"></div>
        </div></div>
      </div>
    </section>`;
  }

  function historia(e) {
    if (!D.tieneSeccion(e, "historia")) return "";
    // La primera de la galería que no sea la portada, para no repetir la imagen
    // grande del hero cuando el evento no trae una portada dedicada.
    const portada = url(e.portada);
    const foto = e.fotos.map(url).filter(f => f && f !== portada)[0] || "";
    return `<section class="seccion seccion--crema" id="historia">
      <div class="wrap split">
        <div class="split__texto reveal">
          <span class="eyebrow">Nuestra historia</span>
          <h2 class="titulo">Cómo <em>llegamos</em> hasta aquí</h2>
          <p class="bajada">${esc(e.historia)}</p>
        </div>
        ${foto ? `<div class="split__foto reveal" style="background-image:url('${esc(foto)}')" role="img" aria-label="Los anfitriones"></div>` : ""}
      </div>
    </section>`;
  }

  function ubicacion(e) {
    if (!D.tieneSeccion(e, "ubicacion")) return "";
    const hayCeremonia = e.ceremonia.lugar || e.ceremonia.hora;
    return `<section class="seccion" id="donde">
      <div class="wrap">
        <div class="reveal" style="text-align:center">
          <span class="eyebrow">Cuándo y dónde</span>
          <h2 class="titulo">El <em>lugar</em></h2>
          <div class="filete filete--centro"></div>
        </div>
        <div class="lugares reveal">
          ${hayCeremonia ? `<div class="shell"><div class="core">
            <div class="lugar__rol">Ceremonia</div>
            <div class="lugar__nombre">${esc(e.ceremonia.lugar || e.lugar.nombre)}</div>
            <div class="lugar__detalle">${esc(e.ceremonia.hora ? e.ceremonia.hora + " h" : "")}</div>
          </div></div>` : ""}
          <div class="shell"><div class="core">
            <div class="lugar__rol">${hayCeremonia ? "Celebración" : "Lugar"}</div>
            <div class="lugar__nombre">${esc(e.lugar.nombre)}</div>
            <div class="lugar__detalle">${esc(e.lugar.direccion)}</div>
          </div></div>
        </div>
        <div class="shell mapa reveal">
          <iframe src="${esc(D.linkMapaEmbebido(e))}" title="Mapa del lugar del evento" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
        <div class="reveal" style="text-align:center;margin-top:1.75rem">
          ${boton(D.linkComoLlegar(e), "Cómo llegar", "btn--linea", ICO.pin)}
        </div>
      </div>
    </section>`;
  }

  function programa(e) {
    if (!D.tieneSeccion(e, "programa")) return "";
    const hitos = e.programa.map(h => `<div class="hito reveal">
        <span class="hito__punto" aria-hidden="true"></span>
        <span class="hito__hora">${esc(h.hora)}</span>
        <span class="hito__que">${esc(h.actividad)}</span>
      </div>`).join("");
    return `<section class="seccion seccion--crema" id="programa">
      <div class="wrap">
        <div class="reveal" style="text-align:center">
          <span class="eyebrow">Programa</span>
          <h2 class="titulo">Cómo será <em>el día</em></h2>
          <div class="filete filete--centro"></div>
        </div>
        <div class="programa">${hitos}</div>
      </div>
    </section>`;
  }

  function rsvp(e) {
    if (!D.tieneSeccion(e, "confirmacion")) return "";
    const limite = e.fecha.limiteConfirmacion
      ? `<div class="rsvp__limite">${ICO.reloj} Confirma antes del ${esc(D.formatearFechaLarga(e.fecha.limiteConfirmacion) || e.fecha.limiteConfirmacion)}</div>`
      : "";
    return `<section class="seccion" id="confirmar">
      <div class="wrap-angosto reveal">
        <div class="shell"><div class="core rsvp__caja">
          <span class="eyebrow">Confirmación</span>
          <h2 class="titulo">¿Nos <em>acompañas</em>?</h2>
          <p class="bajada" style="margin-inline:auto">Escríbenos por WhatsApp y confirma tu asistencia en dos toques. Si vienes con acompañante o tienes alguna restricción alimentaria, cuéntanos ahí mismo.</p>
          ${limite}
          <div class="rsvp__acciones">
            ${boton(D.linkWhatsapp(e), "Confirmar por WhatsApp", "btn--acento", ICO.whatsapp)}
          </div>
        </div></div>
      </div>
    </section>`;
  }

  function detalles(e) {
    // "Lista de novios" es como se llama en Chile al registro de regalos; en un
    // evento que no es matrimonio la etiqueta natural es "mesa de regalos".
    const etiquetaLista = e.tipo === "matrimonio" ? "Ver la lista de novios" : "Ver la mesa de regalos";
    const extra = {
      regalos: boton(e.listaNovios, etiquetaLista, "btn--linea", ICO.regalo),
    };
    const tarjetas = [
      ["dressCode", "Dress code"],
      ["regalos", "Regalos"],
      ["alojamiento", "Alojamiento y traslados"],
    ].filter(([k]) => D.tieneSeccion(e, k));
    if (!tarjetas.length) return "";
    return `<section class="seccion seccion--crema">
      <div class="wrap">
        <div class="reveal" style="text-align:center">
          <span class="eyebrow">Buenos datos</span>
          <h2 class="titulo">Lo que <em>conviene saber</em></h2>
          <div class="filete filete--centro"></div>
        </div>
        <div class="detalles">
          ${tarjetas.map(([k, titulo]) => `<div class="shell reveal"><div class="core">
            <div class="detalle__titulo">${esc(titulo)}</div>
            <div class="detalle__texto">${esc(e[k])}</div>
            ${extra[k] ? `<div class="detalle__accion">${extra[k]}</div>` : ""}
          </div></div>`).join("")}
        </div>
      </div>
    </section>`;
  }

  function galeria(e) {
    // La primera foto ya se usó de portada y la segunda en la historia.
    const fotos = e.fotos.map(url).filter(Boolean);
    if (fotos.length < 3) return "";
    return `<section class="seccion" id="galeria">
      <div class="wrap">
        <div class="reveal" style="text-align:center">
          <span class="eyebrow">Galería</span>
          <h2 class="titulo">Algunos <em>momentos</em></h2>
          <div class="filete filete--centro"></div>
        </div>
        <div class="galeria">
          ${fotos.map((f, i) => `<div class="galeria__item reveal" style="background-image:url('${esc(f)}')" role="img" aria-label="Fotografía ${i + 1}"></div>`).join("")}
        </div>
      </div>
    </section>`;
  }

  function faq(e) {
    if (!D.tieneSeccion(e, "faq")) return "";
    return `<section class="seccion seccion--crema" id="preguntas">
      <div class="wrap">
        <div class="reveal" style="text-align:center">
          <span class="eyebrow">Preguntas frecuentes</span>
          <h2 class="titulo">Lo que <em>siempre</em> nos preguntan</h2>
          <div class="filete filete--centro"></div>
        </div>
        <div class="faq reveal">
          ${e.faq.map((f, i) => `<div class="faq__item" data-faq="${i}">
            <button class="faq__q" aria-expanded="false" aria-controls="faq-r-${i}">
              <span>${esc(f.pregunta)}</span><span class="faq__signo">${ICO.mas}</span>
            </button>
            <div class="faq__a" id="faq-r-${i}"><div><p>${esc(f.respuesta)}</p></div></div>
          </div>`).join("")}
        </div>
      </div>
    </section>`;
  }

  function pie(e) {
    return `<footer class="pie">
      <div class="wrap">
        <div class="pie__nombres">${esc(e.anfitriones || e.nombre)}</div>
        <div class="pie__fecha">${esc(e.fecha.texto || e.fecha.iso)}</div>
        <div class="pie__marca">
          <span>Invitación creada con</span>
          <img src="../assets/logo-light.png" alt="Invitia" />
        </div>
      </div>
    </footer>`;
  }

  function isla(e) {
    const links = [
      ["#historia", "Historia", D.tieneSeccion(e, "historia")],
      ["#donde", "Dónde", D.tieneSeccion(e, "ubicacion")],
      ["#programa", "Programa", D.tieneSeccion(e, "programa")],
      ["#galeria", "Galería", e.fotos.length >= 3],
      ["#preguntas", "Preguntas", D.tieneSeccion(e, "faq")],
    ].filter(l => l[2]);
    return `<nav class="isla" id="isla" aria-label="Secciones de la invitación">
      <span class="isla__marca">${esc(e.anfitriones || e.nombre)}</span>
      <span class="isla__links">${links.map(([h, t]) => `<a href="${h}">${esc(t)}</a>`).join("")}</span>
      ${boton(D.linkWhatsapp(e), "Confirmar", "btn--acento", ICO.whatsapp)}
    </nav>`;
  }

  // ---------- comportamiento ----------

  function activarReveals() {
    const objetivos = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      objetivos.forEach(el => el.classList.add("reveal--visible"));
      return;
    }
    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada, i) => {
        if (!entrada.isIntersecting) return;
        const el = entrada.target;
        setTimeout(() => el.classList.add("reveal--visible"), i * 90);
        obs.unobserve(el);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
    objetivos.forEach(el => obs.observe(el));
  }

  // La isla aparece cuando el hero sale de pantalla. Con IntersectionObserver y
  // no con un listener de scroll, que dispara reflows en cada píxel.
  function activarIsla() {
    const hero = document.querySelector(".hero");
    const islaEl = document.getElementById("isla");
    if (!hero || !islaEl || !("IntersectionObserver" in window)) return;
    const obs = new IntersectionObserver(([entrada]) => {
      islaEl.classList.toggle("isla--visible", !entrada.isIntersecting);
    }, { threshold: 0, rootMargin: "-70% 0px 0px 0px" });
    obs.observe(hero);
  }

  function activarCuenta(e) {
    const caja = document.getElementById("cuenta");
    if (!caja) return;
    const etiquetas = [["dias", "Días"], ["horas", "Horas"], ["minutos", "Minutos"], ["segundos", "Segundos"]];
    const pintar = () => {
      const c = D.cuentaRegresiva(e.fecha.iso, e.fecha.hora);
      if (c.terminado) {
        caja.innerHTML = `<div class="cuenta__pasado" style="grid-column:1/-1">Gracias por acompañarnos</div>`;
        return true;
      }
      caja.innerHTML = etiquetas.map(([k, l]) => `<div class="cuenta__celda">
        <div class="cuenta__num">${String(c[k]).padStart(2, "0")}</div>
        <div class="cuenta__lbl">${l}</div>
      </div>`).join("");
      return false;
    };
    if (pintar()) return;
    const t = setInterval(() => { if (pintar()) clearInterval(t); }, 1000);
  }

  function activarFaq() {
    document.querySelectorAll(".faq__item").forEach(item => {
      const boton = item.querySelector(".faq__q");
      boton.addEventListener("click", () => {
        const abierto = item.classList.toggle("faq__item--abierto");
        boton.setAttribute("aria-expanded", abierto ? "true" : "false");
      });
    });
  }

  // ---------- arranque ----------

  function render(e) {
    document.documentElement.style.setProperty("--acento", e.acento);
    const titulo = e.nombre || (e.anfitriones ? `Invitación · ${e.anfitriones}` : "Invitación");
    document.title = titulo;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content",
        `${titulo}. ${e.fecha.texto}${e.lugar.nombre ? " · " + e.lugar.nombre : ""}. Confirma tu asistencia.`);
    }

    app.innerHTML = [
      isla(e), hero(e), cuentaRegresiva(e), historia(e), ubicacion(e),
      programa(e), rsvp(e), detalles(e), galeria(e), faq(e), pie(e),
    ].join("");

    activarReveals();
    activarIsla();
    activarCuenta(e);
    activarFaq();
  }

  function fallo(mensaje) {
    app.innerHTML = `<div class="fallo"><div>
      <h1>No encontramos esta invitación</h1>
      <p>${esc(mensaje)}</p>
    </div></div>`;
  }

  const codigo = new URLSearchParams(location.search).get("evento") || "";

  D.cargarEvento({ codigo: codigo, urlSheet: CFG.sheetUrl, urlRespaldo: CFG.respaldo })
    .then(({ evento, origen }) => {
      if (origen === "respaldo" && codigo) {
        console.warn(`[Invitia] "${codigo}" no se pudo leer de la hoja; se muestra el evento de respaldo.`);
      }
      render(evento);
    })
    .catch(err => {
      console.error("[Invitia]", err);
      fallo("Revisa el enlace que te compartieron o escríbenos para reenviártelo.");
    });
})();

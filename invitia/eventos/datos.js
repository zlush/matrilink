// ==========================================================
// Invitia · núcleo de datos de las invitaciones
// Corre igual en el navegador (window.InvitiaDatos) y en Node (require).
// ==========================================================
(function (raiz, fabrica) {
  const api = fabrica();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else raiz.InvitiaDatos = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const ACENTO_POR_DEFECTO = "#8C6A3F";

  const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
    "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

  // ---------- CSV ----------

  // Máquina de estados: un split(",") se rompe con comas, comillas y saltos de
  // línea dentro de las celdas, que es justo lo que trae una respuesta de
  // Google Forms (direcciones, programa en varias líneas).
  function parseCSV(texto) {
    const filas = [];
    let fila = [];
    let celda = "";
    let enComillas = false;
    const s = String(texto == null ? "" : texto).replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (enComillas) {
        if (c === '"') {
          if (s[i + 1] === '"') { celda += '"'; i++; }
          else enComillas = false;
        } else celda += c;
      } else if (c === '"') {
        enComillas = true;
      } else if (c === ",") {
        fila.push(celda); celda = "";
      } else if (c === "\n") {
        fila.push(celda); celda = "";
        filas.push(fila); fila = [];
      } else {
        celda += c;
      }
    }
    fila.push(celda);
    filas.push(fila);

    // Descarta la última línea si quedó vacía por el salto final del archivo.
    while (filas.length && filas[filas.length - 1].every(v => v === "")) filas.pop();
    return filas;
  }

  function normalizarClave(s) {
    return String(s || "")
      .trim()
      .toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  function aObjetos(matriz) {
    if (!matriz || !matriz.length) return [];
    const cabecera = matriz[0].map(normalizarClave);
    return matriz.slice(1).map(fila => {
      const o = {};
      cabecera.forEach((k, i) => { if (k) o[k] = (fila[i] || "").trim(); });
      return o;
    });
  }

  function buscarEvento(objetos, codigo) {
    const buscado = String(codigo || "").trim().toLowerCase();
    if (!buscado) return null;
    return (objetos || []).find(o =>
      valorDe(o, "codigo_evento").toLowerCase() === buscado) || null;
  }

  // ---------- contenido ----------

  function parseLineas(texto) {
    return String(texto || "")
      .split("\n")
      .map(l => l.trim())
      .filter(Boolean);
  }

  function parsePrograma(texto) {
    return parseLineas(texto).map(linea => {
      const i = linea.indexOf("|");
      if (i === -1) return { hora: "", actividad: linea };
      return { hora: linea.slice(0, i).trim(), actividad: linea.slice(i + 1).trim() };
    });
  }

  function parseFaq(texto) {
    return parseLineas(texto).map(linea => {
      const i = linea.indexOf("|");
      if (i === -1) return { pregunta: linea, respuesta: "" };
      return { pregunta: linea.slice(0, i).trim(), respuesta: linea.slice(i + 1).trim() };
    });
  }

  function soloDigitos(s) { return String(s || "").replace(/\D/g, ""); }

  // Todo lo que se inyecta en el DOM pasa por aquí: el contenido lo escribe el
  // cliente en un formulario, no nosotros.
  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Las URLs también las escribe el cliente en el formulario: solo se aceptan
  // esquemas navegables, nunca javascript: ni data:.
  function urlSegura(u) {
    const limpia = String(u == null ? "" : u).trim();
    return /^(https?:\/\/|mailto:)/i.test(limpia) ? limpia : "";
  }

  function normalizarTelefono(s) {
    const d = soloDigitos(s);
    return d ? "+" + d : "";
  }

  // ---------- evento ----------

  // La normalización de "Código del evento" da codigo_del_evento, no
  // codigo_evento. En vez de obligar a titular las preguntas de una única forma,
  // se aceptan las variantes naturales — que además coinciden con los nombres de
  // los custom values de GoHighLevel.
  const ALIAS = {
    codigo_evento: ["codigo_del_evento", "codigo"],
    tipo_evento: ["tipo_de_evento", "tipo"],
    nombre_evento: ["nombre_del_evento"],
    nombre_anfitriones: ["nombre_del_anfitrion", "nombre_de_los_anfitriones", "anfitriones", "nombre_anfitrion"],
    fecha_evento: ["fecha_del_evento", "fecha"],
    hora_evento: ["hora_del_evento", "hora"],
    fecha_limite_confirmacion: ["fecha_limite_de_confirmacion", "fecha_limite"],
    lugar_nombre: ["lugar_del_evento", "nombre_del_lugar", "lugar"],
    direccion: ["direccion_del_evento"],
    link_ubicacion: ["link_de_ubicacion", "link_de_la_ubicacion"],
    ceremonia_lugar: ["lugar_de_la_ceremonia"],
    ceremonia_hora: ["hora_de_la_ceremonia"],
    whatsapp_contacto: ["whatsapp_de_contacto", "whatsapp"],
    link_lista_novios: ["link_lista_de_novios", "link_de_la_lista_de_novios", "lista_de_novios", "lista_novios",
      "mesa_de_regalos", "link_mesa_de_regalos", "registro_de_regalos"],
    foto_portada: ["foto_de_portada", "portada"],
    color_acento: ["color_de_acento", "acento"],
    faq: ["preguntas_frecuentes", "preguntas"],
    dress_code: ["codigo_de_vestimenta", "vestimenta"],
    programa: ["programa_del_dia"],
    historia: ["nuestra_historia"],
    alojamiento: ["alojamiento_y_traslados", "traslados"],
  };

  // Devuelve el valor de la columna canónica o de cualquiera de sus alias.
  function valorDe(fila, clave) {
    const f = fila || {};
    if (f[clave] != null && String(f[clave]).trim()) return String(f[clave]).trim();
    for (const alt of (ALIAS[clave] || [])) {
      if (f[alt] != null && String(f[alt]).trim()) return String(f[alt]).trim();
    }
    return "";
  }

  function filaAEvento(fila) {
    const v = k => valorDe(fila, k);
    const fotos = parseLineas(v("fotos"));
    return {
      portada: v("foto_portada") || fotos[0] || "",
      codigo: v("codigo_evento"),
      tipo: v("tipo_evento") || "evento",
      nombre: v("nombre_evento"),
      anfitriones: v("nombre_anfitriones"),
      fecha: {
        iso: v("fecha_evento"),
        hora: v("hora_evento"),
        texto: formatearFechaLarga(v("fecha_evento")),
        limiteConfirmacion: v("fecha_limite_confirmacion"),
      },
      lugar: {
        nombre: v("lugar_nombre"),
        direccion: v("direccion"),
        link: v("link_ubicacion"),
      },
      ceremonia: {
        lugar: v("ceremonia_lugar"),
        hora: v("ceremonia_hora"),
      },
      contacto: {
        whatsapp: normalizarTelefono(v("whatsapp_contacto")),
      },
      // Registro de regalos ("lista de novios" en Chile). La lista de invitados
      // NO va aquí: es privada del anfitrión y esta página la ve cualquiera.
      listaNovios: v("link_lista_novios"),
      acento: v("color_acento") || ACENTO_POR_DEFECTO,
      historia: v("historia"),
      dressCode: v("dress_code"),
      regalos: v("regalos"),
      alojamiento: v("alojamiento"),
      programa: parsePrograma(v("programa")),
      fotos: fotos,
      faq: parseFaq(v("faq")),
    };
  }

  // Una sección sin datos no se renderiza: este es el mecanismo que hace que la
  // misma plantilla sirva a un matrimonio y a un cumpleaños.
  function tieneSeccion(evento, nombre) {
    if (!evento) return false;
    const valor = evento[nombre];
    if (Array.isArray(valor)) return valor.length > 0;
    if (nombre === "ubicacion") return Boolean(evento.lugar && (evento.lugar.nombre || evento.lugar.direccion));
    if (nombre === "confirmacion") return Boolean(evento.contacto && evento.contacto.whatsapp);
    if (nombre === "regalos") return Boolean((evento.regalos || "").trim() || evento.listaNovios);
    return Boolean(valor && String(valor).trim());
  }

  // ---------- fechas ----------

  function partesFecha(iso) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || "").trim());
    if (!m) return null;
    const y = +m[1], mes = +m[2], d = +m[3];
    if (mes < 1 || mes > 12 || d < 1 || d > 31) return null;
    return { y, mes, d };
  }

  // Se construye la fecha en horario local a propósito: new Date("2026-01-01")
  // es medianoche UTC y en Chile mostraría el 31 de diciembre.
  function fechaLocal(iso, hora) {
    const p = partesFecha(iso);
    if (!p) return null;
    const hm = /^(\d{1,2}):(\d{2})/.exec(String(hora || "").trim());
    return new Date(p.y, p.mes - 1, p.d, hm ? +hm[1] : 0, hm ? +hm[2] : 0, 0, 0);
  }

  function formatearFechaLarga(iso) {
    const fecha = fechaLocal(iso);
    if (!fecha) return "";
    return `${DIAS[fecha.getDay()]} ${fecha.getDate()} de ${MESES[fecha.getMonth()]} de ${fecha.getFullYear()}`;
  }

  function cuentaRegresiva(iso, hora, ahora) {
    const objetivo = fechaLocal(iso, hora);
    const desde = ahora instanceof Date ? ahora : new Date();
    const vacio = { dias: 0, horas: 0, minutos: 0, segundos: 0, terminado: true };
    if (!objetivo) return vacio;
    let ms = objetivo.getTime() - desde.getTime();
    if (ms <= 0) return vacio;
    const dias = Math.floor(ms / 86400000); ms -= dias * 86400000;
    const horas = Math.floor(ms / 3600000); ms -= horas * 3600000;
    const minutos = Math.floor(ms / 60000); ms -= minutos * 60000;
    return { dias, horas, minutos, segundos: Math.floor(ms / 1000), terminado: false };
  }

  // ---------- enlaces ----------

  function linkWhatsapp(evento) {
    const numero = soloDigitos(evento && evento.contacto && evento.contacto.whatsapp);
    const quien = (evento && evento.anfitriones) || (evento && evento.nombre) || "";
    const texto = `Hola, quiero confirmar mi asistencia al evento de ${quien}.`;
    return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
  }

  function linkMapaEmbebido(evento) {
    const l = (evento && evento.lugar) || {};
    const consulta = [l.direccion, l.nombre].filter(Boolean).join(", ") || "Chile";
    return `https://maps.google.com/maps?q=${encodeURIComponent(consulta)}&z=15&output=embed`;
  }

  function linkComoLlegar(evento) {
    const l = (evento && evento.lugar) || {};
    if (l.link) return l.link;
    const consulta = [l.direccion, l.nombre].filter(Boolean).join(", ");
    return `https://maps.google.com/?q=${encodeURIComponent(consulta)}`;
  }

  // ---------- carga ----------

  // Obtiene el evento de la Sheet publicada y, si algo falla —hoja
  // despublicada, sin red, código inexistente—, cae al respaldo local en vez de
  // dejar la invitación en blanco.
  async function cargarEvento(opciones) {
    const o = opciones || {};
    const codigo = o.codigo || "";
    if (o.urlSheet && codigo) {
      try {
        const r = await fetch(o.urlSheet, { cache: "no-store" });
        if (!r.ok) throw new Error("HTTP " + r.status);
        const fila = buscarEvento(aObjetos(parseCSV(await r.text())), codigo);
        if (fila) return { evento: filaAEvento(fila), origen: "sheet" };
        throw new Error("codigo no encontrado: " + codigo);
      } catch (err) {
        console.warn("[Invitia] no se pudo leer la hoja, uso el respaldo local:", err.message);
      }
    }
    const r = await fetch(o.urlRespaldo || "datos/demo.json", { cache: "no-store" });
    if (!r.ok) throw new Error("No hay datos de evento disponibles (HTTP " + r.status + ")");
    return { evento: filaAEvento(await r.json()), origen: "respaldo" };
  }

  return {
    ACENTO_POR_DEFECTO,
    parseCSV, aObjetos, buscarEvento,
    parseLineas, parsePrograma, parseFaq,
    normalizarTelefono, escapeHtml, urlSegura, valorDe, filaAEvento, tieneSeccion,
    formatearFechaLarga, fechaLocal, cuentaRegresiva,
    linkWhatsapp, linkMapaEmbebido, linkComoLlegar,
    cargarEvento,
  };
});

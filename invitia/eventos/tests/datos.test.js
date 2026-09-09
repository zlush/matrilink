// Pruebas del núcleo de datos de las invitaciones.
// Ejecutar:  node --test invitia/eventos/tests/
const test = require("node:test");
const assert = require("node:assert");
const D = require("../datos.js");

// ---------- parseCSV ----------

test("parseCSV lee una tabla simple", () => {
  const filas = D.parseCSV("a,b,c\n1,2,3");
  assert.deepStrictEqual(filas, [["a", "b", "c"], ["1", "2", "3"]]);
});

test("parseCSV respeta las comas dentro de comillas", () => {
  const filas = D.parseCSV('nombre,direccion\n"Camila","Av. Kennedy 123, Las Condes"');
  assert.deepStrictEqual(filas[1], ["Camila", "Av. Kennedy 123, Las Condes"]);
});

test("parseCSV respeta los saltos de línea dentro de comillas", () => {
  const filas = D.parseCSV('programa\n"18:00 | Ceremonia\n21:00 | Cena"');
  assert.strictEqual(filas.length, 2);
  assert.strictEqual(filas[1][0], "18:00 | Ceremonia\n21:00 | Cena");
});

test("parseCSV entiende las comillas escapadas", () => {
  const filas = D.parseCSV('nota\n"Dijo ""si"" sin dudar"');
  assert.strictEqual(filas[1][0], 'Dijo "si" sin dudar');
});

test("parseCSV normaliza CRLF y descarta la línea final vacía", () => {
  const filas = D.parseCSV("a,b\r\n1,2\r\n");
  assert.deepStrictEqual(filas, [["a", "b"], ["1", "2"]]);
});

test("parseCSV conserva las celdas vacías", () => {
  const filas = D.parseCSV("a,b,c\n1,,3");
  assert.deepStrictEqual(filas[1], ["1", "", "3"]);
});

// ---------- aObjetos y buscarEvento ----------

test("aObjetos usa la primera fila como cabecera y normaliza los nombres", () => {
  const objs = D.aObjetos([["Codigo Evento", " Tipo Evento "], ["mimi-2026", "matrimonio"]]);
  assert.deepStrictEqual(objs, [{ codigo_evento: "mimi-2026", tipo_evento: "matrimonio" }]);
});

test("buscarEvento encuentra por código sin distinguir mayúsculas ni espacios", () => {
  const objs = [{ codigo_evento: "mimi-2026" }, { codigo_evento: "nova-2026" }];
  assert.strictEqual(D.buscarEvento(objs, "  MIMI-2026 ").codigo_evento, "mimi-2026");
  assert.strictEqual(D.buscarEvento(objs, "no-existe"), null);
});

// ---------- parsers de contenido ----------

test("parseLineas separa por saltos y descarta las vacías", () => {
  assert.deepStrictEqual(D.parseLineas("uno\n\n  dos  \n"), ["uno", "dos"]);
  assert.deepStrictEqual(D.parseLineas(""), []);
});

test("parsePrograma separa hora y actividad", () => {
  const p = D.parsePrograma("18:00 | Ceremonia\n21:00 | Cena");
  assert.deepStrictEqual(p, [
    { hora: "18:00", actividad: "Ceremonia" },
    { hora: "21:00", actividad: "Cena" },
  ]);
});

test("parsePrograma tolera una línea sin separador", () => {
  assert.deepStrictEqual(D.parsePrograma("Fiesta hasta el amanecer"), [
    { hora: "", actividad: "Fiesta hasta el amanecer" },
  ]);
});

test("parseFaq separa pregunta y respuesta", () => {
  assert.deepStrictEqual(D.parseFaq("¿Hay estacionamiento? | Sí, en el subterráneo"), [
    { pregunta: "¿Hay estacionamiento?", respuesta: "Sí, en el subterráneo" },
  ]);
});

// ---------- filaAEvento ----------

const FILA = {
  codigo_evento: "mimi-2026",
  tipo_evento: "matrimonio",
  nombre_evento: "Matrimonio de Camila y Diego",
  nombre_anfitriones: "Camila & Diego",
  fecha_evento: "2026-12-12",
  hora_evento: "17:30",
  fecha_limite_confirmacion: "2026-11-20",
  lugar_nombre: "Viña Santa Elena",
  direccion: "Camino Lo Ovalle s/n, Casablanca",
  link_ubicacion: "https://maps.google.com/?q=Casablanca",
  whatsapp_contacto: "+56 9 1234 5678",
  link_lista_invitados: "https://ejemplo.cl/lista",
  historia: "Nos conocimos en 2018.",
  programa: "17:30 | Ceremonia\n19:00 | Cóctel",
  dress_code: "",
  regalos: "",
  alojamiento: "",
  fotos: "https://a.cl/1.jpg\nhttps://a.cl/2.jpg",
  faq: "",
  color_acento: "#8C6A3F",
};

test("filaAEvento normaliza los datos del evento", () => {
  const e = D.filaAEvento(FILA);
  assert.strictEqual(e.codigo, "mimi-2026");
  assert.strictEqual(e.tipo, "matrimonio");
  assert.strictEqual(e.anfitriones, "Camila & Diego");
  assert.strictEqual(e.fecha.iso, "2026-12-12");
  assert.strictEqual(e.fecha.hora, "17:30");
  assert.strictEqual(e.lugar.nombre, "Viña Santa Elena");
  assert.strictEqual(e.contacto.whatsapp, "+56912345678");
  assert.strictEqual(e.acento, "#8C6A3F");
  assert.deepStrictEqual(e.fotos, ["https://a.cl/1.jpg", "https://a.cl/2.jpg"]);
  assert.strictEqual(e.programa.length, 2);
});

test("filaAEvento deja vacías las secciones sin datos", () => {
  const e = D.filaAEvento(FILA);
  assert.strictEqual(e.dressCode, "");
  assert.deepStrictEqual(e.faq, []);
});

test("tieneSeccion decide qué se renderiza", () => {
  const e = D.filaAEvento(FILA);
  assert.strictEqual(D.tieneSeccion(e, "historia"), true);
  assert.strictEqual(D.tieneSeccion(e, "programa"), true);
  assert.strictEqual(D.tieneSeccion(e, "dressCode"), false);
  assert.strictEqual(D.tieneSeccion(e, "regalos"), false);
  assert.strictEqual(D.tieneSeccion(e, "faq"), false);
});

test("filaAEvento usa el acento por defecto si no viene", () => {
  const e = D.filaAEvento({ ...FILA, color_acento: "" });
  assert.strictEqual(e.acento, D.ACENTO_POR_DEFECTO);
});

test("filaAEvento no falla con una fila casi vacía", () => {
  const e = D.filaAEvento({ codigo_evento: "x" });
  assert.strictEqual(e.codigo, "x");
  assert.deepStrictEqual(e.programa, []);
  assert.strictEqual(e.lugar.nombre, "");
});

// ---------- fechas ----------

test("formatearFechaLarga escribe la fecha en español", () => {
  assert.strictEqual(D.formatearFechaLarga("2026-12-12"), "sábado 12 de diciembre de 2026");
});

test("formatearFechaLarga no se corre de día por zona horaria", () => {
  // new Date('2026-01-01') es medianoche UTC: en Chile sería 31 de diciembre.
  assert.strictEqual(D.formatearFechaLarga("2026-01-01"), "jueves 1 de enero de 2026");
});

test("formatearFechaLarga devuelve vacío si la fecha no sirve", () => {
  assert.strictEqual(D.formatearFechaLarga(""), "");
  assert.strictEqual(D.formatearFechaLarga("no es fecha"), "");
});

test("cuentaRegresiva descompone el tiempo que falta", () => {
  const ahora = new Date(2026, 11, 10, 12, 0, 0);
  const c = D.cuentaRegresiva("2026-12-12", "17:30", ahora);
  assert.strictEqual(c.terminado, false);
  assert.strictEqual(c.dias, 2);
  assert.strictEqual(c.horas, 5);
  assert.strictEqual(c.minutos, 30);
});

test("cuentaRegresiva avisa cuando el evento ya pasó", () => {
  const ahora = new Date(2026, 11, 13, 12, 0, 0);
  const c = D.cuentaRegresiva("2026-12-12", "17:30", ahora);
  assert.strictEqual(c.terminado, true);
  assert.strictEqual(c.dias, 0);
});

// ---------- enlaces ----------

test("linkWhatsapp arma el mensaje prellenado", () => {
  const e = D.filaAEvento(FILA);
  const url = D.linkWhatsapp(e);
  assert.ok(url.startsWith("https://wa.me/56912345678?text="));
  assert.ok(decodeURIComponent(url).includes("Camila & Diego"));
});

test("linkMapaEmbebido usa la dirección cuando no hay link", () => {
  const e = D.filaAEvento({ ...FILA, link_ubicacion: "" });
  assert.ok(D.linkMapaEmbebido(e).includes("output=embed"));
  assert.ok(decodeURIComponent(D.linkMapaEmbebido(e)).includes("Casablanca"));
});

test("aObjetos translitera las tildes de la cabecera", () => {
  // Google Forms genera columnas con tildes: "Dirección" debe llegar como
  // direccion, no como direccin (el mismo problema que tiene GHL con fieldKey).
  const objs = D.aObjetos(D.parseCSV("Código Evento,Dirección\nmimi-2026,Casablanca"));
  assert.deepStrictEqual(objs[0], { codigo_evento: "mimi-2026", direccion: "Casablanca" });
});

test("escapeHtml neutraliza el contenido que viene del formulario", () => {
  assert.strictEqual(D.escapeHtml('<img src=x onerror="alert(1)">'),
    "&lt;img src=x onerror=&quot;alert(1)&quot;&gt;");
  assert.strictEqual(D.escapeHtml("Té & pastelería"), "Té &amp; pastelería");
  assert.strictEqual(D.escapeHtml(""), "");
  assert.strictEqual(D.escapeHtml(null), "");
});

test("filaAEvento resuelve la foto de portada", () => {
  const propia = D.filaAEvento({ ...FILA, foto_portada: "https://a.cl/portada.jpg" });
  assert.strictEqual(propia.portada, "https://a.cl/portada.jpg");

  // Sin portada declarada usa la primera de la galería.
  assert.strictEqual(D.filaAEvento(FILA).portada, "https://a.cl/1.jpg");

  // Sin nada, queda vacía y la plantilla decide el respaldo de stock.
  assert.strictEqual(D.filaAEvento({ codigo_evento: "x" }).portada, "");
});

test("urlSegura solo deja pasar http, https y mailto", () => {
  assert.strictEqual(D.urlSegura("https://a.cl/foto.jpg"), "https://a.cl/foto.jpg");
  assert.strictEqual(D.urlSegura("  http://a.cl  "), "http://a.cl");
  assert.strictEqual(D.urlSegura("mailto:hola@invitia.cl"), "mailto:hola@invitia.cl");
  assert.strictEqual(D.urlSegura("javascript:alert(1)"), "");
  assert.strictEqual(D.urlSegura("JaVaScRiPt:alert(1)"), "");
  assert.strictEqual(D.urlSegura("data:text/html,<script>"), "");
  assert.strictEqual(D.urlSegura(""), "");
});

test("filaAEvento acepta los títulos naturales con artículos", () => {
  // "Código del evento" normaliza a codigo_del_evento, no a codigo_evento:
  // sin alias, un formulario escrito en español natural no calzaría con nada.
  const e = D.filaAEvento({
    codigo_del_evento: "martina-40",
    tipo_de_evento: "cumpleanos",
    nombre_del_evento: "Los 40 de Martina",
    nombre_del_anfitrion: "Martina",
    fecha_del_evento: "2026-11-07",
    hora_del_evento: "21:00",
    fecha_limite_de_confirmacion: "2026-10-25",
    lugar_del_evento: "Terraza Bellavista",
    direccion_del_evento: "Constitución 172, Providencia",
    link_de_ubicacion: "https://maps.google.com/?q=Providencia",
    whatsapp_de_contacto: "+56 9 0000 0000",
    preguntas_frecuentes: "¿Es sorpresa? | Sí",
  });
  assert.strictEqual(e.codigo, "martina-40");
  assert.strictEqual(e.tipo, "cumpleanos");
  assert.strictEqual(e.nombre, "Los 40 de Martina");
  assert.strictEqual(e.anfitriones, "Martina");
  assert.strictEqual(e.fecha.iso, "2026-11-07");
  assert.strictEqual(e.fecha.hora, "21:00");
  assert.strictEqual(e.fecha.limiteConfirmacion, "2026-10-25");
  assert.strictEqual(e.lugar.nombre, "Terraza Bellavista");
  assert.strictEqual(e.lugar.direccion, "Constitución 172, Providencia");
  assert.strictEqual(e.contacto.whatsapp, "+56900000000");
  assert.strictEqual(e.faq.length, 1);
});

test("buscarEvento también encuentra por la columna con artículo", () => {
  const objs = [{ codigo_del_evento: "martina-40" }];
  assert.ok(D.buscarEvento(objs, "martina-40"));
});

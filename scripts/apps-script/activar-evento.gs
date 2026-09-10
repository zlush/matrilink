/**
 * Invitia · activar un evento desde la hoja de respuestas
 *
 * Agrega un menú a la hoja: seleccionas la fila del evento, haces clic en
 * "Activar este evento" y los 13 custom values de GoHighLevel quedan cargados
 * con esa fila. De ahí, el tag imprime los datos sobre cada contacto.
 *
 * Instalación:
 *   1. En la hoja de respuestas: Extensions → Apps Script.
 *   2. Pega este archivo completo y guarda.
 *   3. Menú Invitia → Guardar token de GoHighLevel (queda en Script Properties,
 *      no en el código ni en el repositorio).
 *   4. Recarga la hoja: el menú aparece solo al abrirla.
 */

var LOCATION_ID = 'kEZKnFdhkbuCT1BBR0pv';
var API = 'https://services.leadconnectorhq.com';
var VERSION = '2021-07-28';
var BASE_URL = 'https://invitia-weld.vercel.app/eventos/';
var COL_ACTIVADO = 'Activado en GHL';

/** Columna de la hoja  ->  clave del custom value. */
var MAPA = [
  ['codigo_evento', 'codigo_del_evento'],
  ['tipo_evento', 'tipo_de_evento'],
  ['nombre_evento', 'nombre_del_evento'],
  ['nombre_anfitriones', 'nombre_del_anfitrion'],
  ['fecha_evento', 'fecha_del_evento'],
  ['hora_evento', 'hora_del_evento'],
  ['fecha_limite_confirmacion', 'fecha_limite_de_confirmacion'],
  ['lugar_nombre', 'lugar_del_evento'],
  ['direccion', 'direccion_del_evento'],
  ['link_ubicacion', 'link_de_ubicacion'],
  // El WhatsApp del evento NO va a whatsapp_de_contacto: ese custom value es de
  // marca y guarda el número de Invitia.
  ['whatsapp_contacto', 'whatsapp_del_anfitrion']
];

/** Custom values de marca. Nunca se escriben desde aquí. */
var MARCA = ['email_de_contacto', 'horario_de_atencion', 'instagram', 'link_de_whatsapp',
  'link_de_politica_de_privacidad', 'link_de_terminos_y_condiciones', 'link_para_agendar_demo',
  'nombre_de_la_marca', 'nombre_del_asesor', 'sitio_web', 'whatsapp_de_contacto'];

var ALIAS = {
  codigo_evento: ['codigo_del_evento', 'codigo'],
  tipo_evento: ['tipo_de_evento', 'tipo'],
  nombre_evento: ['nombre_del_evento'],
  nombre_anfitriones: ['nombre_del_anfitrion', 'nombre_de_los_anfitriones', 'anfitriones'],
  fecha_evento: ['fecha_del_evento', 'fecha'],
  hora_evento: ['hora_del_evento', 'hora'],
  fecha_limite_confirmacion: ['fecha_limite_de_confirmacion', 'fecha_limite'],
  lugar_nombre: ['lugar_del_evento', 'nombre_del_lugar', 'lugar'],
  direccion: ['direccion_del_evento'],
  link_ubicacion: ['link_de_ubicacion', 'link_de_la_ubicacion'],
  whatsapp_contacto: ['whatsapp_de_contacto', 'whatsapp']
};

var DIAS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
  'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

// ---------------------------------------------------------------- menú

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Invitia')
    .addItem('Activar este evento', 'activarEvento')
    .addItem('Ver evento activo', 'verEventoActivo')
    .addSeparator()
    .addItem('Guardar token de GoHighLevel', 'guardarToken')
    .addToUi();
}

function guardarToken() {
  var ui = SpreadsheetApp.getUi();
  var r = ui.prompt('Token de GoHighLevel',
    'Pega el Private Integration Token (empieza con pit-). Queda guardado en esta hoja, no en el código.',
    ui.ButtonSet.OK_CANCEL);
  if (r.getSelectedButton() !== ui.Button.OK) return;
  var token = r.getResponseText().trim();
  if (token.indexOf('pit-') !== 0) {
    ui.alert('Eso no parece un token: debería empezar con "pit-".');
    return;
  }
  PropertiesService.getScriptProperties().setProperty('GHL_PIT', token);
  ui.alert('Token guardado. Ya puedes activar eventos.');
}

function verEventoActivo() {
  var activo = eventoActivo_();
  SpreadsheetApp.getUi().alert(activo
    ? 'Evento activo en GoHighLevel:\n\n' + activo.nombre + '\ncódigo: ' + activo.codigo
    : 'No hay ningún evento cargado en los custom values.');
}

// ---------------------------------------------------------------- activar

function activarEvento() {
  var ui = SpreadsheetApp.getUi();
  var hoja = SpreadsheetApp.getActiveSheet();
  var fila = SpreadsheetApp.getActiveRange().getRow();

  if (fila < 2) {
    ui.alert('Selecciona una celda dentro de la fila del evento que quieres activar.');
    return;
  }

  var datos = leerFila_(hoja, fila);
  if (!datos.codigo_evento) {
    ui.alert('Esa fila no tiene código de evento. Revisa la columna "Código del evento".');
    return;
  }

  var duplicadas = filasDelEvento_(hoja, datos.codigo_evento);
  var avisoDuplicadas = '';
  if (duplicadas.length > 1 && duplicadas[duplicadas.length - 1] !== fila) {
    // Google Forms agrega una fila por envío: la corrección más reciente está
    // más abajo, y activar una fila vieja carga datos ya corregidos.
    avisoDuplicadas = '\n\nOJO: hay ' + duplicadas.length + ' respuestas con este código y esta ' +
      'no es la última (la más reciente está en la fila ' + duplicadas[duplicadas.length - 1] + ').';
  }

  var valores = valoresDelEvento_(datos);
  var activo = eventoActivo_();
  var mensaje = 'Vas a cargar en GoHighLevel:\n\n' +
    (valores.nombre_del_evento || '(sin nombre)') + '\ncódigo: ' + valores.codigo_del_evento +
    '\nfecha: ' + (valores.fecha_del_evento_en_texto || valores.fecha_del_evento) +
    (activo ? '\n\nEsto reemplaza al evento activo: ' + activo.nombre + ' (' + activo.codigo + ').' +
      '\nSi quedan invitados de ese evento sin etiquetar, heredarán los datos nuevos.' : '') +
    avisoDuplicadas + '\n\n¿Continúo?';

  if (ui.alert('Activar evento', mensaje, ui.ButtonSet.YES_NO) !== ui.Button.YES) return;

  var res = escribirCustomValues_(valores);
  marcarActivada_(hoja, fila, res.escritos + '/' + res.total);
  ui.alert(res.errores.length
    ? 'Se escribieron ' + res.escritos + ' de ' + res.total + '.\n\nFallaron:\n' + res.errores.join('\n')
    : 'Listo: ' + res.escritos + ' custom values actualizados con "' + valores.codigo_del_evento + '".');
}

// ---------------------------------------------------------------- hoja

function normalizarClave_(s) {
  return String(s == null ? '' : s)
    .trim().toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function cabecera_(hoja) {
  return hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0].map(normalizarClave_);
}

function leerFila_(hoja, fila) {
  var claves = cabecera_(hoja);
  var celdas = hoja.getRange(fila, 1, 1, hoja.getLastColumn()).getValues()[0];
  var o = {};
  for (var i = 0; i < claves.length; i++) {
    if (claves[i]) o[claves[i]] = normalizarCelda_(celdas[i]);
  }
  return o;
}

/** Las preguntas de fecha y hora de Forms llegan como Date, no como texto. */
function normalizarCelda_(valor) {
  if (valor instanceof Date) {
    var tz = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone();
    var esHora = valor.getFullYear() <= 1900;
    return Utilities.formatDate(valor, tz, esHora ? 'HH:mm' : 'yyyy-MM-dd');
  }
  return String(valor == null ? '' : valor).trim();
}

function filasDelEvento_(hoja, codigo) {
  var claves = cabecera_(hoja);
  var col = -1;
  for (var i = 0; i < claves.length; i++) {
    if (claves[i] === 'codigo_evento' || claves[i] === 'codigo_del_evento') { col = i; break; }
  }
  if (col === -1) return [];
  var todo = hoja.getRange(2, col + 1, Math.max(hoja.getLastRow() - 1, 1), 1).getValues();
  var filas = [];
  for (var f = 0; f < todo.length; f++) {
    if (String(todo[f][0]).trim().toLowerCase() === String(codigo).trim().toLowerCase()) {
      filas.push(f + 2);
    }
  }
  return filas;
}

function marcarActivada_(hoja, fila, detalle) {
  var claves = cabecera_(hoja);
  var objetivo = normalizarClave_(COL_ACTIVADO);
  var col = claves.indexOf(objetivo) + 1;
  if (!col) {
    col = hoja.getLastColumn() + 1;
    hoja.getRange(1, col).setValue(COL_ACTIVADO);
  }
  var tz = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone();
  hoja.getRange(fila, col).setValue(
    Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd HH:mm') + '  (' + detalle + ')');
}

// ---------------------------------------------------------------- datos

function valorDe_(fila, clave) {
  if (fila[clave]) return String(fila[clave]).trim();
  var alts = ALIAS[clave] || [];
  for (var i = 0; i < alts.length; i++) {
    if (fila[alts[i]]) return String(fila[alts[i]]).trim();
  }
  return '';
}

function fechaEnTexto_(iso) {
  var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || '').trim());
  if (!m) return '';
  var f = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  var dia = (f.getDay() + 6) % 7;   // getDay() parte en domingo
  return DIAS[dia] + ' ' + f.getDate() + ' de ' + MESES[f.getMonth()] + ' de ' + f.getFullYear();
}

function valoresDelEvento_(fila) {
  var v = {};
  for (var i = 0; i < MAPA.length; i++) {
    v[MAPA[i][1]] = valorDe_(fila, MAPA[i][0]);
  }
  var codigo = valorDe_(fila, 'codigo_evento');
  v.link_de_la_invitacion = codigo ? BASE_URL + '?evento=' + encodeURIComponent(codigo) : '';
  v.fecha_del_evento_en_texto = fechaEnTexto_(valorDe_(fila, 'fecha_evento'));

  for (var clave in v) {
    if (MARCA.indexOf(clave) !== -1) {
      throw new Error('El mapeo apunta a un custom value de marca: ' + clave);
    }
  }
  return v;
}

// ---------------------------------------------------------------- GHL

function token_() {
  var t = PropertiesService.getScriptProperties().getProperty('GHL_PIT');
  if (!t) throw new Error('Falta el token: menú Invitia → Guardar token de GoHighLevel.');
  return t;
}

function llamar_(metodo, ruta, cuerpo) {
  var opciones = {
    method: metodo,
    headers: {
      Authorization: 'Bearer ' + token_(),
      Version: VERSION,
      Accept: 'application/json'
    },
    muteHttpExceptions: true
  };
  if (cuerpo) {
    opciones.contentType = 'application/json; charset=utf-8';
    opciones.payload = JSON.stringify(cuerpo);
  }
  var r = UrlFetchApp.fetch(API + ruta, opciones);
  var texto = r.getContentText();
  if (r.getResponseCode() >= 300) {
    throw new Error('GHL respondió ' + r.getResponseCode() + ': ' + texto.slice(0, 200));
  }
  return JSON.parse(texto || '{}');
}

function listarCustomValues_() {
  var datos = llamar_('GET', '/locations/' + LOCATION_ID + '/customValues');
  var porClave = {};
  (datos.customValues || []).forEach(function (cv) {
    var k = normalizarClave_(String(cv.fieldKey || '').replace('custom_values.', '').replace(/[{}]/g, ''));
    porClave[k] = cv;
  });
  return porClave;
}

function eventoActivo_() {
  try {
    var cv = listarCustomValues_();
    var codigo = cv.codigo_del_evento && cv.codigo_del_evento.value;
    if (!codigo) return null;
    return {
      codigo: codigo,
      nombre: (cv.nombre_del_evento && cv.nombre_del_evento.value) || '(sin nombre)'
    };
  } catch (e) {
    return null;
  }
}

function escribirCustomValues_(valores) {
  var existentes = listarCustomValues_();
  var escritos = 0, total = 0, errores = [];
  for (var clave in valores) {
    total++;
    var cv = existentes[clave];
    if (!cv) { errores.push(clave + ': no existe en la sub-cuenta'); continue; }
    try {
      llamar_('PUT', '/locations/' + LOCATION_ID + '/customValues/' + cv.id,
        { name: cv.name, value: valores[clave] });
      escritos++;
    } catch (e) {
      errores.push(clave + ': ' + e.message);
    }
  }
  return { escritos: escritos, total: total, errores: errores };
}

// ---------------------------------------------------------------- prueba

/**
 * Ejecutable desde el editor de Apps Script (Run → probarMapeo).
 * No toca GoHighLevel: solo revisa el armado de los 13 valores.
 */
function probarMapeo() {
  var fila = {
    codigo_del_evento: 'mimi-2026',
    tipo_de_evento: 'matrimonio',
    nombre_del_evento: 'Matrimonio de Mimi',
    nombre_del_anfitrion: 'Mimi & Beto',
    fecha_del_evento: '2026-12-12',
    hora_del_evento: '17:30',
    whatsapp_de_contacto: '+56 9 1234 5678'
  };
  var v = valoresDelEvento_(fila);
  if (Object.keys(v).length !== 13) throw new Error('se esperaban 13, hay ' + Object.keys(v).length);
  if (v.fecha_del_evento_en_texto !== 'sábado 12 de diciembre de 2026') {
    throw new Error('fecha mal formateada: ' + v.fecha_del_evento_en_texto);
  }
  if (v.link_de_la_invitacion.indexOf('mimi-2026') === -1) throw new Error('link mal armado');
  if (v.whatsapp_del_anfitrion !== '+56 9 1234 5678') throw new Error('whatsapp no mapeado');
  if ('whatsapp_de_contacto' in v) throw new Error('no debe tocar el custom value de marca');
  Logger.log('probarMapeo OK: 13 valores, fecha "%s"', v.fecha_del_evento_en_texto);
}

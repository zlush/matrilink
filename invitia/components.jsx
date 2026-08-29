// ========== Invitia · Componentes compartidos ==========
const { useState, useEffect, useMemo, useRef } = React;

// ----- Logo -----
function LogoWordmark({ light = false, height = 34 }) {
  return (
    <span className="nav__logo">
      <img
        src={light ? "assets/logo-light.png" : "assets/logo.png"}
        alt="Invitia"
        style={{ height }}
      />
    </span>
  );
}

// ----- Botones -----
function Button({ variant = "primary", size, onClick, children, href, type = "button", className = "" }) {
  const cls = `btn btn--${variant}${size ? ` btn--${size}` : ""} ${className}`;
  if (href) return <a className={cls} href={href} onClick={onClick}>{children}</a>;
  return <button type={type} className={cls} onClick={onClick}>{children}</button>;
}

// ----- Iconos -----
const Icon = {
  Arrow: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  Chat: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 7.5c0-2.5 1.9-4.4 5-4.4h4c3.1 0 5 1.9 5 4.4v2.5c0 2.5-1.9 4.4-5 4.4h-2.5L6 17.5v-3.1C4.2 13.8 3 12.2 3 10V7.5z" stroke="currentColor" strokeWidth="1.4"/></svg>
  ),
  Check: () => (
    <svg width="18" height="18" viewBox="0 0 14 14" fill="none"><path d="M2.5 7l3 3 6-6.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  Sparkle: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2.5l1.6 4.4 4.4 1.6-4.4 1.6L10 14.5 8.4 10.1 4 8.5l4.4-1.6L10 2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M15.5 13.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8z" fill="currentColor"/></svg>
  ),
  Camera: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="6" width="16" height="11" rx="3" stroke="currentColor" strokeWidth="1.4"/><circle cx="10" cy="11.5" r="3" stroke="currentColor" strokeWidth="1.4"/><path d="M7 6l1-2h4l1 2" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>
  ),
  Calendar: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="5" width="14" height="12" rx="3" stroke="currentColor" strokeWidth="1.4"/><path d="M3 9h14M7 3v4M13 3v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
  ),
  Whatsapp: () => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M10 2a8 8 0 00-7 11.8L2 18l4.4-1A8 8 0 1010 2z" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M7 7.5c0-.3.2-.5.5-.5h.7c.2 0 .4.1.5.3l.5 1.2c0 .2 0 .4-.1.5l-.4.4c-.1.1-.1.3 0 .4.4.7 1 1.3 1.7 1.7.1.1.3.1.4 0l.4-.4c.1-.1.3-.2.5-.1l1.2.5c.2.1.3.3.3.5v.7c0 .3-.2.5-.5.5C9.6 13.5 6.5 10.4 6.5 7.5z" fill="currentColor"/></svg>
  ),
  Game: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="6" width="16" height="10" rx="4" stroke="currentColor" strokeWidth="1.4"/><path d="M6 11h2.4M7.2 9.8v2.4M13 10.4h.5M15 12h.5M14 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
  ),
  Ticket: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 7a2 2 0 012-2h10a2 2 0 012 2v1a2 2 0 000 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1a2 2 0 000-4V7z" stroke="currentColor" strokeWidth="1.4"/><path d="M12 5.5v9" stroke="currentColor" strokeWidth="1.4" strokeDasharray="2 2"/></svg>
  ),
  Users: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="8" cy="7" r="3" stroke="currentColor" strokeWidth="1.4"/><path d="M2.5 16c0-2.8 2.5-4.5 5.5-4.5s5.5 1.7 5.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M14 5.2A2.8 2.8 0 0115 10.6M15.5 11.8c1.4.6 2.5 1.8 2.5 3.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
  ),
};

// ========== Demos por tipo de evento ==========
// Un solo modelo de datos alimenta el hero: chip, titular, chat y métricas.
const EVENTS = [
  {
    id: "matrimonio",
    chip: "💍 Matrimonio",
    word: "matrimonio",
    host: "Camila & Diego",
    avatar: "C",
    guest: "Sofía",
    cover: "Camila & Diego",
    lead: "Te invitamos a nuestro matrimonio",
    detail: ["📅 Sábado 14 de diciembre", "📍 Viña Santa Elena, Casablanca", "🕒 17:30 · ceremonia y fiesta"],
    options: ["Confirmo asistencia", "No podré asistir", "Tengo una pregunta"],
    followUp: "¡Confirmado! ¿Cuál es tu preferencia de menú?",
    followOptions: ["🍖 Tradicional", "🥗 Vegetariano", "🌱 Vegano · sin gluten"],
    floats: [
      { lbl: "Confirmados", num: "184", sub: " / 240", side: "l", pos: { top: 34 } },
      { lbl: "Menús vegetarianos", num: "22", side: "l", pos: { bottom: 96 }, delay: "0.2s" },
      { lbl: "Fotos recibidas", num: "312", side: "r", pos: { top: 128 }, dot: "var(--coral)" },
      { lbl: "Cápsulas de video", num: "74", side: "r", pos: { bottom: 30 }, dot: "var(--violeta)" },
    ],
  },
  {
    id: "cumpleanos",
    chip: "🎂 Cumpleaños",
    word: "cumpleaños",
    host: "Martina · 40",
    avatar: "M",
    guest: "Tomás",
    cover: "Martina cumple 40",
    lead: "Fiesta sorpresa — no le cuentes",
    detail: ["📅 Viernes 7 de marzo", "📍 Terraza Bellavista, Providencia", "🕒 21:00 · llegar 20:40 (sorpresa)"],
    options: ["Ahí estaré", "No puedo esta vez", "¿Puedo llevar a alguien?"],
    followUp: "¡Genial! ¿Vienes con acompañante?",
    followOptions: ["Voy solo/a", "Voy con +1", "Voy con +2"],
    floats: [
      { lbl: "Confirmados", num: "78", sub: " / 96", side: "l", pos: { top: 34 } },
      { lbl: "Acompañantes", num: "19", side: "l", pos: { bottom: 96 }, delay: "0.2s" },
      { lbl: "Saludos grabados", num: "41", side: "r", pos: { top: 128 }, dot: "var(--coral)" },
      { lbl: "Canciones pedidas", num: "63", side: "r", pos: { bottom: 30 }, dot: "var(--violeta)" },
    ],
  },
  {
    id: "corporativo",
    chip: "🏢 Corporativo",
    word: "evento corporativo",
    host: "Lanzamiento Nova",
    avatar: "N",
    guest: "Andrea",
    cover: "Lanzamiento Nova 2026",
    lead: "Te esperamos en el lanzamiento",
    detail: ["📅 Jueves 22 de mayo", "📍 Hotel W, Las Condes · Salón Andes", "🕒 09:00 · acreditación desde 08:15"],
    options: ["Confirmo mi cupo", "No podré asistir", "Enviaré a un colega"],
    followUp: "Listo. ¿Qué bloques quieres reservar?",
    followOptions: ["Keynote + demo", "Solo workshop técnico", "Día completo"],
    floats: [
      { lbl: "Cupos confirmados", num: "412", sub: " / 500", side: "l", pos: { top: 34 } },
      { lbl: "Check-in en puerta", num: "96%", side: "l", pos: { bottom: 96 }, delay: "0.2s" },
      { lbl: "Preguntas al panel", num: "128", side: "r", pos: { top: 128 }, dot: "var(--coral)" },
      { lbl: "NPS del evento", num: "72", side: "r", pos: { bottom: 30 }, dot: "var(--violeta)" },
    ],
  },
  {
    id: "graduacion",
    chip: "🎓 Graduación",
    word: "graduación",
    host: "Generación 2026",
    avatar: "G",
    guest: "Familia Rojas",
    cover: "Licenciatura 2026",
    lead: "Ceremonia de graduación",
    detail: ["📅 Sábado 29 de noviembre", "📍 Aula Magna · Campus San Joaquín", "🕒 11:00 · 2 entradas por alumno"],
    options: ["Confirmo 2 entradas", "Necesito 1 sola", "Solicitar una extra"],
    followUp: "Reservadas. ¿Alguien necesita acceso preferencial?",
    followOptions: ["Sí, silla de ruedas", "Sí, adulto mayor", "No, gracias"],
    floats: [
      { lbl: "Entradas confirmadas", num: "486", sub: " / 620", side: "l", pos: { top: 34 } },
      { lbl: "Accesos preferenciales", num: "34", side: "l", pos: { bottom: 96 }, delay: "0.2s" },
      { lbl: "Fotos de familias", num: "540", side: "r", pos: { top: 128 }, dot: "var(--coral)" },
      { lbl: "Mensajes a la generación", num: "212", side: "r", pos: { bottom: 30 }, dot: "var(--violeta)" },
    ],
  },
];

// ----- Mockup de teléfono + chat -----
function PhoneChat({ evt = EVENTS[0], compact = false }) {
  const [answer, setAnswer] = useState(null);

  useEffect(() => { setAnswer(null); }, [evt.id]);

  return (
    <div className="phone" style={compact ? { width: 280 } : undefined}>
      <div className="phone__screen" style={compact ? { height: 470 } : undefined}>
        <div className="phone__notch"></div>
        <div className="chat__header">
          <div className="chat__avatar">{evt.avatar}</div>
          <div>
            <div className="chat__name">Invitia · {evt.host}</div>
            <div className="chat__status">en línea ahora</div>
          </div>
        </div>
        <div className="chat__body">
          <div className="bubble bubble--system">Hoy</div>

          <div className="bubble">
            Hola {evt.guest} 👋
            <div className="bubble__meta">10:42</div>
          </div>

          <div className="bubble bubble--card">
            <div className="bubble__cover"><span>{evt.cover}</span></div>
            <div className="bubble__body">
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{evt.lead}</div>
              <div style={{ fontSize: 11.5, color: "#5B6182", lineHeight: 1.5 }}>
                {evt.detail.map((d, i) => <div key={i}>{d}</div>)}
              </div>
            </div>
            <div className="bubble__btns">
              {evt.options.map((o, i) => (
                <div
                  key={i}
                  className={`bubble__btn${answer === i ? " bubble__btn--active" : ""}`}
                  onClick={() => setAnswer(i)}
                >
                  {answer === i && i === 0 ? "✓ " : ""}{o}
                </div>
              ))}
            </div>
            <div className="bubble__meta" style={{ padding: "0 12px 8px" }}>10:42</div>
          </div>

          {answer === 0 && (
            <>
              <div className="bubble bubble--mine">
                {evt.followUp}
                <div className="bubble__meta">10:42 ✓✓</div>
              </div>
              <div className="bubble bubble--card" style={{ maxWidth: "78%" }}>
                <div className="bubble__btns" style={{ borderRadius: 14 }}>
                  {evt.followOptions.map((o, i) => <div className="bubble__btn" key={i}>{o}</div>)}
                </div>
              </div>
            </>
          )}
          {answer === 1 && (
            <div className="bubble bubble--mine">
              Gracias por avisar — te sacamos de los recordatorios. ¡Te vamos a extrañar!
              <div className="bubble__meta">10:42 ✓✓</div>
            </div>
          )}
          {answer === 2 && (
            <div className="bubble bubble--mine">
              Claro, escríbenos tu pregunta y te respondemos al toque.
              <div className="bubble__meta">10:42 ✓✓</div>
            </div>
          )}
          {answer === null && (
            <div className="bubble bubble--system" style={{ fontStyle: "italic" }}>↑ Tócame</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ----- Tarjetas flotantes del hero -----
function HeroFloats({ evt = EVENTS[0] }) {
  return (
    <>
      {evt.floats.map((f, i) => (
        <div className={`stat-float stat-float--${f.side}`} key={`${evt.id}-${i}`} style={{ ...f.pos, animationDelay: f.delay || "0s" }}>
          <span className="stat-float__lbl">
            <span className="stat-float__dot" style={f.dot ? { background: f.dot, boxShadow: "none" } : undefined}></span>
            {f.lbl}
          </span>
          <span className="stat-float__num">
            {f.num}
            {f.sub && <small style={{ fontSize: 14, color: "var(--gris-soft)", fontWeight: 500 }}>{f.sub}</small>}
          </span>
        </div>
      ))}
    </>
  );
}

// ----- Dashboard -----
function Dashboard() {
  return (
    <div className="dash">
      <div className="dash__top">
        <div className="dash__dots"><span></span><span></span><span></span></div>
        <div className="dash__title">Cumpleaños de Martina <small>· 7 de marzo, 2026</small></div>
        <div style={{ fontSize: 12, color: "var(--gris)" }}>· 23 días restantes</div>
      </div>
      <div className="dash__body">
        <aside className="dash__side">
          <h5>Evento</h5>
          <div className="dash__nav">
            <a className="active"><span className="ico" style={{ background: "var(--violeta)" }}></span>Resumen</a>
            <a><span className="ico" style={{ background: "var(--magenta)" }}></span>Invitados</a>
            <a><span className="ico" style={{ background: "var(--coral)" }}></span>Confirmaciones</a>
            <a><span className="ico" style={{ background: "var(--violeta-soft)" }}></span>Menús y restricciones</a>
            <a><span className="ico" style={{ background: "var(--magenta-soft)" }}></span>Mesas y ubicaciones</a>
            <a><span className="ico" style={{ background: "var(--coral-soft)" }}></span>Acreditación / check-in</a>
            <a><span className="ico" style={{ background: "var(--lila-2)" }}></span>Comunicaciones</a>
          </div>
          <h5 style={{ marginTop: 22 }}>Experiencia</h5>
          <div className="dash__nav">
            <a><span className="ico" style={{ background: "var(--violeta)" }}></span>Juegos y dinámicas</a>
            <a><span className="ico" style={{ background: "var(--coral)" }}></span>Cápsulas de video</a>
            <a><span className="ico" style={{ background: "var(--magenta)" }}></span>Recuerdos</a>
          </div>
        </aside>
        <div className="dash__main">
          <div className="dash__hello">
            <div>
              <h3>Buenos días, Martina</h3>
              <small>Tienes 18 invitados pendientes de confirmar y 4 preguntas nuevas.</small>
            </div>
            <Button variant="primary" size="sm">Enviar recordatorio</Button>
          </div>
          <div className="kpi-row">
            <div className="kpi"><div className="kpi__lbl">Cargados</div><div className="kpi__num">96</div><div className="kpi__delta">100% con teléfono</div></div>
            <div className="kpi kpi--accent"><div className="kpi__lbl">Confirmados</div><div className="kpi__num">78</div><div className="kpi__delta">+11 esta semana</div></div>
            <div className="kpi"><div className="kpi__lbl">Pendientes</div><div className="kpi__num">18</div><div className="kpi__delta" style={{ color: "var(--coral)" }}>recordatorio enviado</div></div>
            <div className="kpi"><div className="kpi__lbl">Acompañantes</div><div className="kpi__num">19</div><div className="kpi__delta">6 nuevos</div></div>
          </div>
          <div className="dash-row">
            <div className="panel">
              <h4>Selección de menú <small>78 confirmados</small></h4>
              <div className="menu-bars">
                <MenuBar name="Tradicional" value={44} max={78} cls="" />
                <MenuBar name="Vegetariano" value={16} max={78} cls="menu-bar__fill--magenta" />
                <MenuBar name="Vegano" value={7} max={78} cls="menu-bar__fill--violeta" />
                <MenuBar name="Sin gluten" value={5} max={78} cls="menu-bar__fill--coral" />
                <MenuBar name="Infantil" value={6} max={78} cls="menu-bar__fill--soft" />
              </div>
            </div>
            <div className="panel">
              <h4>Actividad reciente</h4>
              <div className="activity">
                <div className="activity__item">
                  <span className="activity__dot"></span>
                  <div>
                    <div className="activity__txt"><strong>Valentina P.</strong> confirmó asistencia</div>
                    <div className="activity__time">hace 4 min</div>
                  </div>
                </div>
                <div className="activity__item">
                  <span className="activity__dot activity__dot--magenta"></span>
                  <div>
                    <div className="activity__txt">2 invitados eligieron menú vegano</div>
                    <div className="activity__time">hace 18 min</div>
                  </div>
                </div>
                <div className="activity__item">
                  <span className="activity__dot activity__dot--coral"></span>
                  <div>
                    <div className="activity__txt"><strong>Pregunta nueva</strong>: ¿hay estacionamiento en el lugar?</div>
                    <div className="activity__time">hace 1 h</div>
                  </div>
                </div>
                <div className="activity__item">
                  <span className="activity__dot"></span>
                  <div>
                    <div className="activity__txt">Recordatorio enviado a 18 pendientes</div>
                    <div className="activity__time">hace 3 h</div>
                  </div>
                </div>
                <div className="activity__item">
                  <span className="activity__dot activity__dot--magenta"></span>
                  <div>
                    <div className="activity__txt"><strong>Mateo F.</strong> registró +1 acompañante</div>
                    <div className="activity__time">ayer</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuBar({ name, value, max, cls }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="menu-bar">
      <div className="menu-bar__name">{name}</div>
      <div className="menu-bar__track">
        <div className={`menu-bar__fill ${cls}`} style={{ width: pct + "%" }}></div>
      </div>
      <div className="menu-bar__num">{value}</div>
    </div>
  );
}

Object.assign(window, {
  LogoWordmark, Button, Icon, EVENTS,
  PhoneChat, HeroFloats, Dashboard, MenuBar,
});

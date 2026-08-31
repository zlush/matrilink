// ========== Invitia · Secciones de la landing ==========

// ----- NAV -----
function Nav({ onCTA }) {
  return (
    <nav className="nav">
      <div className="nav__inner">
        <a href="#top"><LogoWordmark /></a>
        <div className="nav__links">
          <a href="#eventos">Tipos de evento</a>
          <a href="#como-funciona">Cómo funciona</a>
          <a href="#modulos">Módulos</a>
          <a href="#recuerdos">Recuerdos</a>
          <a href="#organizadores">Organizadores</a>
          <a href="#planes">Planes</a>
          <a href="#faq">FAQ</a>
        </div>
        <div className="nav__cta">
          <Button variant="ghost" size="sm" onClick={onCTA}>Hablar con un asesor</Button>
          <Button variant="primary" size="sm" onClick={onCTA}>Solicitar demo</Button>
        </div>
      </div>
    </nav>
  );
}

// La palabra más larga define la altura reservada del titular del hero.
const LONGEST_WORD = EVENTS.map(e => e.word).sort((a, b) => b.length - a.length)[0];

// ----- HERO -----
function Hero({ onCTA }) {
  const [active, setActive] = useState(0);
  const [manual, setManual] = useState(false);

  useEffect(() => {
    if (manual) return;
    const t = setInterval(() => setActive(a => (a + 1) % EVENTS.length), 4200);
    return () => clearInterval(t);
  }, [manual]);

  const evt = EVENTS[active];
  const pick = (i) => { setManual(true); setActive(i); };

  const heroTitle = (word, ghost) => (
    <span
      className={ghost ? "hero__title__ghost" : "hero__title__live"}
      aria-hidden={ghost ? "true" : undefined}
    >
      Organiza a tus invitados y convierte tu{" "}
      <span className="rotator">
        <span key={ghost ? "ghost" : evt.id} className="rotator__item">{word}</span>
      </span>{" "}
      en una historia inolvidable.
    </span>
  );

  return (
    <section className="hero" id="top">
      <div className="wrap">
        <div className="hero__grid">
          <div>
            <span className="eyebrow">Para cualquier evento con invitados</span>
            <h1 className="hero__title">
              {/* El fantasma repite el titular con la palabra más larga y la
                  MISMA estructura (la palabra es inline-block, no se parte), así
                  reserva la altura real y el hero no salta al rotar. */}
              {heroTitle(LONGEST_WORD, true)}
              {heroTitle(evt.word, false)}
            </h1>
            <p className="hero__sub">
              Invitia conecta tu evento con tus invitados por WhatsApp:
              invitaciones, confirmaciones, recordatorios, acreditación,
              preguntas frecuentes, juegos, fotos, videos y recuerdos — en un
              solo lugar. Da igual si son 40 personas o 2.000.
            </p>
            <div className="hero__cta">
              <Button variant="primary" size="lg" onClick={onCTA}>Solicitar demo <Icon.Arrow /></Button>
              <Button variant="ghost" size="lg" href="#como-funciona">Ver cómo funciona</Button>
            </div>
            <div className="hero__trust">
              <span><strong>+12.000</strong> invitaciones enviadas</span>
              <span><strong>94%</strong> de confirmación promedio</span>
              <span><strong>Sin descargas</strong> para tus invitados</span>
            </div>
          </div>
          <div className="hero__visual">
            <div className="evt-switch">
              {EVENTS.map((e, i) => (
                <button
                  key={e.id}
                  className={`evt-chip${i === active ? " evt-chip--on" : ""}`}
                  onClick={() => pick(i)}
                >
                  {e.chip}
                </button>
              ))}
            </div>
            <div style={{ position: "relative", width: 320 }}>
              <PhoneChat evt={evt} />
              <HeroFloats evt={evt} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ----- MARQUEE DE TIPOS DE EVENTO -----
function Marquee() {
  const items = [
    ["💍", "Matrimonios"], ["🎂", "Cumpleaños"], ["🏢", "Eventos corporativos"],
    ["🎓", "Graduaciones"], ["👶", "Baby showers"], ["👑", "Quinceañeros"],
    ["🥂", "Aniversarios"], ["🎤", "Conferencias"], ["🎉", "Fiestas privadas"],
    ["⛪", "Bautizos y primeras comuniones"], ["🏆", "Premiaciones"], ["🍽️", "Cenas de gala"],
  ];
  const loop = [...items, ...items];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {loop.map(([ico, txt], i) => (
          <span className="marquee__item" key={i}><span>{ico}</span><span>{txt}</span></span>
        ))}
      </div>
    </div>
  );
}

// ----- BANDA DE CLAIM -----
function ClaimBand() {
  return (
    <div className="claim-band">
      <div className="claim-band__inner">
        <span>Antes del evento<span className="claim-band__dot"></span></span>
        <span>Durante la celebración<span className="claim-band__dot"></span></span>
        <span>Y todos los recuerdos después</span>
      </div>
    </div>
  );
}

// ----- TIPOS DE EVENTO -----
function EventTypes() {
  const types = [
    { ico: "💍", name: "Matrimonios", desc: "Confirmaciones, menús, acompañantes, mesas y el video final con los recuerdos de todos.", meta: "RSVP · menús · recuerdos" },
    { ico: "🎂", name: "Cumpleaños", desc: "Desde una sorpresa de 40 personas hasta una fiesta de 300, con lista siempre ordenada.", meta: "RSVP · +1 · playlist" },
    { ico: "🏢", name: "Eventos corporativos", desc: "Cupos, acreditación con QR, agenda por bloques, recordatorios y encuesta post evento.", meta: "Cupos · check-in · NPS" },
    { ico: "🎓", name: "Graduaciones", desc: "Entradas por alumno, accesos preferenciales, instrucciones de ingreso y fotos de familias.", meta: "Entradas · accesos" },
    { ico: "👶", name: "Baby showers", desc: "Confirmaciones, lista de regalos, juegos y mensajes grabados para el bebé.", meta: "RSVP · juegos · cápsulas" },
    { ico: "👑", name: "Quinceañeros", desc: "Invitación digital, coreografías, dinámicas por mesa y ranking entre grupos.", meta: "RSVP · juegos en vivo" },
    { ico: "🎤", name: "Conferencias y ferias", desc: "Inscripción, confirmación por WhatsApp, agenda personalizada y preguntas al panel.", meta: "Inscripción · agenda" },
    { ico: "🥂", name: "Aniversarios y galas", desc: "Protocolo, ubicaciones, brindis, discursos y el resumen visual del evento.", meta: "Mesas · protocolo" },
  ];
  return (
    <section className="section" id="eventos">
      <div className="wrap">
        <div className="sec-head sec-head--center">
          <span className="eyebrow" style={{ justifyContent: "center", display: "inline-flex" }}>Un solo sistema, todos los eventos</span>
          <h2>Si tiene invitados, <span className="grad-text">Invitia lo organiza.</span></h2>
          <p>
            El mismo motor de invitaciones, confirmaciones y recuerdos se adapta
            al tipo de evento: cambian los campos, los mensajes y las dinámicas,
            no la experiencia.
          </p>
        </div>
        <div className="types-grid">
          {types.map((t, i) => (
            <div className="type-card" key={i}>
              <div className="type-card__ico">{t.ico}</div>
              <h4>{t.name}</h4>
              <p>{t.desc}</p>
              <div className="type-card__meta">{t.meta}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ----- BANNER FOTO -----
function Banner() {
  return (
    <section className="banner" aria-label="Celebración">
      <div className="banner__photo" role="img" aria-label="Invitados celebrando"></div>
      <div className="banner__veil"></div>
      <div className="banner__content">
        <span className="eyebrow">Hecho para eventos reales</span>
        <h2 className="banner__title">
          La tecnología desaparece. <span className="grad-text">El evento</span> es lo que queda.
        </h2>
        <p className="banner__sub">
          Invitia es software, sí — pero está hecho para días que no se tratan de
          pantallas. Por eso vive en WhatsApp, donde ya están tus invitados, y
          trabaja en silencio para que tú vivas el momento.
        </p>
      </div>
    </section>
  );
}

// ----- PROBLEMA -----
function Problem() {
  const items = [
    "Invitados que no confirman a tiempo.",
    "Las mismas preguntas, todos los días, en chats distintos.",
    "Menús, acompañantes, cupos y restricciones imposibles de consolidar.",
    "Cambios de última hora que no llegan a todos.",
    "Listas en Excel que quedan desactualizadas el mismo día que las armaste.",
    "Cientos de fotos y videos perdidos en los celulares de tus invitados.",
  ];
  return (
    <section className="section">
      <div className="wrap">
        <div className="problem-grid">
          <div>
            <span className="eyebrow">El problema real</span>
            <h2 style={{ fontSize: "clamp(32px, 3.9vw, 50px)", lineHeight: 1.06, margin: "14px 0 18px" }}>
              Producir un evento no debería significar <span className="grad-text">perseguir invitados</span> por WhatsApp.
            </h2>
            <p style={{ fontSize: 18, color: "var(--gris)", lineHeight: 1.6 }}>
              Entre confirmaciones, acompañantes, cupos, menús, accesos y cambios
              de último minuto, quien organiza termina gastando su energía en
              tareas que se pueden automatizar.
            </p>
            <p style={{ fontSize: 18, color: "var(--gris)", lineHeight: 1.6, marginTop: 14 }}>
              Invitia ordena todo el proceso para que puedas{" "}
              <strong style={{ color: "var(--ink)" }}>disfrutar más y perseguir menos</strong>.
            </p>
          </div>
          <div className="problem-list">
            {items.map((t, i) => (
              <div className="problem-item" key={i}>
                <div className="problem-item__x">✕</div>
                <div className="problem-item__txt">{t}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ----- SOLUCIÓN -----
function Solution() {
  return (
    <section className="section section--lila">
      <div className="wrap">
        <div className="sec-head sec-head--center">
          <span className="eyebrow" style={{ justifyContent: "center", display: "inline-flex" }}>La solución</span>
          <h2>Una experiencia conectada <span className="grad-text">antes, durante y después</span> del evento.</h2>
          <p>
            Invitia centraliza la comunicación con los invitados por WhatsApp y
            convierte cada interacción en información útil para tu organización.
          </p>
        </div>
        <div className="solution-grid">
          <div className="sol-card">
            <div className="sol-card__phase"><span className="pill pill--coral">Antes</span></div>
            <h3>La logística, automatizada</h3>
            <p>Invitaciones, confirmaciones, acompañantes, cupos, selección de menú, restricciones y recordatorios automáticos.</p>
            <ul>
              <li>Invitaciones personalizadas</li>
              <li>Confirmación en 2 toques</li>
              <li>Recordatorios inteligentes</li>
              <li>Asistente que responde dudas</li>
            </ul>
          </div>
          <div className="sol-card">
            <div className="sol-card__phase"><span className="pill pill--magenta">Durante</span></div>
            <h3>El evento, en otro nivel</h3>
            <p>Acreditación, mensajes en vivo, juegos por mesa o grupo, votaciones, instrucciones y cápsulas de video.</p>
            <ul>
              <li>Check-in y acreditación</li>
              <li>Trivias y votaciones</li>
              <li>Ranking entre mesas o equipos</li>
              <li>Mensajes segmentados</li>
            </ul>
          </div>
          <div className="sol-card">
            <div className="sol-card__phase"><span className="pill">Después</span></div>
            <h3>Los recuerdos, eternos</h3>
            <p>Recolección de fotos, videos y mensajes para crear el video final, el álbum digital y el resumen del evento.</p>
            <ul>
              <li>Link privado para subir</li>
              <li>Video editado final</li>
              <li>Álbum digital</li>
              <li>Reporte o libro físico</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ----- CÓMO FUNCIONA -----
function HowItWorks() {
  const steps = [
    {
      title: "Cargamos tu lista de invitados",
      body: "Nombres, teléfonos, acompañantes permitidos, cupos, grupos o mesas y preferencias. Tú nos pasas el Excel — nosotros lo ordenamos.",
      visual: (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong style={{ fontSize: 14 }}>Invitados.xlsx</strong>
            <span style={{ fontSize: 11, color: "var(--violeta-deep)", background: "var(--lila-2)", padding: "4px 10px", borderRadius: 999, fontWeight: 600 }}>Importado</span>
          </div>
          <div style={{ borderTop: "1px solid var(--line)", marginTop: 8 }}>
            {[
              ["Valentina Pérez", "+56 9 5421 ····", "+1", "Tradicional"],
              ["Mateo Fernández", "+56 9 9821 ····", "+1", "Vegetariano"],
              ["Sofía Rojas", "+56 9 6712 ····", "sin", "Vegano"],
              ["Diego Castro", "+56 9 7140 ····", "+1", "Sin gluten"],
              ["Antonia Vidal", "+56 9 8830 ····", "+2", "Tradicional"],
            ].map(([n, t, a, m], i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1.4fr 1.2fr .6fr 1fr", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--line)", fontSize: 13, alignItems: "center" }}>
                <span>{n}</span>
                <span style={{ color: "var(--gris)", fontFamily: "JetBrains Mono, monospace", fontSize: 11 }}>{t}</span>
                <span style={{ color: "var(--violeta)", fontWeight: 600 }}>{a}</span>
                <span style={{ color: "var(--gris)" }}>{m}</span>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      title: "Enviamos la invitación por WhatsApp",
      body: "Cada invitado recibe una invitación personalizada con botones para confirmar, registrar acompañante, elegir menú, reservar cupo o preguntar.",
      visual: (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", transform: "scale(0.82)", transformOrigin: "center" }}>
          <PhoneChat evt={EVENTS[2]} compact />
        </div>
      ),
    },
    {
      title: "Ves todo en tiempo real",
      body: "El dashboard muestra confirmados, pendientes, acompañantes, cupos, menús, restricciones, mesas y consultas abiertas.",
      visual: (
        <>
          <div className="kpi-row" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
            <div className="kpi"><div className="kpi__lbl">Confirmados</div><div className="kpi__num">184</div></div>
            <div className="kpi kpi--accent"><div className="kpi__lbl">Pendientes</div><div className="kpi__num">36</div></div>
            <div className="kpi"><div className="kpi__lbl">Vegetarianos</div><div className="kpi__num">22</div></div>
            <div className="kpi"><div className="kpi__lbl">Acompañantes</div><div className="kpi__num">42</div></div>
          </div>
          <div className="panel" style={{ marginTop: 4 }}>
            <h4>Preferencias</h4>
            <div className="menu-bars">
              <MenuBar name="Tradicional" value={138} max={184} cls="" />
              <MenuBar name="Vegetariano" value={22} max={184} cls="menu-bar__fill--magenta" />
              <MenuBar name="Sin gluten" value={6} max={184} cls="menu-bar__fill--coral" />
            </div>
          </div>
        </>
      ),
    },
    {
      title: "Activamos la experiencia del evento",
      body: "El día del evento, Invitia acredita invitados, envía mensajes, activa juegos, votaciones y solicitudes de cápsulas de video.",
      visual: (
        <>
          <div style={{ padding: "14px 16px", borderRadius: 14, background: "var(--lila)", border: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 16 }}>Misión enviada</div>
              <div style={{ fontSize: 13, color: "var(--gris)" }}>"Graba el momento más prendido de tu mesa"</div>
            </div>
            <span style={{ fontSize: 11, background: "var(--lila-2)", color: "var(--violeta-deep)", padding: "4px 10px", borderRadius: 999, fontWeight: 600 }}>21:45</span>
          </div>
          <div style={{ padding: "14px 16px", borderRadius: 14, background: "var(--lila)", border: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 16 }}>Votación abierta</div>
              <div style={{ fontSize: 13, color: "var(--gris)" }}>"Próxima canción de la noche"</div>
            </div>
            <span style={{ fontSize: 11, background: "rgba(255,111,69,0.16)", color: "#C24A24", padding: "4px 10px", borderRadius: 999, fontWeight: 600 }}>en vivo</span>
          </div>
          <div style={{ padding: "14px 16px", borderRadius: 14, background: "var(--lila)", border: "1px solid var(--line)" }}>
            <div style={{ fontSize: 12, color: "var(--gris)", marginBottom: 6 }}>Ranking de mesas</div>
            {[["Mesa 8", 92], ["Mesa 3", 78], ["Mesa 11", 64]].map(([n, v], i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "60px 1fr 40px", gap: 10, alignItems: "center", marginTop: 6, fontSize: 13 }}>
                <span>{n}</span>
                <div className="menu-bar__track"><div className="menu-bar__fill" style={{ width: v + "%" }}></div></div>
                <span style={{ textAlign: "right", fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      title: "Creamos tus recuerdos finales",
      body: "Después del evento reunimos fotos, videos y mensajes de los invitados para entregarte un video editado, un álbum digital y el resumen del evento.",
      visual: (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} style={{
                aspectRatio: "1",
                background: i % 3 === 0 ? "linear-gradient(135deg, #FFB79E, var(--coral))"
                  : i % 3 === 1 ? "linear-gradient(135deg, #F8A9D4, var(--magenta))"
                    : "linear-gradient(135deg, #B79BF2, var(--violeta))",
                borderRadius: 10,
                opacity: 0.55 + i / 24,
                position: "relative",
              }}>
                {i === 4 && (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.94)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 0, height: 0, borderLeft: "8px solid var(--ink)", borderTop: "5px solid transparent", borderBottom: "5px solid transparent", marginLeft: 2 }}></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6, fontSize: 13, gap: 10, flexWrap: "wrap" }}>
            <span style={{ color: "var(--gris)" }}>312 fotos · 74 videos · 96 mensajes</span>
            <span className="grad-text" style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700 }}>Video final listo →</span>
          </div>
        </>
      ),
    },
  ];

  const [active, setActive] = useState(0);

  return (
    <section className="section" id="como-funciona">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">Cómo funciona</span>
          <h2>Cinco pasos. <span className="grad-text">Cero estrés.</span></h2>
          <p>De la lista de invitados al video final — todo orquestado por Invitia, sea cual sea tu evento.</p>
        </div>
        <div className="howit">
          <div className="howit__steps">
            {steps.map((s, i) => (
              <button
                key={i}
                className={`howit__step${i === active ? " howit__step--active" : ""}`}
                onClick={() => setActive(i)}
              >
                <span className="howit__num">{i + 1}</span>
                <span>
                  <h4>{s.title}</h4>
                  <p>{s.body}</p>
                </span>
              </button>
            ))}
          </div>
          <div className="howit__visual" key={active}>
            {steps[active].visual}
          </div>
        </div>
      </div>
    </section>
  );
}

// ----- MÓDULOS -----
function Modules() {
  const mods = [
    {
      tag: "Módulo 01",
      sub: "RSVP",
      kicker: "Invitaciones y confirmaciones por WhatsApp",
      desc: "El módulo base que reemplaza las planillas, los WhatsApp dispersos y las llamadas de seguimiento.",
      list: ["Invitación personalizada", "Confirmación de asistencia", "Acompañantes y cupos", "Selección de menú", "Restricciones alimentarias", "Recordatorios automáticos", "Lista de pendientes", "Dashboard en tiempo real"],
      cls: "module--rsvp",
      glyph: <Icon.Chat />,
    },
    {
      tag: "Módulo 02",
      sub: "Flow",
      kicker: "Comunicación inteligente con tus invitados",
      desc: "Mensajes automáticos según el estado de cada invitado, segmentación por grupo o mesa, y un asistente que contesta lo repetitivo.",
      list: ["Recordatorios previos", "Comunicaciones masivas", "Segmentación por grupo", "Mensajes según estado", "Asistente virtual de FAQ", "Derivación a una persona", "Avisos de último minuto", "Encuestas post evento"],
      cls: "module--flow",
      glyph: <Icon.Sparkle />,
    },
    {
      tag: "Módulo 03",
      sub: "Live",
      kicker: "Acreditación y experiencias durante el evento",
      desc: "Convierte tu evento en algo participativo: check-in ágil, trivias, votaciones, ranking de mesas y misiones que activan a los invitados.",
      list: ["Check-in y acreditación", "Juegos por mesa o equipo", "Trivia del anfitrión", "Votaciones en vivo", "Capitanes de mesa", "Desafíos de fotos", "Mensajes sorpresa", "Agenda por bloques"],
      cls: "module--live",
      glyph: <Icon.Game />,
    },
    {
      tag: "Módulo 04",
      sub: "Memories",
      kicker: "Recuerdos, fotos, videos y cápsulas",
      desc: "Lo que tus invitados graban con su celular se transforma en un recuerdo curado, editado y entregado.",
      list: ["Link privado para subir", "Cápsulas de video", "Mensajes para el anfitrión", "Curatoría del material", "Video final editado", "Álbum digital", "Event Wrapped", "Libro o reporte físico"],
      cls: "module--mem",
      glyph: <Icon.Camera />,
    },
  ];
  return (
    <section className="section" id="modulos">
      <div className="wrap">
        <div className="sec-head sec-head--center">
          <span className="eyebrow" style={{ justifyContent: "center", display: "inline-flex" }}>Módulos del servicio</span>
          <h2>Todo lo que necesitas para conectar tu evento.</h2>
          <p>Cuatro piezas que se complementan. Empieza por la que necesitas hoy y crece a tu ritmo.</p>
        </div>
        <div className="modules-grid">
          {mods.map((m, i) => (
            <div className={`module ${m.cls}`} key={i}>
              <div className="module__tag">{m.tag}</div>
              <h3>Invitia<span className="accent"> {m.sub}</span></h3>
              <div className="module__glyph">{m.glyph}</div>
              <div className="module__kicker">{m.kicker}</div>
              <p>{m.desc}</p>
              <ul className="module__list">
                {m.list.map((it, j) => <li key={j}>{it}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ----- SECCIÓN DASHBOARD -----
function DashboardSection() {
  return (
    <section className="section section--lila">
      <div className="wrap">
        <div className="sec-head sec-head--center">
          <span className="eyebrow" style={{ justifyContent: "center", display: "inline-flex" }}>Dashboard en vivo</span>
          <h2>Toda la información importante <span className="grad-text">en un solo lugar.</span></h2>
          <p>Ve el estado real de tus invitados sin revisar cientos de mensajes. Confirma, ajusta y comunica desde una sola pantalla.</p>
        </div>
        <Dashboard />
      </div>
    </section>
  );
}

// ----- DIFERENCIAL EMOCIONAL -----
function Differential({ onCTA }) {
  return (
    <section className="diff" id="recuerdos">
      <div className="wrap">
        <div className="diff__grid">
          <div>
            <span className="eyebrow">El diferencial</span>
            <h2 style={{ marginTop: 14 }}>El fotógrafo captura el evento. <span className="grad-text">Tus invitados capturan la historia real.</span></h2>
            <p>
              Hay momentos que no siempre aparecen en las fotos oficiales: la
              risa de una mesa, el mensaje de un amigo, un video espontáneo en la
              pista, el saludo grabado por alguien que no alcanzó a llegar.
            </p>
            <div className="diff__quote">
              Invitia reúne esas miradas y las transforma en un recuerdo vivo, emocional y auténtico.
            </div>
            <div className="diff__cta">
              <Button variant="primary" size="lg" onClick={onCTA}>Quiero capturar esos recuerdos <Icon.Arrow /></Button>
            </div>
          </div>
          <div className="collage">
            <div className="coll-card coll-1">
              <div className="coll-card__img coll-photo-1"><span>21:48 · pista</span></div>
              <div className="coll-card__cap">video — mesa 8</div>
            </div>
            <div className="coll-card coll-2">
              <div className="coll-card__img coll-photo-2"><span>brindis</span></div>
              <div className="coll-card__cap">foto — Valentina P.</div>
            </div>
            <div className="coll-card coll-3">
              <div className="coll-card__img coll-photo-3"><span>cápsula 00:42</span></div>
              <div className="coll-card__cap">mensaje — Mateo F.</div>
            </div>
            <div className="coll-card coll-4">
              <div className="coll-card__img coll-photo-4"><span>backstage</span></div>
              <div className="coll-card__cap">foto — Antonia V.</div>
            </div>
            <div className="coll-msg">
              "Gracias por invitarnos a esto. No me lo habría perdido por nada."
            </div>
            <div className="coll-play"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ----- JUEGOS -----
function Games() {
  const games = [
    { num: "01", title: "Trivia del anfitrión", desc: "Preguntas sobre la historia de quien celebra, para romper el hielo entre invitados.", viz: "¿En qué año se conocieron Camila y Diego?" },
    { num: "02", title: "Ranking de mesas", desc: "Cada mesa o equipo compite con desafíos, fotos y respuestas.", viz: "🏆 Mesa 8 · 92 pts" },
    { num: "03", title: "Cápsulas del momento", desc: "Los invitados graban mensajes según la etapa del evento.", viz: "● rec 00:34 · Mesa 11" },
    { num: "04", title: "Mensajes para el anfitrión", desc: "Consejos, deseos o dedicatorias — emotivos, divertidos o sabios.", viz: "96 mensajes recibidos" },
    { num: "05", title: "Votaciones en vivo", desc: "Canciones, premios, mejor foto, mesa más prendida, mejor disfraz.", viz: "Próxima canción · 42 votos" },
    { num: "06", title: "Cápsula del tiempo", desc: "Mensajes que se abren en el próximo aniversario del evento.", viz: "Se abre · 14 dic 2027" },
  ];
  return (
    <section className="section">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">Juegos y dinámicas</span>
          <h2>Haz que tus invitados también sean parte de la <span className="grad-text">experiencia.</span></h2>
          <p>Dinámicas lúdicas antes y durante el evento para que los invitados participen, interactúen y creen recuerdos juntos.</p>
        </div>
        <div className="games-grid">
          {games.map((g, i) => (
            <div className="game" key={i}>
              <span className="game__num">{g.num}</span>
              <h4>{g.title}</h4>
              <p>{g.desc}</p>
              <div className="game__viz">{g.viz}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ----- CÁPSULAS -----
function Capsules() {
  const caps = [
    { lbl: "Antes", q: "¿Qué le deseas al anfitrión?", n: "1" },
    { lbl: "Llegada", q: "¿Cómo conoces a quien celebra?", n: "2" },
    { lbl: "Momento clave", q: "¿Qué sentiste en la ceremonia?", n: "3" },
    { lbl: "Cena", q: "Un consejo para lo que viene", n: "4" },
    { lbl: "Fiesta", q: "El momento más prendido de tu mesa", n: "5" },
    { lbl: "Cierre", q: "Tu último mensaje antes de irte", n: "6" },
    { lbl: "Día sgte.", q: "Sube tus mejores fotos y videos", n: "7" },
  ];
  return (
    <section className="section section--durazno">
      <div className="wrap">
        <div className="sec-head sec-head--center">
          <span className="eyebrow" style={{ justifyContent: "center", display: "inline-flex" }}>Cápsulas de video</span>
          <h2>Mensajes espontáneos <span className="grad-text">en cada etapa</span> del evento.</h2>
          <p>Durante el evento, Invitia envía pequeñas misiones a los invitados para grabar videos cortos según el momento.</p>
        </div>
        <div className="caps">
          {caps.map((c, i) => (
            <div className="caps__item" key={i}>
              <div className="caps__dot">{c.n}</div>
              <div className="caps__lbl">{c.lbl}</div>
              <div className="caps__q">"{c.q}"</div>
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", fontFamily: "Plus Jakarta Sans", fontWeight: 600, fontSize: 22, color: "var(--ink-3)", maxWidth: 680, margin: "56px auto 0", lineHeight: 1.4, letterSpacing: "-0.02em" }}>
          Algunas cápsulas serán emotivas. Otras desordenadas.{" "}
          <span className="grad-text">Todas serán inolvidables.</span>
        </p>
      </div>
    </section>
  );
}

// ----- EVENT WRAPPED -----
function Wrapped() {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="wrapped">
          <div className="wrapped__grid">
            <div>
              <span className="eyebrow">Event Wrapped</span>
              <h2 style={{ marginTop: 14 }}>Tu evento en <span className="grad-text">números, recuerdos y momentos.</span></h2>
              <p>Después del evento, Invitia entrega un resumen visual con los hitos: participación, momentos más capturados y highlights. Para revivirlo, compartirlo o presentarlo a tu cliente.</p>
              <div style={{ marginTop: 30 }}>
                <Button variant="light">Ver ejemplo completo <Icon.Arrow /></Button>
              </div>
            </div>
            <div className="wrapped__stats">
              <div className="wstat"><div className="wstat__num">240</div><div className="wstat__lbl">Invitados</div></div>
              <div className="wstat"><div className="wstat__num">184</div><div className="wstat__lbl">Confirmados</div></div>
              <div className="wstat"><div className="wstat__num">312</div><div className="wstat__lbl">Fotos recibidas</div></div>
              <div className="wstat"><div className="wstat__num">96</div><div className="wstat__lbl">Mensajes al anfitrión</div></div>
              <div className="wstat wstat--full">
                <div>
                  <div className="wstat__role">Mesa más prendida</div>
                  <div className="wstat__num">Mesa 8</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="wstat__role">Canción más pedida</div>
                  <div className="wstat__num">September</div>
                </div>
              </div>
              <div className="wstat wstat--full">
                <div>
                  <div className="wstat__role">Momento más fotografiado</div>
                  <div className="wstat__num">El brindis</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="wstat__role">Invitada más participativa</div>
                  <div className="wstat__num">Valentina P.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ----- B2B: ORGANIZADORES -----
function Organizers({ onCTA }) {
  const bens = [
    "Menos seguimiento manual por evento",
    "Dashboard centralizado por cliente",
    "Mejor control de confirmaciones y cupos",
    "Comunicación directa con los invitados",
    "Acreditación y check-in sin filas",
    "Experiencias interactivas en vivo",
    "Recuerdos post evento como upsell",
    "Reporte de resultados para tu cliente",
    "Diferenciación frente a otras productoras",
    "Modelo white label o co-brandeado",
  ];
  return (
    <section className="section section--ink" id="organizadores">
      <div className="wrap">
        <div className="b2b">
          <div>
            <span className="eyebrow">Para productoras y organizadores</span>
            <h2 style={{ marginTop: 14, fontSize: "clamp(32px, 3.9vw, 48px)", lineHeight: 1.06 }}>
              Una capa <span className="grad-text">premium</span> para productoras, agencias y wedding planners.
            </h2>
            <p style={{ marginTop: 18, color: "rgba(255,255,255,0.72)", fontSize: 17, lineHeight: 1.65, maxWidth: 480 }}>
              Invitia le permite a quien produce eventos sumar una capa
              tecnológica y emocional a cada proyecto — reduciendo carga
              operativa, elevando la experiencia del invitado y entregando
              evidencia del resultado al cliente final.
            </p>
            <div style={{ marginTop: 32 }}>
              <Button variant="primary" size="lg" onClick={onCTA}>Quiero ofrecer Invitia a mis clientes <Icon.Arrow /></Button>
            </div>
          </div>
          <div className="b2b__ben">
            {bens.map((b, i) => <div className="b2b__item" key={i}>{b}</div>)}
          </div>
        </div>
      </div>
    </section>
  );
}

// ----- PLANES -----
function Plans({ onCTA }) {
  const plans = [
    {
      name: "Esencial",
      sub: "Para quien necesita ordenar confirmaciones y logística.",
      from: "Cotización",
      inc: [
        "Carga de invitados",
        "Invitación por WhatsApp",
        "Confirmación de asistencia",
        "Acompañantes y cupos",
        "Selección de menú",
        "Recordatorios automáticos",
        "Dashboard básico",
      ],
      cta: "Cotizar Esencial",
    },
    {
      name: "Experiencia Completa",
      sub: "Para eventos que además quieren comunicación y experiencia en vivo.",
      from: "Cotización",
      featured: true,
      inc: [
        "Todo lo del plan Esencial",
        "Asistente virtual de FAQ",
        "Comunicaciones masivas y segmentadas",
        "Acreditación y check-in",
        "Mensajes el día del evento",
        "Capitanes de mesa o grupo",
        "Juegos, trivias y votaciones",
        "Dashboard avanzado",
      ],
      cta: "Cotizar Experiencia Completa",
    },
    {
      name: "Memories Premium",
      sub: "Para eventos que quieren capturar fotos, videos, cápsulas y recuerdos.",
      from: "Premium",
      inc: [
        "Todo lo del plan Experiencia",
        "Link privado para subir contenido",
        "Cápsulas de video de invitados",
        "Mensajes para el anfitrión",
        "Curatoría del material",
        "Video editado final",
        "Álbum digital",
        "Event Wrapped + libro físico",
      ],
      cta: "Cotizar Memories Premium",
    },
  ];
  return (
    <section className="section" id="planes">
      <div className="wrap">
        <div className="sec-head sec-head--center">
          <span className="eyebrow" style={{ justifyContent: "center", display: "inline-flex" }}>Planes</span>
          <h2>Tres caminos. <span className="grad-text">Todos personalizables.</span></h2>
          <p>El precio depende del tipo de evento, la fecha, la cantidad de invitados y los módulos. Cotizamos cada evento a medida.</p>
        </div>
        <div className="plans-grid">
          {plans.map((p, i) => (
            <div className={`plan${p.featured ? " plan--featured" : ""}`} key={i}>
              {p.featured && <div className="plan__pill">Más elegido</div>}
              <h3>{p.name}</h3>
              <p className="plan__sub">{p.sub}</p>
              <div className="plan__price">
                <strong>{p.from}</strong>
                <span>según invitados, fecha y tipo de evento</span>
              </div>
              <ul className="plan__inc">
                {p.inc.map((it, j) => <li key={j}>{it}</li>)}
              </ul>
              <Button variant={p.featured ? "primary" : "ghost"} onClick={onCTA}>{p.cta} <Icon.Arrow /></Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ----- FAQ -----
function FAQ() {
  const faqs = [
    { q: "¿Sirve para cualquier tipo de evento?", a: "Sí. Invitia se usa en matrimonios, cumpleaños, eventos corporativos, graduaciones, baby showers, quinceañeros, conferencias, aniversarios y celebraciones privadas. Cambian los campos, los mensajes y las dinámicas — el sistema es el mismo." },
    { q: "¿Los invitados tienen que descargar una app?", a: "No. Toda la experiencia ocurre por WhatsApp y links simples. Nada que instalar, ni para ti ni para tus invitados." },
    { q: "¿Podemos enviar la invitación oficial por Invitia?", a: "Sí. Enviamos una invitación personalizada por WhatsApp con botones para confirmar asistencia, registrar acompañante, elegir menú, reservar cupo o hacer preguntas." },
    { q: "¿Qué pasa si un invitado no responde?", a: "Invitia envía recordatorios automáticos solo a quienes están pendientes — sin molestar a los que ya confirmaron." },
    { q: "¿Puedo ver quién confirmó?", a: "Sí. Tienes un dashboard en tiempo real con confirmados, pendientes, acompañantes, cupos, menús y restricciones alimentarias." },
    { q: "¿Sirve para acreditar gente el día del evento?", a: "Sí. Para eventos corporativos, conferencias o graduaciones habilitamos check-in con código único por invitado y control de aforo en tiempo real." },
    { q: "¿Los invitados pueden hacer preguntas?", a: "Sí. Escriben por WhatsApp y el asistente responde las preguntas frecuentes. Si la consulta requiere revisión humana, se deriva a tu equipo." },
    { q: "¿Podemos mandar mensajes el día del evento?", a: "Sí. Se pueden enviar mensajes masivos o segmentados — ubicación, horarios, número de mesa, cambios de sala, instrucciones o dinámicas." },
    { q: "¿Qué tipo de contenido pueden subir los invitados?", a: "Fotos, videos, mensajes escritos, audios y cápsulas de video. Todo se centraliza en un solo lugar y se entrega curado." },
    { q: "¿Invitia reemplaza al fotógrafo?", a: "No. Lo complementa. El fotógrafo captura la mirada profesional; Invitia captura la mirada espontánea de los invitados." },
    { q: "¿Se puede usar con productoras o agencias?", a: "Sí. Invitia trabaja directamente con anfitriones, productoras, agencias y wedding planners. Hay un modelo white label disponible." },
    { q: "¿Cuánto tiempo antes conviene contratarlo?", a: "Idealmente entre 2 y 4 meses antes, aunque podemos implementar en menos tiempo si la lista de invitados ya está ordenada." },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section className="section" id="faq">
      <div className="wrap">
        <div className="sec-head sec-head--center">
          <span className="eyebrow" style={{ justifyContent: "center", display: "inline-flex" }}>Preguntas frecuentes</span>
          <h2>Todo lo que <span className="grad-text">siempre</span> nos preguntan.</h2>
        </div>
        <div className="faq-list">
          {faqs.map((f, i) => (
            <div className={`faq-item${i === open ? " faq-item--open" : ""}`} key={i}>
              <button className="faq-q" onClick={() => setOpen(i === open ? -1 : i)}>
                {f.q}
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-a">{f.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ----- FOOTER -----
function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot__grid">
          <div className="foot__brand">
            <img src="assets/logo-light.png" alt="Invitia" />
            <div className="foot__tag">Todo tu evento, a un click.</div>
            <p>
              Invitia conecta a los anfitriones con sus invitados antes, durante
              y después de cualquier evento — transformando la organización y los
              recuerdos en una experiencia simple, emocional y memorable.
            </p>
          </div>
          <div>
            <h5>Producto</h5>
            <ul>
              <li><a href="#eventos">Tipos de evento</a></li>
              <li><a href="#como-funciona">Cómo funciona</a></li>
              <li><a href="#modulos">Módulos</a></li>
              <li><a href="#recuerdos">Recuerdos</a></li>
              <li><a href="#planes">Planes</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h5>Para</h5>
            <ul>
              <li><a href="#contacto">Anfitriones</a></li>
              <li><a href="#organizadores">Productoras y agencias</a></li>
              <li><a href="#organizadores">Wedding planners</a></li>
              <li><a href="#organizadores">Empresas</a></li>
              <li><a href="#contacto">Agendar demo</a></li>
            </ul>
          </div>
          <div>
            <h5>Contacto</h5>
            <ul>
              <li><a href="#contacto">hola@invitia.cl</a></li>
              <li><a href="#contacto">WhatsApp +56 9 0000 0000</a></li>
              <li><a href="#contacto">Instagram @invitia</a></li>
            </ul>
          </div>
        </div>
        <div className="foot__copy">
          <span>© 2026 Invitia · Hecho con cariño en Chile</span>
          <span style={{ display: "flex", gap: 16 }}>
            <a href="#top">Términos y condiciones</a>
            <a href="#top">Política de privacidad</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  Nav, Hero, Marquee, ClaimBand, EventTypes, Banner, Problem, Solution,
  HowItWorks, Modules, DashboardSection, Differential, Games, Capsules,
  Wrapped, Organizers, Plans, FAQ, Footer,
});

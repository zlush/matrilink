// ========== Landing Page Sections ==========

// ----- NAV -----
function Nav({ onCTA }) {
  return (
    <nav className="nav">
      <div className="nav__inner">
        <LogoWordmark />
        <div className="nav__links">
          <a href="#como-funciona">Cómo funciona</a>
          <a href="#modulos">Módulos</a>
          <a href="#recuerdos">Recuerdos</a>
          <a href="#planners">Wedding planners</a>
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

// ----- HERO -----
function Hero({ onCTA }) {
  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero__grid">
          <div>
            <span className="eyebrow">Para novios &amp; wedding planners</span>
            <h1 className="hero__title">
              Organiza a tus invitados y transforma sus recuerdos en una <em>historia inolvidable.</em>
            </h1>
            <p className="hero__sub">
              MatriLink conecta tu matrimonio con tus invitados por WhatsApp:
              invitaciones, confirmaciones, recordatorios, preguntas frecuentes,
              juegos, fotos, videos y cápsulas espontáneas en un solo lugar.
            </p>
            <div className="hero__cta">
              <Button variant="primary" size="lg" onClick={onCTA}>Solicitar demo <Icon.Arrow /></Button>
              <Button variant="ghost" size="lg" href="#como-funciona">Ver cómo funciona</Button>
            </div>
            <div className="hero__trust">
              <span><strong>2.400+</strong> invitaciones enviadas</span>
              <span><strong>94%</strong> tasa de confirmación promedio</span>
              <span><strong>Sin descargas</strong> para tus invitados</span>
            </div>
          </div>
          <div className="hero__visual">
            <HeroFloats />
            <PhoneChat />
          </div>
        </div>
      </div>
    </section>
  );
}

// ----- CLAIM BAND -----
function ClaimBand() {
  return (
    <div className="claim-band">
      <div className="claim-band__inner">
        <span>Antes del matrimonio<span className="claim-band__dot"></span></span>
        <span>Durante la fiesta<span className="claim-band__dot"></span></span>
        <span>Y todos los recuerdos después</span>
      </div>
    </div>
  );
}

// ----- WEDDING BANNER (full-bleed photo) -----
function WeddingBanner() {
  return (
    <section className="wed-banner" aria-label="Foto de matrimonio">
      <div className="wed-banner__photo" role="img" aria-label="Pareja en su matrimonio"></div>
      <div className="wed-banner__veil"></div>
      <div className="wed-banner__content wrap">
        <span className="eyebrow" style={{color: 'var(--champagne-soft)'}}>Hecho para matrimonios reales</span>
        <h2 className="wed-banner__title">
          La tecnología desaparece. <em>El matrimonio</em> es lo que queda.
        </h2>
        <p className="wed-banner__sub">
          MatriLink es una app, sí — pero está hecha para un día que no se trata
          de pantallas. Por eso vive en WhatsApp, donde ya están tus invitados,
          y trabaja en silencio para que ustedes vivan el momento.
        </p>
      </div>
    </section>
  );
}

// ----- PROBLEM -----
function Problem() {
  const items = [
    "Invitados que no confirman a tiempo.",
    "Las mismas preguntas, todos los días, en chats distintos.",
    "Menús, acompañantes y restricciones difíciles de consolidar.",
    "Cambios de última hora que no llegan a tiempo.",
    "Cientos de fotos y videos perdidos en celulares de invitados.",
    "Grupos de WhatsApp imposibles de ordenar."
  ];
  return (
    <section className="section">
      <div className="wrap">
        <div className="problem-grid">
          <div>
            <span className="eyebrow">El problema real</span>
            <h2 style={{ fontSize: 'clamp(34px, 4vw, 52px)', lineHeight: 1.05, margin: '14px 0 18px' }}>
              Organizar un matrimonio no debería significar <em style={{ color: 'var(--terracota)', fontStyle: 'italic' }}>perseguir invitados</em> por WhatsApp.
            </h2>
            <p style={{ fontSize: 18, color: 'var(--gris)', lineHeight: 1.6 }}>
              Entre confirmaciones, acompañantes, menús, restricciones y cambios
              de último minuto, los novios terminan gastando tiempo y energía en
              tareas que pueden automatizarse.
            </p>
            <p style={{ fontSize: 18, color: 'var(--gris)', lineHeight: 1.6, marginTop: 14 }}>
              MatriLink ordena todo el proceso para que puedas <strong style={{ color: 'var(--carbon)' }}>disfrutar más y preocuparte menos</strong>.
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

// ----- SOLUTION -----
function Solution() {
  return (
    <section className="section section--cream">
      <div className="wrap">
        <div className="sec-head sec-head--center">
          <span className="eyebrow" style={{justifyContent: 'center', display: 'inline-flex'}}>La solución</span>
          <h2>Una experiencia conectada <em>antes, durante y después</em> del matrimonio.</h2>
          <p>
            MatriLink centraliza la comunicación con los invitados por WhatsApp y
            convierte cada interacción en información útil para tu organización.
          </p>
        </div>
        <div className="solution-grid">
          <div className="sol-card">
            <div className="sol-card__phase"><span className="pill">Antes</span></div>
            <h3>La logística, automatizada</h3>
            <p>Invitaciones, confirmaciones, acompañantes, selección de menú, restricciones alimentarias y recordatorios automáticos.</p>
            <ul>
              <li>Invitaciones personalizadas</li>
              <li>RSVP en 2 toques</li>
              <li>Recordatorios inteligentes</li>
              <li>FAQ con asistente</li>
            </ul>
          </div>
          <div className="sol-card">
            <div className="sol-card__phase"><span className="pill" style={{background: 'var(--salvia-soft)', borderColor: 'var(--salvia)'}}>Durante</span></div>
            <h3>La fiesta, en otro nivel</h3>
            <p>Mensajes en vivo, juegos por mesa, votaciones, dinámicas, instrucciones, capitanes de mesa y cápsulas de video.</p>
            <ul>
              <li>Misiones por etapa</li>
              <li>Trivia y votaciones</li>
              <li>Ranking entre mesas</li>
              <li>Mensajes segmentados</li>
            </ul>
          </div>
          <div className="sol-card">
            <div className="sol-card__phase"><span className="pill" style={{background: 'rgba(200,121,91,0.12)', borderColor: 'var(--terracota)', color: 'var(--terracota-deep)'}}>Después</span></div>
            <h3>Los recuerdos, eternos</h3>
            <p>Recolección de fotos, videos, mensajes y cápsulas para crear el video final, álbum digital y libro del matrimonio.</p>
            <ul>
              <li>Link privado para subir</li>
              <li>Video editado final</li>
              <li>Álbum digital</li>
              <li>Libro físico opcional</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ----- HOW IT WORKS -----
function HowItWorks() {
  const steps = [
    {
      title: "Cargamos tu lista de invitados",
      body: "Nombres, teléfonos, acompañantes permitidos, mesas tentativas y preferencias. Tú nos pasas el Excel — nosotros lo ordenamos.",
      visual: (
        <>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <strong style={{fontSize: 14}}>Lista de invitados.xlsx</strong>
            <span style={{fontSize: 11, color: 'var(--salvia-deep)', background: 'var(--salvia-soft)', padding: '4px 10px', borderRadius: 999}}>Importado</span>
          </div>
          <div style={{borderTop: '1px solid var(--line)', marginTop: 8}}>
            {[
              ["Valentina Pérez","+56 9 5421 ····","+1","Tradicional"],
              ["Mateo Fernández","+56 9 9821 ····","+1","Vegetariano"],
              ["Sofía Rojas","+56 9 6712 ····","sin","Vegano"],
              ["Diego Castro","+56 9 7140 ····","+1","Sin gluten"],
              ["Antonia Vidal","+56 9 8830 ····","+2","Tradicional"],
            ].map(([n,t,a,m], i) => (
              <div key={i} style={{display: 'grid', gridTemplateColumns: '1.4fr 1.2fr .6fr 1fr', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--line)', fontSize: 13, alignItems: 'center'}}>
                <span>{n}</span>
                <span style={{color: 'var(--gris)', fontFamily: 'JetBrains Mono, monospace', fontSize: 11}}>{t}</span>
                <span style={{color: 'var(--champagne-deep)'}}>{a}</span>
                <span style={{color: 'var(--gris)'}}>{m}</span>
              </div>
            ))}
          </div>
        </>
      )
    },
    {
      title: "Enviamos la invitación por WhatsApp",
      body: "Cada invitado recibe una invitación personalizada con botones para confirmar, indicar acompañante, elegir menú o preguntar.",
      visual: <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', transform: 'scale(0.75)', transformOrigin: 'center'}}><PhoneChat /></div>
    },
    {
      title: "Ves todo en tiempo real",
      body: "El dashboard muestra confirmados, pendientes, acompañantes, menús, restricciones, mesas y consultas abiertas.",
      visual: (
        <>
          <div className="kpi-row" style={{gridTemplateColumns: 'repeat(2, 1fr)'}}>
            <div className="kpi"><div className="kpi__lbl">Confirmados</div><div className="kpi__num">184</div></div>
            <div className="kpi kpi--accent"><div className="kpi__lbl">Pendientes</div><div className="kpi__num">36</div></div>
            <div className="kpi"><div className="kpi__lbl">Vegetarianos</div><div className="kpi__num">22</div></div>
            <div className="kpi"><div className="kpi__lbl">Acompañantes</div><div className="kpi__num">42</div></div>
          </div>
          <div className="panel" style={{padding: 16, marginTop: 4}}>
            <h4>Menús</h4>
            <div className="menu-bars">
              <MenuBar name="Tradicional" value={138} max={184} cls="" />
              <MenuBar name="Vegetariano" value={22} max={184} cls="menu-bar__fill--salvia" />
              <MenuBar name="Sin gluten" value={6} max={184} cls="menu-bar__fill--terra" />
            </div>
          </div>
        </>
      )
    },
    {
      title: "Activamos la experiencia del evento",
      body: "Durante el matrimonio, MatriLink envía mensajes, juegos, desafíos, votaciones y solicitudes de cápsulas de video.",
      visual: (
        <>
          <div style={{padding: '14px 16px', borderRadius: 12, background: 'var(--marfil)', border: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
              <div style={{fontFamily: 'Playfair Display', fontStyle: 'italic', fontSize: 18}}>Misión enviada</div>
              <div style={{fontSize: 13, color: 'var(--gris)'}}>"Graba el momento más prendido de tu mesa"</div>
            </div>
            <span style={{fontSize: 11, background: 'var(--salvia-soft)', color: 'var(--salvia-deep)', padding: '4px 10px', borderRadius: 999}}>21:45</span>
          </div>
          <div style={{padding: '14px 16px', borderRadius: 12, background: 'var(--marfil)', border: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
              <div style={{fontFamily: 'Playfair Display', fontStyle: 'italic', fontSize: 18}}>Votación abierta</div>
              <div style={{fontSize: 13, color: 'var(--gris)'}}>"Próxima canción de la noche"</div>
            </div>
            <span style={{fontSize: 11, background: 'rgba(200, 121, 91, 0.18)', color: 'var(--terracota-deep)', padding: '4px 10px', borderRadius: 999}}>en vivo</span>
          </div>
          <div style={{padding: '14px 16px', borderRadius: 12, background: 'var(--marfil)', border: '1px solid var(--line)'}}>
            <div style={{fontSize: 12, color: 'var(--gris)', marginBottom: 6}}>Ranking de mesas</div>
            {[['Mesa 8', 92],['Mesa 3', 78],['Mesa 11', 64]].map(([n, v], i) => (
              <div key={i} style={{display: 'grid', gridTemplateColumns: '60px 1fr 40px', gap: 10, alignItems: 'center', marginTop: 6, fontSize: 13}}>
                <span>{n}</span>
                <div className="menu-bar__track"><div className="menu-bar__fill" style={{width: v + '%'}}></div></div>
                <span style={{textAlign: 'right', fontWeight: 500}}>{v}</span>
              </div>
            ))}
          </div>
        </>
      )
    },
    {
      title: "Creamos tus recuerdos finales",
      body: "Después del evento, reunimos fotos, videos y mensajes de los invitados para crear un video editado, álbum digital y libro de recuerdos.",
      visual: (
        <>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6}}>
            {Array.from({length: 9}).map((_, i) => (
              <div key={i} style={{
                aspectRatio: '1',
                background: i % 3 === 0 ? 'linear-gradient(135deg, var(--salvia-soft), var(--salvia))' :
                           i % 3 === 1 ? 'linear-gradient(135deg, var(--crema), var(--champagne))' :
                                         'linear-gradient(135deg, rgba(200,121,91,0.3), var(--terracota))',
                borderRadius: 8,
                opacity: 0.6 + (i / 18),
                position: 'relative',
              }}>
                {i === 4 && (
                  <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <div style={{width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <div style={{width: 0, height: 0, borderLeft: '8px solid var(--carbon)', borderTop: '5px solid transparent', borderBottom: '5px solid transparent', marginLeft: 2}}></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, fontSize: 13}}>
            <span style={{color: 'var(--gris)'}}>312 fotos · 74 videos · 96 mensajes</span>
            <span style={{fontFamily: 'Playfair Display', fontStyle: 'italic', color: 'var(--champagne-deep)'}}>Video final listo →</span>
          </div>
        </>
      )
    },
  ];

  const [active, setActive] = useState(0);

  return (
    <section className="section" id="como-funciona">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">Cómo funciona</span>
          <h2>Cinco pasos. <em>Cero estrés.</em></h2>
          <p>De la lista de invitados al video final del matrimonio — todo orquestado por MatriLink.</p>
        </div>
        <div className="howit">
          <div className="howit__steps">
            {steps.map((s, i) => (
              <button
                key={i}
                className={`howit__step${i === active ? ' howit__step--active' : ''}`}
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

// ----- MODULES -----
function Modules() {
  const mods = [
    {
      tag: "Módulo 01",
      title: "MatriLink",
      sub: "RSVP",
      kicker: "Invitaciones y confirmaciones por WhatsApp",
      desc: "El módulo base que reemplaza a las hojas de cálculo, los WhatsApp dispersos y las llamadas de seguimiento.",
      list: ["Invitación personalizada", "Confirmación de asistencia", "Registro de acompañante", "Selección de menú", "Restricciones alimentarias", "Recordatorios automáticos", "Lista de pendientes", "Dashboard en tiempo real"],
      cls: "module--rsvp",
      glyph: <Icon.Chat />,
    },
    {
      tag: "Módulo 02",
      title: "MatriLink",
      sub: "Flow",
      kicker: "Comunicación inteligente con tus invitados",
      desc: "Mensajes automáticos según el estado de cada invitado, segmentaciones por mesa o grupo, y un asistente que contesta lo repetitivo.",
      list: ["Recordatorios previos", "Comunicaciones masivas", "Segmentación por mesa", "Mensajes automáticos según estado", "Asistente virtual para FAQ", "Derivación a humanos cuando aplica"],
      cls: "module--flow",
      glyph: <Icon.Sparkle />,
    },
    {
      tag: "Módulo 03",
      title: "MatriLink",
      sub: "Live",
      kicker: "Experiencias interactivas durante el evento",
      desc: "Convierte la fiesta en un evento participativo: trivias, votaciones, ranking de mesas y misiones que activan a los invitados.",
      list: ["Juegos por mesa", "Trivia de los novios", "Votaciones en vivo", "Capitanes de mesa", "Desafíos de fotos", "Mensajes sorpresa", "Dinámicas para romper el hielo"],
      cls: "module--live",
      glyph: <Icon.Game />,
    },
    {
      tag: "Módulo 04",
      title: "MatriLink",
      sub: "Memories",
      kicker: "Recuerdos, fotos, videos y cápsulas",
      desc: "Lo que tus invitados graban con su celular se transforma en un recuerdo curado, editado y entregado.",
      list: ["Link privado para subir contenido", "Cápsulas de video de invitados", "Mensajes para los novios", "Clasificación del material", "Video final editado", "Álbum digital", "Libro físico opcional"],
      cls: "module--mem",
      glyph: <Icon.Camera />,
    },
  ];
  return (
    <section className="section" id="modulos">
      <div className="wrap">
        <div className="sec-head sec-head--center">
          <span className="eyebrow" style={{justifyContent: 'center', display: 'inline-flex'}}>Módulos del servicio</span>
          <h2>Todo lo que necesitas para conectar tu matrimonio.</h2>
          <p>Cuatro piezas que se complementan. Empieza por la que necesitas hoy y crece a tu ritmo.</p>
        </div>
        <div className="modules-grid">
          {mods.map((m, i) => (
            <div className={`module ${m.cls}`} key={i}>
              <div className="module__tag">{m.tag}</div>
              <h3>{m.title}<span className="accent"> {m.sub}</span></h3>
              <div className="module__glyph" style={{color: 'var(--carbon-soft)'}}>{m.glyph}</div>
              <p style={{fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: 17, color: 'var(--carbon-soft)'}}>{m.kicker}</p>
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

// ----- DASHBOARD SECTION -----
function DashboardSection() {
  return (
    <section className="section section--cream">
      <div className="wrap">
        <div className="sec-head sec-head--center">
          <span className="eyebrow" style={{justifyContent: 'center', display: 'inline-flex'}}>Dashboard en vivo</span>
          <h2>Toda la información importante <em>en un solo lugar.</em></h2>
          <p>Ve el estado real de los invitados sin revisar cientos de mensajes manualmente. Confirma, ajusta y comunica desde una sola pantalla.</p>
        </div>
        <Dashboard />
      </div>
    </section>
  );
}

// ----- EMOTIONAL DIFFERENTIAL -----
function Differential({ onCTA }) {
  return (
    <section className="diff" id="recuerdos">
      <div className="wrap">
        <div className="diff__grid">
          <div>
            <span className="eyebrow" style={{color: 'var(--champagne)'}}>El diferencial</span>
            <h2 style={{marginTop: 14}}>El fotógrafo captura el evento. <em>Tus invitados capturan la historia real.</em></h2>
            <p>
              Hay momentos que no siempre aparecen en las fotos oficiales:
              la risa de una mesa, el mensaje de un amigo, un video espontáneo
              en la pista de baile, o una dedicatoria grabada después de unas copas.
            </p>
            <div className="diff__quote">
              MatriLink reúne esas miradas y las transforma en un recuerdo vivo, emocional y auténtico.
            </div>
            <div className="diff__cta">
              <Button variant="champagne" size="lg" onClick={onCTA}>Quiero capturar esos recuerdos <Icon.Arrow /></Button>
            </div>
          </div>
          <div className="collage">
            <div className="coll-card coll-1">
              <div className="coll-card__img coll-card__img--photo coll-photo-1">21:48 · pista</div>
              <div className="coll-card__cap">video — mesa 8</div>
            </div>
            <div className="coll-card coll-2">
              <div className="coll-card__img coll-card__img--photo coll-photo-2">post ceremonia</div>
              <div className="coll-card__cap">foto — Valentina P.</div>
            </div>
            <div className="coll-card coll-3">
              <div className="coll-card__img coll-card__img--photo coll-photo-3">cápsula 00:42</div>
              <div className="coll-card__cap">mensaje — Mateo F.</div>
            </div>
            <div className="coll-card coll-4">
              <div className="coll-card__img coll-card__img--photo coll-photo-4">brindis</div>
              <div className="coll-card__cap">foto — Antonia V.</div>
            </div>
            <div className="coll-msg">
              "Que sean tan felices como esta foto los muestra. Los amo."
            </div>
            <div className="coll-play"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ----- GAMES -----
function Games() {
  const games = [
    { num: "01", title: "Trivia de los novios", desc: "Preguntas sobre la historia de la pareja que activan a los invitados.", viz: "¿En qué año se conocieron Camila y Diego?" },
    { num: "02", title: "Ranking de mesas", desc: "Cada mesa compite con desafíos, fotos y respuestas.", viz: "🏆 Mesa 8 · 92 pts" },
    { num: "03", title: "Cápsulas del momento", desc: "Invitados graban mensajes según la etapa del evento.", viz: "● rec 00:34 · Mesa 11" },
    { num: "04", title: "Consejos para los novios", desc: "Mensajes emocionales, divertidos o sabios.", viz: "96 consejos recibidos" },
    { num: "05", title: "Votaciones en vivo", desc: "Canciones, premios, mesa más prendida, mejor foto.", viz: "Próxima canción · 42 votos" },
    { num: "06", title: "Cápsula del tiempo", desc: "Mensajes para abrir en el primer aniversario.", viz: "Se abre · 14 dic 2027" },
  ];
  return (
    <section className="section">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">Juegos &amp; dinámicas</span>
          <h2>Haz que tus invitados también sean parte de la <em>experiencia.</em></h2>
          <p>Dinámicas lúdicas antes y durante el matrimonio para que los invitados participen, interactúen y creen recuerdos juntos.</p>
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

// ----- CAPSULES TIMELINE -----
function Capsules() {
  const caps = [
    { lbl: "Antes", q: "¿Qué les deseas a los novios?", n: "1" },
    { lbl: "Llegada", q: "¿Cómo conoces a los novios?", n: "2" },
    { lbl: "Ceremonia", q: "¿Qué sentiste al verlos casarse?", n: "3" },
    { lbl: "Cena", q: "Un consejo para su matrimonio", n: "4" },
    { lbl: "Fiesta", q: "El momento más prendido de tu mesa", n: "5" },
    { lbl: "Cierre", q: "Tu último mensaje antes de irte", n: "6" },
    { lbl: "Día sgte.", q: "Sube tus mejores fotos y videos", n: "7" },
  ];
  return (
    <section className="section section--cream">
      <div className="wrap">
        <div className="sec-head sec-head--center">
          <span className="eyebrow" style={{justifyContent: 'center', display: 'inline-flex'}}>Cápsulas de video</span>
          <h2>Mensajes espontáneos <em>en cada etapa</em> del matrimonio.</h2>
          <p>Durante el evento, MatriLink envía pequeñas misiones a los invitados para grabar videos cortos según el momento.</p>
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
        <p className="serif-italic" style={{textAlign: 'center', marginTop: 56, fontSize: 22, color: 'var(--carbon-soft)', maxWidth: 680, margin: '56px auto 0', lineHeight: 1.4}}>
          Algunas cápsulas serán emotivas. Otras desordenadas. <span style={{color: 'var(--champagne-deep)'}}>Todas serán inolvidables.</span>
        </p>
      </div>
    </section>
  );
}

// ----- WEDDING WRAPPED -----
function Wrapped() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="wrapped">
          <div className="wrapped__grid">
            <div>
              <span className="eyebrow" style={{color: 'var(--champagne)'}}>Wedding Wrapped</span>
              <h2 style={{marginTop: 14}}>Tu matrimonio en <em>números, recuerdos y momentos.</em></h2>
              <p>Después del evento, MatriLink entrega un resumen visual con los hitos del matrimonio. Para revivirlo. Para compartirlo. Para no olvidarlo.</p>
              <div style={{marginTop: 30}}>
                <Button variant="champagne">Ver ejemplo completo <Icon.Arrow /></Button>
              </div>
            </div>
            <div className="wrapped__stats">
              <div className="wstat"><div className="wstat__num">240</div><div className="wstat__lbl">Invitados</div></div>
              <div className="wstat"><div className="wstat__num">184</div><div className="wstat__lbl">Confirmados</div></div>
              <div className="wstat"><div className="wstat__num">312</div><div className="wstat__lbl">Fotos recibidas</div></div>
              <div className="wstat"><div className="wstat__num">96</div><div className="wstat__lbl">Mensajes para los novios</div></div>
              <div className="wstat wstat--full">
                <div>
                  <div className="wstat__role">Mesa más prendida</div>
                  <div className="wstat__num">Mesa 8</div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <div className="wstat__role">Canción más pedida</div>
                  <div className="wstat__num">September</div>
                </div>
              </div>
              <div className="wstat wstat--full">
                <div>
                  <div className="wstat__role">Momento más fotografiado</div>
                  <div className="wstat__num">Primer baile</div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <div className="wstat__role">Invitado más participativo</div>
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

// ----- B2B PLANNERS -----
function Planners({ onCTA }) {
  const bens = [
    "Menos seguimiento manual con cada matrimonio",
    "Dashboard centralizado por evento",
    "Mejor control de confirmaciones",
    "Comunicación directa con invitados",
    "Experiencias interactivas durante el evento",
    "Recuerdos post evento como upsell",
    "Diferenciación frente a otras planners",
    "Servicio white label o co-brandeado",
  ];
  return (
    <section className="section section--carbon" id="planners">
      <div className="wrap">
        <div className="b2b">
          <div>
            <span className="eyebrow" style={{color: 'var(--champagne)'}}>Para wedding planners</span>
            <h2 style={{marginTop: 14, fontSize: 'clamp(34px, 4vw, 50px)', lineHeight: 1.05, color: '#FBF6EE'}}>
              Una experiencia <em style={{color: 'var(--champagne)', fontStyle: 'italic'}}>premium</em> para wedding planners y productoras de eventos.
            </h2>
            <p style={{marginTop: 18, color: 'rgba(255,255,255,0.7)', fontSize: 17, lineHeight: 1.6, maxWidth: 480}}>
              MatriLink permite a wedding planners ofrecer una capa tecnológica y emocional a sus matrimonios — reduciendo carga operativa y elevando la experiencia del cliente final.
            </p>
            <div style={{marginTop: 32}}>
              <Button variant="champagne" size="lg" onClick={onCTA}>Quiero ofrecer MatriLink a mis clientes <Icon.Arrow /></Button>
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

// ----- PLANS -----
function Plans({ onCTA }) {
  const plans = [
    {
      name: "RSVP Inteligente",
      sub: "Para novios que quieren ordenar confirmaciones y logística.",
      from: "Cotización",
      inc: [
        "Carga de invitados",
        "Invitación por WhatsApp",
        "Confirmación de asistencia",
        "Registro de acompañante",
        "Selección de menú",
        "Dashboard básico",
        "Recordatorios automáticos",
      ],
      cta: "Cotizar RSVP",
    },
    {
      name: "Experiencia Completa",
      sub: "Para novios que quieren comunicación, automatización y experiencia en vivo.",
      from: "Más elegido",
      featured: true,
      inc: [
        "Todo lo del plan RSVP",
        "Asistente virtual para FAQ",
        "Comunicaciones masivas",
        "Segmentación por mesas",
        "Mensajes el día del evento",
        "Capitanes de mesa",
        "Juegos y dinámicas",
        "Dashboard avanzado",
      ],
      cta: "Cotizar experiencia completa",
    },
    {
      name: "Memories Premium",
      sub: "Para novios que quieren capturar fotos, videos, cápsulas y recuerdos.",
      from: "Premium",
      inc: [
        "Todo lo del plan Experiencia",
        "Link privado para subir fotos/videos",
        "Cápsulas de invitados",
        "Mensajes para los novios",
        "Clasificación del material",
        "Video editado",
        "Álbum digital",
        "Wedding Wrapped + libro físico",
      ],
      cta: "Cotizar Memories Premium",
    },
  ];
  return (
    <section className="section" id="planes">
      <div className="wrap">
        <div className="sec-head sec-head--center">
          <span className="eyebrow" style={{justifyContent: 'center', display: 'inline-flex'}}>Planes</span>
          <h2>Tres caminos. <em>Todos personalizables.</em></h2>
          <p>El precio depende de tu fecha, cantidad de invitados y módulos. Cotizamos cada matrimonio a medida.</p>
        </div>
        <div className="plans-grid">
          {plans.map((p, i) => (
            <div className={`plan${p.featured ? ' plan--featured' : ''}`} key={i}>
              {p.featured && <div className="plan__pill">Más elegido</div>}
              <h3>{p.name}</h3>
              <p className="plan__sub">{p.sub}</p>
              <div className="plan__price">
                <strong>{p.from}</strong>
                <span style={{fontStyle: 'italic'}}>según invitados y fecha</span>
              </div>
              <ul className="plan__inc">
                {p.inc.map((it, j) => <li key={j}>{it}</li>)}
              </ul>
              <Button variant={p.featured ? 'champagne' : 'ghost'} onClick={onCTA}>{p.cta} <Icon.Arrow /></Button>
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
    { q: "¿Los invitados tienen que descargar una app?", a: "No. Toda la experiencia ocurre por WhatsApp y links simples. Nada que instalar." },
    { q: "¿Podemos enviar la invitación oficial por MatriLink?", a: "Sí. Enviamos una invitación personalizada por WhatsApp con botones para confirmar asistencia, indicar acompañante, elegir menú o hacer preguntas." },
    { q: "¿Qué pasa si un invitado no responde?", a: "MatriLink envía recordatorios automáticos solo a los invitados pendientes — sin spamear a los que ya confirmaron." },
    { q: "¿Puedo ver quién confirmó?", a: "Sí. Tienes acceso a un dashboard en tiempo real con confirmados, pendientes, acompañantes, menús y restricciones alimentarias." },
    { q: "¿Los invitados pueden hacer preguntas?", a: "Sí. Escriben por WhatsApp y el asistente responde preguntas frecuentes. Si la pregunta requiere revisión humana, se deriva al equipo." },
    { q: "¿Podemos mandar mensajes el día del matrimonio?", a: "Sí. Se pueden enviar mensajes masivos o segmentados — por ejemplo ubicación, horarios, número de mesa, instrucciones o dinámicas." },
    { q: "¿Qué tipo de contenido pueden subir los invitados?", a: "Fotos, videos, mensajes escritos, audios y cápsulas de video. Todo se centraliza en un solo lugar." },
    { q: "¿MatriLink reemplaza al fotógrafo?", a: "No. Lo complementa. El fotógrafo captura la mirada profesional; MatriLink captura la mirada espontánea de los invitados." },
    { q: "¿Se puede usar con wedding planners?", a: "Sí. MatriLink trabaja directamente con novios, wedding planners o productoras de eventos. Hay un modelo white label disponible." },
    { q: "¿Cuánto tiempo antes del matrimonio conviene contratarlo?", a: "Idealmente entre 2 y 4 meses antes, aunque también podemos implementar en menos tiempo si la lista de invitados está ordenada." },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section className="section" id="faq">
      <div className="wrap">
        <div className="sec-head sec-head--center">
          <span className="eyebrow" style={{justifyContent: 'center', display: 'inline-flex'}}>Preguntas frecuentes</span>
          <h2>Todo lo que <em>siempre</em> nos preguntan.</h2>
        </div>
        <div className="faq-list">
          {faqs.map((f, i) => (
            <div className={`faq-item${i === open ? ' faq-item--open' : ''}`} key={i}>
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
            <div className="foot__logo">
              <LogoMark size={28} />
              <span><span style={{color: '#FBF6EE'}}>Matri</span><span className="link">Link</span></span>
            </div>
            <div className="foot__tag">Todo tu matrimonio, a un click.</div>
            <p>MatriLink conecta a los novios con sus invitados antes, durante y después del matrimonio — transformando la organización y los recuerdos en una experiencia simple, emocional y memorable.</p>
          </div>
          <div>
            <h5>Producto</h5>
            <ul>
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
              <li><a href="#contacto">Novios</a></li>
              <li><a href="#planners">Wedding planners</a></li>
              <li><a href="#planners">Productoras</a></li>
              <li><a href="#contacto">Agendar demo</a></li>
            </ul>
          </div>
          <div>
            <h5>Contacto</h5>
            <ul>
              <li><a>hola@matrilink.cl</a></li>
              <li><a>WhatsApp +56 9 0000 0000</a></li>
              <li><a>Instagram @matrilink</a></li>
            </ul>
          </div>
        </div>
        <div className="foot__copy">
          <span>© 2026 MatriLink · Hecho con cariño en Chile</span>
          <span style={{display: 'flex', gap: 16}}>
            <a>Términos y condiciones</a>
            <a>Política de privacidad</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  Nav, Hero, ClaimBand, WeddingBanner, Problem, Solution, HowItWorks,
  Modules, DashboardSection, Differential, Games, Capsules,
  Wrapped, Planners, Plans, FAQ, Footer,
});

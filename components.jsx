// ========== Shared UI Components ==========
const { useState, useEffect, useMemo } = React;

// ----- Logo -----
function LogoMark({ size = 32 }) {
  return (
    <span className="logo-mark" style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" fill="none">
        {/* Two interlocked rings */}
        <circle cx="18" cy="28" r="10" stroke="#C8A56A" strokeWidth="2" fill="none" />
        <circle cx="30" cy="28" r="10" stroke="#A8B5A2" strokeWidth="2" fill="none" />
        {/* diamond accent on top */}
        <path d="M16 16 L20 12 L22 16 L18 20 Z" fill="#C8A56A" opacity="0.85" />
        <path d="M22 16 L20 12 L24 14 Z" fill="#A8854C" opacity="0.6" />
        {/* small heart between */}
        <path d="M24 32 c-1.2 -1.5 -3.5 -1.5 -3.5 0.4 c0 1.4 2 2.6 3.5 3.8 c1.5 -1.2 3.5 -2.4 3.5 -3.8 c0 -1.9 -2.3 -1.9 -3.5 -0.4 z" fill="#C8795B" opacity="0.85" />
      </svg>
    </span>
  );
}

function LogoWordmark({ size = 22 }) {
  return (
    <span className="nav__logo" style={{ fontSize: size }}>
      <LogoMark size={size * 1.5} />
      <span><span className="matri">Matri</span><span className="link">Link</span></span>
    </span>
  );
}

// ----- Buttons -----
function Button({ variant = "primary", size, onClick, children, href, type = "button", className = "" }) {
  const cls = `btn btn--${variant}${size ? ` btn--${size}` : ""} ${className}`;
  if (href) return <a className={cls} href={href} onClick={onClick}>{children}</a>;
  return <button type={type} className={cls} onClick={onClick}>{children}</button>;
}

// ----- Icons (simple inline svg) -----
const Icon = {
  Arrow: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  Chat: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 6c0-2 1.5-3.5 4-3.5h4c2.5 0 4 1.5 4 3.5v2c0 2-1.5 3.5-4 3.5H8L5 14v-2.5c-1.8-.4-3-1.8-3-3.5V6z" stroke="currentColor" strokeWidth="1.3"/></svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7l3 3 6-6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  Heart: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 17s-6-3.5-6-8a3.5 3.5 0 016-2.5A3.5 3.5 0 0116 9c0 4.5-6 8-6 8z" stroke="currentColor" strokeWidth="1.4" fill="none"/></svg>
  ),
  Sparkle: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2v6M10 12v6M2 10h6M12 10h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><circle cx="10" cy="10" r="2" fill="currentColor"/></svg>
  ),
  Camera: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="6" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.3"/><circle cx="10" cy="11.5" r="3" stroke="currentColor" strokeWidth="1.3"/><path d="M7 6l1-2h4l1 2" stroke="currentColor" strokeWidth="1.3"/></svg>
  ),
  Calendar: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="5" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M3 9h14M7 3v4M13 3v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
  ),
  Whatsapp: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2a8 8 0 00-7 11.8L2 18l4.4-1A8 8 0 1010 2z" stroke="currentColor" strokeWidth="1.4" fill="none"/><path d="M7 7.5c0-.3.2-.5.5-.5h.7c.2 0 .4.1.5.3l.5 1.2c0 .2 0 .4-.1.5l-.4.4c-.1.1-.1.3 0 .4.4.7 1 1.3 1.7 1.7.1.1.3.1.4 0l.4-.4c.1-.1.3-.2.5-.1l1.2.5c.2.1.3.3.3.5v.7c0 .3-.2.5-.5.5C9.6 13.5 6.5 10.4 6.5 7.5z" fill="currentColor"/></svg>
  ),
  Ring: () => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="9" cy="13" r="6" stroke="currentColor" strokeWidth="1.4"/><circle cx="14" cy="13" r="6" stroke="currentColor" strokeWidth="1.4" opacity="0.6"/><path d="M9 5l1-2h2l1 2" stroke="currentColor" strokeWidth="1.4"/></svg>
  ),
  Game: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="6" width="16" height="10" rx="3" stroke="currentColor" strokeWidth="1.3"/><path d="M6 11h2M7 10v2M13 10h.5M15 12h.5M14 11h.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
  ),
};

// ----- Phone + Chat Mockup -----
function PhoneChat() {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  return (
    <div className="phone">
      <div className="phone__screen">
        <div className="phone__notch"></div>
        <div className="chat__header">
          <div className="chat__avatar">M</div>
          <div>
            <div className="chat__name">MatriLink · Camila & Diego</div>
            <div className="chat__status">en línea ahora</div>
          </div>
        </div>
        <div className="chat__body">
          <div className="bubble bubble--system">Hoy</div>

          <div className="bubble">
            Hola Sofía <span style={{color: '#C8A56A'}}>✨</span>
            <div className="bubble__meta">10:42</div>
          </div>

          <div className="bubble bubble--card" style={{maxWidth: '94%'}}>
            <div className="bubble__cover">Camila &amp; Diego</div>
            <div className="bubble__body">
              <div style={{fontWeight: 600, marginBottom: 4}}>Te invitamos a nuestro matrimonio</div>
              <div style={{fontSize: '11.5px', color: '#5a5a5a', lineHeight: 1.45}}>
                📅 Sábado 14 de diciembre<br/>
                📍 Viña Santa Elena, Casablanca<br/>
                🕒 17:30 hrs · ceremonia y fiesta
              </div>
            </div>
            <div className="bubble__btns">
              <div
                className={`bubble__btn${selectedAnswer === 'yes' ? ' bubble__btn--active' : ''}`}
                onClick={() => setSelectedAnswer('yes')}
              >
                {selectedAnswer === 'yes' ? '✓ ' : ''}Confirmo asistencia
              </div>
              <div
                className={`bubble__btn${selectedAnswer === 'no' ? ' bubble__btn--active' : ''}`}
                onClick={() => setSelectedAnswer('no')}
              >
                No podré asistir
              </div>
              <div
                className={`bubble__btn${selectedAnswer === 'q' ? ' bubble__btn--active' : ''}`}
                onClick={() => setSelectedAnswer('q')}
              >
                Tengo una pregunta
              </div>
            </div>
            <div className="bubble__meta" style={{padding: '0 12px 8px'}}>10:42</div>
          </div>

          {selectedAnswer === 'yes' && (
            <div className="bubble bubble--mine" style={{animation: 'fadein .3s'}}>
              ¡Confirmado! ¿Cuál es tu preferencia de menú?
              <div className="bubble__meta">10:42 ✓✓</div>
            </div>
          )}
          {selectedAnswer === 'yes' && (
            <div className="bubble bubble--card" style={{maxWidth: '76%'}}>
              <div className="bubble__btns" style={{borderRadius: 14}}>
                <div className="bubble__btn">🍖 Tradicional</div>
                <div className="bubble__btn">🥗 Vegetariano</div>
                <div className="bubble__btn">🌱 Vegano · sin gluten</div>
              </div>
            </div>
          )}
          {selectedAnswer === 'q' && (
            <div className="bubble bubble--mine">
              Claro, escríbenos tu pregunta y te contestamos al toque.
              <div className="bubble__meta">10:42 ✓✓</div>
            </div>
          )}
          {!selectedAnswer && (
            <div className="bubble bubble--system" style={{fontStyle: 'italic'}}>↑ Tócame</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ----- Floating stat cards next to the phone -----
function HeroFloats() {
  return (
    <>
      <div className="stat-float" style={{ top: 40, left: -30 }}>
        <span className="stat-float__lbl"><span className="stat-float__dot"></span>Confirmados</span>
        <span className="stat-float__num">184<small style={{fontSize: 14, color: '#A39E97'}}> / 240</small></span>
      </div>
      <div className="stat-float" style={{ bottom: 90, left: -50, animationDelay: '0.2s' }}>
        <span className="stat-float__lbl">Menús vegetarianos</span>
        <span className="stat-float__num">22</span>
      </div>
      <div className="stat-float" style={{ top: 130, right: -30 }}>
        <span className="stat-float__lbl"><span className="stat-float__dot" style={{background: '#C8795B'}}></span>Fotos recibidas</span>
        <span className="stat-float__num">312</span>
      </div>
      <div className="stat-float" style={{ bottom: 30, right: -10 }}>
        <span className="stat-float__lbl"><span className="stat-float__dot" style={{background: '#C8A56A'}}></span>Cápsulas video</span>
        <span className="stat-float__num">74</span>
      </div>
    </>
  );
}

// ----- Dashboard Mockup -----
function Dashboard() {
  return (
    <div className="dash">
      <div className="dash__top">
        <div className="dash__dots"><span></span><span></span><span></span></div>
        <div className="dash__title">Camila &amp; Diego <small>· 14 de diciembre, 2026</small></div>
        <div style={{fontSize: 12, color: 'var(--gris)'}}>· 23 días restantes</div>
      </div>
      <div className="dash__body">
        <aside className="dash__side">
          <h5>Matrimonio</h5>
          <div className="dash__nav">
            <a className="active"><span className="ico" style={{background: 'var(--champagne)'}}></span>Resumen</a>
            <a><span className="ico" style={{background: 'var(--salvia-soft)'}}></span>Invitados</a>
            <a><span className="ico" style={{background: 'var(--crema)'}}></span>Confirmaciones</a>
            <a><span className="ico" style={{background: 'rgba(200,121,91,0.25)'}}></span>Menús &amp; restricciones</a>
            <a><span className="ico" style={{background: 'var(--champagne-soft)'}}></span>Mesas</a>
            <a><span className="ico" style={{background: 'var(--salvia-soft)'}}></span>Comunicaciones</a>
          </div>
          <h5 style={{marginTop: 22}}>Experiencia</h5>
          <div className="dash__nav">
            <a><span className="ico" style={{background: 'var(--salvia)'}}></span>Juegos &amp; dinámicas</a>
            <a><span className="ico" style={{background: 'var(--terracota)'}}></span>Cápsulas</a>
            <a><span className="ico" style={{background: 'var(--champagne)'}}></span>Recuerdos</a>
          </div>
        </aside>
        <div className="dash__main">
          <div className="dash__hello">
            <div>
              <h3>Buenos días, Camila</h3>
              <small>Tienes 36 invitados pendientes de confirmar y 4 preguntas nuevas.</small>
            </div>
            <Button variant="champagne" size="sm">Enviar recordatorio</Button>
          </div>
          <div className="kpi-row">
            <div className="kpi"><div className="kpi__lbl">Cargados</div><div className="kpi__num">240</div><div className="kpi__delta">100%</div></div>
            <div className="kpi kpi--accent"><div className="kpi__lbl">Confirmados</div><div className="kpi__num">184</div><div className="kpi__delta">+12 esta semana</div></div>
            <div className="kpi"><div className="kpi__lbl">Pendientes</div><div className="kpi__num">36</div><div className="kpi__delta" style={{color: 'var(--terracota)'}}>recordatorio enviado</div></div>
            <div className="kpi"><div className="kpi__lbl">Acompañantes</div><div className="kpi__num">42</div><div className="kpi__delta">14 nuevos</div></div>
          </div>
          <div className="dash-row">
            <div className="panel">
              <h4>Selección de menú <small>184 confirmados</small></h4>
              <div className="menu-bars">
                <MenuBar name="Tradicional" value={138} max={184} cls="" />
                <MenuBar name="Vegetariano" value={22} max={184} cls="menu-bar__fill--salvia" />
                <MenuBar name="Vegano" value={8} max={184} cls="menu-bar__fill--champagne-deep" />
                <MenuBar name="Sin gluten" value={6} max={184} cls="menu-bar__fill--terra" />
                <MenuBar name="Infantil" value={10} max={184} cls="menu-bar__fill--soft" />
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
                  <span className="activity__dot activity__dot--salvia"></span>
                  <div>
                    <div className="activity__txt">2 invitados eligieron menú vegano</div>
                    <div className="activity__time">hace 18 min</div>
                  </div>
                </div>
                <div className="activity__item">
                  <span className="activity__dot activity__dot--terra"></span>
                  <div>
                    <div className="activity__txt"><strong>Pregunta nueva</strong>: ¿hay traslado desde Santiago?</div>
                    <div className="activity__time">hace 1 h</div>
                  </div>
                </div>
                <div className="activity__item">
                  <span className="activity__dot"></span>
                  <div>
                    <div className="activity__txt">Recordatorio enviado a 36 pendientes</div>
                    <div className="activity__time">hace 3 h</div>
                  </div>
                </div>
                <div className="activity__item">
                  <span className="activity__dot activity__dot--salvia"></span>
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
        <div className={`menu-bar__fill ${cls}`} style={{ width: pct + '%' }}></div>
      </div>
      <div className="menu-bar__num">{value}</div>
    </div>
  );
}

Object.assign(window, {
  LogoMark, LogoWordmark, Button, Icon,
  PhoneChat, HeroFloats, Dashboard, MenuBar,
});

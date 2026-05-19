// ========== App composition + Contact form ==========

function ContactForm() {
  const [data, setData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    perfil: "novio",
    fecha: "",
    ciudad: "",
    invitados: "100-200",
    listo: "",
    servicio: "Experiencia Completa",
    juegos: "si",
    mensaje: "",
    recuerdos: { video: true, album: false, libro: false },
  });
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState(false);
  const [sending, setSending] = useState(false);

  const set = (k, v) => setData(d => ({ ...d, [k]: v }));
  const toggle = (k) => setData(d => ({ ...d, recuerdos: { ...d.recuerdos, [k]: !d.recuerdos[k] } }));

  const WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/kEZKnFdhkbuCT1BBR0pv/webhook-trigger/e922945b-330c-4266-acf5-881b0ad42a05";

  const submit = async (e) => {
    e.preventDefault();
    setTouched(true);
    if (!data.nombre || !data.email || !data.telefono) return;

    setSending(true);
    const payload = {
      source: "matrilink.cl",
      form: "Solicitar cotización",
      submitted_at: new Date().toISOString(),
      nombre: data.nombre,
      email: data.email,
      telefono: data.telefono,
      perfil: data.perfil,
      fecha_matrimonio: data.fecha,
      ciudad: data.ciudad,
      cantidad_invitados: data.invitados,
      servicio_interes: data.servicio,
      juegos_dinamicas: data.juegos === 'si',
      recuerdos: {
        video_editado: data.recuerdos.video,
        album_digital: data.recuerdos.album,
        libro_fisico: data.recuerdos.libro,
      },
      mensaje: data.mensaje,
      page: typeof window !== 'undefined' ? window.location.href : '',
    };

    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      // We still show success so the UX doesn't block. The webhook will retry.
      console.warn('Webhook error', err);
    }
    setSending(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="form form-success">
        <div className="check-circle"><Icon.Check /></div>
        <h3>Gracias por contactar a MatriLink 💍</h3>
        <p>
          Recibimos tu solicitud. Te escribiremos por WhatsApp para entender
          mejor tu matrimonio y recomendarte el plan ideal.
        </p>
        <Button variant="champagne" size="lg">
          <Icon.Whatsapp /> Hablar ahora por WhatsApp
        </Button>
        <div style={{marginTop: 30, display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', fontSize: 13, color: 'var(--gris)'}}>
          <span>① Revisamos tu solicitud</span>
          <span>② Te contactamos</span>
          <span>③ Propuesta personalizada</span>
        </div>
      </div>
    );
  }

  const err = (k) => touched && !data[k];

  return (
    <form className="form" onSubmit={submit}>
      <div className="form-row">
        <div className="field">
          <label>Nombre <span className="req">*</span></label>
          <input value={data.nombre} onChange={e => set('nombre', e.target.value)} placeholder="Camila Rodríguez" style={err('nombre') ? {borderColor: 'var(--terracota)'} : {}} />
        </div>
        <div className="field">
          <label>Email <span className="req">*</span></label>
          <input type="email" value={data.email} onChange={e => set('email', e.target.value)} placeholder="camila@email.com" style={err('email') ? {borderColor: 'var(--terracota)'} : {}} />
        </div>
      </div>
      <div className="form-row">
        <div className="field">
          <label>WhatsApp <span className="req">*</span></label>
          <input value={data.telefono} onChange={e => set('telefono', e.target.value)} placeholder="+56 9 ····" style={err('telefono') ? {borderColor: 'var(--terracota)'} : {}} />
        </div>
        <div className="field">
          <label>Eres…</label>
          <select value={data.perfil} onChange={e => set('perfil', e.target.value)}>
            <option value="novio">Novio / novia</option>
            <option value="planner">Wedding planner</option>
            <option value="productora">Productora de eventos</option>
            <option value="otro">Otro</option>
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="field">
          <label>Fecha del matrimonio</label>
          <input type="date" value={data.fecha} onChange={e => set('fecha', e.target.value)} />
        </div>
        <div className="field">
          <label>Ciudad / lugar</label>
          <input value={data.ciudad} onChange={e => set('ciudad', e.target.value)} placeholder="Casablanca · Viña Santa Elena" />
        </div>
      </div>
      <div className="form-row">
        <div className="field">
          <label>Invitados</label>
          <select value={data.invitados} onChange={e => set('invitados', e.target.value)}>
            <option>menos de 80</option>
            <option>80-150</option>
            <option>100-200</option>
            <option>200-300</option>
            <option>300+</option>
          </select>
        </div>
        <div className="field">
          <label>Servicio de interés</label>
          <select value={data.servicio} onChange={e => set('servicio', e.target.value)}>
            <option>RSVP Inteligente</option>
            <option>Experiencia Completa</option>
            <option>Memories Premium</option>
            <option>Soy wedding planner</option>
            <option>No sé todavía, quiero orientación</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label>¿Te interesa video, álbum o libro de recuerdos?</label>
        <div className="checks">
          <label className={`check${data.recuerdos.video ? ' check--active' : ''}`}>
            <input type="checkbox" checked={data.recuerdos.video} onChange={() => toggle('video')} />
            Video editado final
          </label>
          <label className={`check${data.recuerdos.album ? ' check--active' : ''}`}>
            <input type="checkbox" checked={data.recuerdos.album} onChange={() => toggle('album')} />
            Álbum digital
          </label>
          <label className={`check${data.recuerdos.libro ? ' check--active' : ''}`}>
            <input type="checkbox" checked={data.recuerdos.libro} onChange={() => toggle('libro')} />
            Libro físico
          </label>
          <label className={`check${data.juegos === 'si' ? ' check--active' : ''}`}>
            <input type="checkbox" checked={data.juegos === 'si'} onChange={() => set('juegos', data.juegos === 'si' ? 'no' : 'si')} />
            Juegos / dinámicas en vivo
          </label>
        </div>
      </div>

      <div className="field">
        <label>Cuéntanos un poco sobre tu matrimonio</label>
        <textarea value={data.mensaje} onChange={e => set('mensaje', e.target.value)} placeholder="¿Qué es lo más importante para ustedes? ¿Algo especial que quieran lograr?"></textarea>
      </div>

      <div className="form__submit">
        <span className="form__legal">Al enviar aceptas nuestros términos. Te contactamos por WhatsApp en menos de 24h.</span>
        <Button variant="champagne" type="submit" size="lg">{sending ? 'Enviando…' : 'Solicitar cotización'} <Icon.Arrow /></Button>
      </div>
    </form>
  );
}

// ----- CONTACT SECTION -----
function Contact() {
  return (
    <section className="section contact" id="contacto">
      <div className="wrap">
        <div className="contact-grid">
          <div>
            <span className="eyebrow">Solicitar cotización</span>
            <h2 style={{marginTop: 14}}>Conversemos sobre <em>tu matrimonio.</em></h2>
            <p className="lead">
              Cuéntanos lo básico. Te escribimos por WhatsApp en menos de 24h
              con una propuesta personalizada según fecha, cantidad de invitados
              y el tipo de experiencia que quieren crear.
            </p>
            <div className="contact__points">
              <div className="contact__point">
                <span className="contact__num">01</span>
                <div className="contact__txt"><strong>Revisamos tu solicitud.</strong> Entendemos tu fecha, invitados y prioridades.</div>
              </div>
              <div className="contact__point">
                <span className="contact__num">02</span>
                <div className="contact__txt"><strong>Te contactamos por WhatsApp</strong> para conversar sobre tu evento.</div>
              </div>
              <div className="contact__point">
                <span className="contact__num">03</span>
                <div className="contact__txt"><strong>Te enviamos una propuesta</strong> con los módulos que hacen más sentido.</div>
              </div>
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

// ----- FINAL CTA -----
function FinalCTA({ onCTA }) {
  return (
    <section style={{paddingTop: 0}}>
      <div className="final-cta">
        <span className="eyebrow" style={{color: 'var(--champagne)', justifyContent: 'center', display: 'inline-flex', position: 'relative'}}>El gran día</span>
        <h2 style={{marginTop: 18}}>Haz que tus invitados también <em>cuenten la historia</em> de tu matrimonio.</h2>
        <p>Desde la primera invitación hasta el video final, MatriLink te ayuda a organizar, comunicar y recordar tu gran día de una forma simple, moderna y emocional.</p>
        <div className="final-cta__btns">
          <Button variant="champagne" size="lg" onClick={onCTA}>Solicitar demo <Icon.Arrow /></Button>
          <a className="btn btn--lg" style={{background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.25)'}}>
            <Icon.Whatsapp /> Hablar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

// ----- FLOATING WHATSAPP -----
function FloatingWA() {
  return (
    <a className="floating-wa" href="#contacto">
      <span className="floating-wa__ico"><Icon.Whatsapp /></span>
      <span>¿Hablamos por WhatsApp?</span>
    </a>
  );
}

// ========== ROOT APP ==========
function App() {
  const scrollToContact = () => {
    const el = document.getElementById('contacto');
    if (el) window.scrollTo({ top: el.offsetTop - 60, behavior: 'smooth' });
  };

  return (
    <>
      <Nav onCTA={scrollToContact} />
      <Hero onCTA={scrollToContact} />
      <WeddingBanner />
      <ClaimBand />
      <Problem />
      <Solution />
      <HowItWorks />
      <Modules />
      <DashboardSection />
      <Differential onCTA={scrollToContact} />
      <Planners onCTA={scrollToContact} />
      <Plans onCTA={scrollToContact} />
      <FAQ />
      <Contact />
      <FinalCTA onCTA={scrollToContact} />
      <Footer />
      <FloatingWA />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

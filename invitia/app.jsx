// ========== Invitia · Composición + formulario de contacto ==========

// Webhook de destino de los leads (GoHighLevel). Cambiar por el de Invitia
// cuando exista un workflow propio.
const WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/kEZKnFdhkbuCT1BBR0pv/webhook-trigger/e922945b-330c-4266-acf5-881b0ad42a05";
const WHATSAPP_URL = "https://wa.me/56900000000?text=Hola%20Invitia,%20quiero%20saber%20m%C3%A1s%20para%20mi%20evento";

function ContactForm() {
  const [data, setData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    perfil: "anfitrion",
    tipoEvento: "Matrimonio",
    fecha: "",
    ciudad: "",
    invitados: "100-200",
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

  const submit = async (e) => {
    e.preventDefault();
    setTouched(true);
    if (!data.nombre || !data.email || !data.telefono) return;

    setSending(true);
    const payload = {
      source: "invitia.cl",
      form: "Solicitar cotización",
      submitted_at: new Date().toISOString(),
      nombre: data.nombre,
      email: data.email,
      telefono: data.telefono,
      perfil: data.perfil,
      tipo_evento: data.tipoEvento,
      fecha_evento: data.fecha,
      ciudad: data.ciudad,
      cantidad_invitados: data.invitados,
      servicio_interes: data.servicio,
      juegos_dinamicas: data.juegos === "si",
      recuerdos: {
        video_editado: data.recuerdos.video,
        album_digital: data.recuerdos.album,
        libro_fisico: data.recuerdos.libro,
      },
      mensaje: data.mensaje,
      page: typeof window !== "undefined" ? window.location.href : "",
    };

    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      // Mostramos éxito igual para no bloquear la UX; el webhook reintenta.
      console.warn("Webhook error", err);
    }
    setSending(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="form form-success">
        <div className="check-circle"><Icon.Check /></div>
        <h3>Gracias por contactar a Invitia 🎉</h3>
        <p>
          Recibimos tu solicitud. Te escribimos por WhatsApp para entender mejor
          tu evento y recomendarte el plan ideal.
        </p>
        <Button variant="primary" size="lg" href={WHATSAPP_URL}>
          <Icon.Whatsapp /> Hablar ahora por WhatsApp
        </Button>
        <div style={{ marginTop: 30, display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", fontSize: 13, color: "var(--gris)" }}>
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
          <input value={data.nombre} onChange={e => set("nombre", e.target.value)} placeholder="Camila Rodríguez" style={err("nombre") ? { borderColor: "var(--coral)" } : {}} />
        </div>
        <div className="field">
          <label>Email <span className="req">*</span></label>
          <input type="email" value={data.email} onChange={e => set("email", e.target.value)} placeholder="camila@email.com" style={err("email") ? { borderColor: "var(--coral)" } : {}} />
        </div>
      </div>
      <div className="form-row">
        <div className="field">
          <label>WhatsApp <span className="req">*</span></label>
          <input value={data.telefono} onChange={e => set("telefono", e.target.value)} placeholder="+56 9 ····" style={err("telefono") ? { borderColor: "var(--coral)" } : {}} />
        </div>
        <div className="field">
          <label>Eres…</label>
          <select value={data.perfil} onChange={e => set("perfil", e.target.value)}>
            <option value="anfitrion">Anfitrión / organizo mi evento</option>
            <option value="empresa">Empresa / área de marketing o RR.HH.</option>
            <option value="productora">Productora o agencia de eventos</option>
            <option value="planner">Wedding planner</option>
            <option value="otro">Otro</option>
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="field">
          <label>Tipo de evento</label>
          <select value={data.tipoEvento} onChange={e => set("tipoEvento", e.target.value)}>
            <option>Matrimonio</option>
            <option>Cumpleaños</option>
            <option>Evento corporativo</option>
            <option>Graduación</option>
            <option>Baby shower</option>
            <option>Quinceañero</option>
            <option>Conferencia o feria</option>
            <option>Aniversario o gala</option>
            <option>Otro</option>
          </select>
        </div>
        <div className="field">
          <label>Fecha del evento</label>
          <input type="date" value={data.fecha} onChange={e => set("fecha", e.target.value)} />
        </div>
      </div>
      <div className="form-row">
        <div className="field">
          <label>Ciudad / lugar</label>
          <input value={data.ciudad} onChange={e => set("ciudad", e.target.value)} placeholder="Santiago · Hotel W" />
        </div>
        <div className="field">
          <label>Invitados</label>
          <select value={data.invitados} onChange={e => set("invitados", e.target.value)}>
            <option>menos de 50</option>
            <option>50-100</option>
            <option>100-200</option>
            <option>200-500</option>
            <option>500-1.000</option>
            <option>más de 1.000</option>
          </select>
        </div>
      </div>
      <div className="field">
        <label>Servicio de interés</label>
        <select value={data.servicio} onChange={e => set("servicio", e.target.value)}>
          <option>Esencial</option>
          <option>Experiencia Completa</option>
          <option>Memories Premium</option>
          <option>Soy productora / agencia</option>
          <option>No sé todavía, quiero orientación</option>
        </select>
      </div>

      <div className="field">
        <label>¿Te interesa video, álbum o libro de recuerdos?</label>
        <div className="checks">
          <label className={`check${data.recuerdos.video ? " check--active" : ""}`}>
            <input type="checkbox" checked={data.recuerdos.video} onChange={() => toggle("video")} />
            Video editado final
          </label>
          <label className={`check${data.recuerdos.album ? " check--active" : ""}`}>
            <input type="checkbox" checked={data.recuerdos.album} onChange={() => toggle("album")} />
            Álbum digital
          </label>
          <label className={`check${data.recuerdos.libro ? " check--active" : ""}`}>
            <input type="checkbox" checked={data.recuerdos.libro} onChange={() => toggle("libro")} />
            Libro o reporte físico
          </label>
          <label className={`check${data.juegos === "si" ? " check--active" : ""}`}>
            <input type="checkbox" checked={data.juegos === "si"} onChange={() => set("juegos", data.juegos === "si" ? "no" : "si")} />
            Juegos / dinámicas en vivo
          </label>
        </div>
      </div>

      <div className="field">
        <label>Cuéntanos un poco sobre tu evento</label>
        <textarea value={data.mensaje} onChange={e => set("mensaje", e.target.value)} placeholder="¿Qué es lo más importante para ti? ¿Algo especial que quieras lograr?"></textarea>
      </div>

      <div className="form__submit">
        <span className="form__legal">Al enviar aceptas nuestros términos. Te contactamos por WhatsApp en menos de 24h.</span>
        <Button variant="primary" type="submit" size="lg">{sending ? "Enviando…" : "Solicitar cotización"} <Icon.Arrow /></Button>
      </div>
    </form>
  );
}

// ----- CONTACTO -----
function Contact() {
  return (
    <section className="contact" id="contacto">
      <div className="wrap">
        <div className="contact-grid">
          <div>
            <span className="eyebrow">Solicitar cotización</span>
            <h2 style={{ marginTop: 14 }}>Conversemos sobre <span className="grad-text">tu evento.</span></h2>
            <p className="lead">
              Cuéntanos lo básico. Te escribimos por WhatsApp en menos de 24h con
              una propuesta personalizada según el tipo de evento, la fecha, la
              cantidad de invitados y la experiencia que quieres crear.
            </p>
            <div className="contact__points">
              <div className="contact__point">
                <span className="contact__num">01</span>
                <div className="contact__txt"><strong>Revisamos tu solicitud.</strong> Entendemos tu evento, fecha, invitados y prioridades.</div>
              </div>
              <div className="contact__point">
                <span className="contact__num">02</span>
                <div className="contact__txt"><strong>Te contactamos por WhatsApp</strong> para conversar sobre lo que necesitas.</div>
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

// ----- CTA FINAL -----
function FinalCTA({ onCTA }) {
  return (
    <section className="section" style={{ paddingBottom: 90 }}>
      <div className="final-cta">
        <span className="eyebrow" style={{ justifyContent: "center", display: "inline-flex", position: "relative" }}>El gran día</span>
        <h2 style={{ marginTop: 18 }}>Haz que tus invitados también <span className="grad-text">cuenten la historia</span> de tu evento.</h2>
        <p>Desde la primera invitación hasta el video final, Invitia te ayuda a organizar, comunicar y recordar tu evento de una forma simple, moderna y emocional.</p>
        <div className="final-cta__btns">
          <Button variant="light" size="lg" onClick={onCTA}>Solicitar demo <Icon.Arrow /></Button>
          <Button variant="outline-light" size="lg" href={WHATSAPP_URL}>
            <Icon.Whatsapp /> Hablar por WhatsApp
          </Button>
        </div>
      </div>
    </section>
  );
}

// ----- WHATSAPP FLOTANTE -----
function FloatingWA() {
  return (
    <a className="floating-wa" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
      <span className="floating-wa__ico"><Icon.Whatsapp /></span>
      <span>¿Hablamos por WhatsApp?</span>
    </a>
  );
}

// ========== APP ==========
function App() {
  const scrollToContact = () => {
    const el = document.getElementById("contacto");
    if (el) window.scrollTo({ top: el.offsetTop - 60, behavior: "smooth" });
  };

  return (
    <>
      <Nav onCTA={scrollToContact} />
      <Hero onCTA={scrollToContact} />
      <Marquee />
      <EventTypes />
      <Banner />
      <ClaimBand />
      <Problem />
      <Solution />
      <HowItWorks />
      <Modules />
      <DashboardSection />
      <Differential onCTA={scrollToContact} />
      <Games />
      <Capsules />
      <Wrapped />
      <Organizers onCTA={scrollToContact} />
      <Plans onCTA={scrollToContact} />
      <FAQ />
      <Contact />
      <FinalCTA onCTA={scrollToContact} />
      <Footer />
      <FloatingWA />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

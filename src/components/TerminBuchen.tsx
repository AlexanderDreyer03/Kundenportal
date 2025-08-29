import { useState } from "react";
import { sendAppointmentMail } from "../email";

type Step = "customerType" | "service" | "form" | "done";
type CustomerType = "privat" | "gewerbe";

const DATA: Record<
  CustomerType,
  { general: string; specialLabel: string; special: string[] }
> = {
  privat: {
    general: "Allgemeiner Gesprächsbedarf",
    specialLabel: "Spezielle Themen / Anlässe",
    special: [
      "Altersvorsorge / Rentenplaner",
      "Baufinanzierung",
      "Investment",
      "Versicherungscheck",
      "Konsumentenkredite",
      "Kinder-Konzept",
      "Zinsen sichern",
      "Krankenkassen Check",
      "Edelmetall Investment",
    ],
  },
  gewerbe: {
    general: "Allgemeiner Gesprächsbedarf",
    specialLabel: "Spezielle Themen / Anlässe",
    special: [
      "Betriebliche Krankenversicherung",
      "Betriebliche Altersvorsorge",
      "Betriebliche Unfallversicherung",
      "Bürgschaften",
      "Gesellschafterversorgung",
      "Unternehmensfinanzierung",
      "Liquiditätsoptimierung / Factoring",
    ],
  },
};

/* ---------- UI Styles ---------- */

const COLORS = {
  bgCard: "#f3f5f8",
  textDark: "#0b1220",
  brand: "#4f46e5",
};

const fieldBase: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.06)",
  outline: "none",
  background: COLORS.bgCard,
  color: COLORS.textDark,
  transition: "box-shadow .15s ease, border-color .15s ease",
};

const labelStyle: React.CSSProperties = {
  fontSize: 14,
  marginBottom: 6,
  fontWeight: 700,
  color: "white",
};

const sectionTitle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 800,
  letterSpacing: "-0.02em",
  color: "white",
};

const subTitle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 800,
  marginBottom: 8,
  color: "white",
};

function OptionCard(props: {
  title: string;
  onClick: () => void;
  variant?: "brand" | "ghost";
}) {
  const isBrand = props.variant !== "ghost";
  return (
    <button
      onClick={props.onClick}
      className="option-card"
      style={{
        width: "100%",
        textAlign: "left",
        padding: "18px 20px",
        borderRadius: 18,
        border: "1px solid",
        borderColor: isBrand ? "transparent" : "rgba(255,255,255,0.08)",
        background: isBrand
          ? `linear-gradient(135deg, ${COLORS.brand} 0%, #7c3aed 100%)`
          : COLORS.bgCard,
        color: isBrand ? "#ffffff" : COLORS.textDark,
        boxShadow: isBrand
          ? "0 10px 24px rgba(79,70,229,0.35)"
          : "0 6px 18px rgba(0,0,0,0.12)",
        transition: "transform .12s ease, box-shadow .12s ease, filter .12s ease",
        cursor: "pointer",
        fontSize: 16,
        fontWeight: 800,
        letterSpacing: "-0.01em",
      }}
    >
      {props.title}
    </button>
  );
}

/* ---------- Component ---------- */

export default function TerminBuchen() {
  const [step, setStep] = useState<Step>("customerType");
  const [customerType, setCustomerType] = useState<CustomerType | null>(null);
  const [service, setService] = useState<string | null>(null);

  // Form-Felder
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [info, setInfo] = useState("");
  const [consent, setConsent] = useState(false);

  // UI
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  /* --------- Helper: Submit ausgelagert --------- */
  async function submitForm() {
    setStatus(null);

    // Validierung (unverändert)
    if (!name.trim()) return setStatus("Bitte vollständigen Namen eingeben.");
    if (!phone.trim() && !email.trim())
      return setStatus("Bitte Telefon ODER E-Mail angeben.");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setStatus("Bitte gültige E-Mail-Adresse eingeben.");
    if (!consent) return setStatus("Bitte Einwilligung zur Kontaktaufnahme bestätigen.");

    setLoading(true);
    try {
      // ✅ einzig notwendige Änderung: Payload-Felder ergänzen
      await sendAppointmentMail({
        name,
        email,
        phone,
        topic: service ?? "",
        customerType: customerType === "privat" ? "Privatkunde" : "Gewerbekunde",
        message: info,
        refLink: typeof window !== "undefined" ? window.location.href : "",
      });
      setStep("done");
    } catch (err) {
      console.error("EmailJS error →", err);
      const e = err as any;
      const msg =
        e?.text ||
        e?.message ||
        (typeof err === "string" ? err : "") ||
        "Senden fehlgeschlagen. Bitte später erneut versuchen.";
      setStatus(String(msg));
    } finally {
      setLoading(false);
    }
  }

  /* --------- Step 1: Kundentyp --------- */
  if (step === "customerType") {
    return (
      <section className="panel mt-6">
        <div style={sectionTitle}>Termin buchen</div>
        <p className="mt-2" style={{ color: "rgba(255,255,255,0.8)" }}>
          Bitte zuerst auswählen:
        </p>

        <div
          style={{
            display: "grid",
            gap: 14,
            marginTop: 16,
            gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
          }}
        >
          <OptionCard
            title="Privatkunde"
            variant="brand"
            onClick={() => {
              setCustomerType("privat");
              setStep("service");
            }}
          />
          <OptionCard
            title="Gewerbekunde"
            variant="ghost"
            onClick={() => {
              setCustomerType("gewerbe");
              setStep("service");
            }}
          />
        </div>
      </section>
    );
  }

  /* --------- Step 2: Service-Auswahl --------- */
  if (step === "service" && customerType) {
    const cfg = DATA[customerType];

    return (
      <section className="panel mt-6">
        <button className="btn btn--ghost" onClick={() => setStep("customerType")}>
          ← zurück
        </button>

        <div style={{ ...sectionTitle, marginTop: 16 }}>
          {customerType === "privat" ? "Für Privatkunden" : "Für Gewerbekunden"}
        </div>

        {/* Allgemeiner Bedarf */}
        <div className="mt-4">
          <div style={subTitle}>Allgemeiner Gesprächsbedarf</div>
          <OptionCard
            title={cfg.general}
            variant="brand"
            onClick={() => {
              setService(cfg.general);
              setStep("form");
            }}
          />
        </div>

        {/* Spezielle Themen */}
        <div className="mt-6">
          <div style={subTitle}>{cfg.specialLabel}</div>
          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
            }}
          >
            {cfg.special.map((topic) => (
              <OptionCard
                key={topic}
                title={topic}
                variant="ghost"
                onClick={() => {
                  setService(topic);
                  setStep("form");
                }}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* --------- Step 3: Formular --------- */
  if (step === "form" && customerType) {
    return (
      <section className="panel mt-6" style={{ maxWidth: 720 }}>
        <button className="btn btn--ghost" onClick={() => setStep("service")}>
          ← zurück
        </button>
        <div style={{ ...sectionTitle, marginTop: 16 }}>{service}</div>
        <p className="mt-2" style={{ color: "rgba(255,255,255,0.8)" }}>
          Bitte Kontaktdaten angeben – ich melde mich zur Terminabstimmung.
        </p>

        <form
          className="space-y mt-4"
          onSubmit={async (e) => {
            e.preventDefault();
            await submitForm();
          }}
        >
          {/* Name */}
          <div>
            <div style={labelStyle}>Vollständiger Name *</div>
            <input
              style={fieldBase}
              onFocus={(el) => (el.currentTarget.style.boxShadow = `0 0 0 3px rgba(79,70,229,.35)`)}
              onBlur={(el) => (el.currentTarget.style.boxShadow = "none")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Max Muster"
              required
            />
          </div>

          {/* Telefon & E-Mail */}
          <div className="row" style={{ gap: 12, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={labelStyle}>Telefon</div>
              <input
                style={fieldBase}
                onFocus={(el) => (el.currentTarget.style.boxShadow = `0 0 0 3px rgba(34,193,195,.35)`)}
                onBlur={(el) => (el.currentTarget.style.boxShadow = "none")}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+49 …"
                inputMode="tel"
              />
            </div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={labelStyle}>E-Mail</div>
              <input
                style={fieldBase}
                onFocus={(el) => (el.currentTarget.style.boxShadow = `0 0 0 3px rgba(79,70,229,.35)`)}
                onBlur={(el) => (el.currentTarget.style.boxShadow = "none")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                type="email"
                inputMode="email"
              />
            </div>
          </div>

          {/* Infos / Kommentare */}
          <div>
            <div style={labelStyle}>Informationen & Kommentare (optional)</div>
            <textarea
              style={{ ...fieldBase, minHeight: 120, resize: "vertical" }}
              onFocus={(el) => (el.currentTarget.style.boxShadow = `0 0 0 3px rgba(79,70,229,.25)`)}
              onBlur={(el) => (el.currentTarget.style.boxShadow = "none")}
              value={info}
              onChange={(e) => setInfo(e.target.value)}
              placeholder="Wunschtermin, Anliegen, Rückrufzeiten …"
            />
          </div>

          {/* Einwilligung */}
          <label
            style={{
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
              background: "rgba(255,255,255,0.06)",
              borderRadius: 12,
              padding: "12px 14px",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "white",
            }}
          >
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              style={{ marginTop: 3 }}
              required
            />
            <span style={{ fontSize: 14 }}>
              Ich willige ein, dass meine Angaben zur Kontaktaufnahme und Zuordnung für
              eventuelle Rückfragen gespeichert und verarbeitet werden.
            </span>
          </label>

          {status && (
            <p className="mt-2" style={{ color: "#ffb4b4", fontWeight: 700 }}>
              {status}
            </p>
          )}

          <div className="row mt-2" style={{ gap: 12 }}>
            <button className="btn btn--brand" type="submit" disabled={loading}>
              {loading ? "Sende…" : "Termin anfragen"}
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setStep("service")}
              disabled={loading}
            >
              Abbrechen
            </button>
          </div>
        </form>
      </section>
    );
  }

  /* --------- Step 4: Danke --------- */
  return (
    <section className="panel mt-6" style={{ maxWidth: 560 }}>
      <div style={sectionTitle}>Danke!</div>
      <p className="mt-2" style={{ color: "rgba(255,255,255,0.85)" }}>
        Deine Anfrage ist eingegangen. Ich melde mich zeitnah.
      </p>
      <div className="row mt-4">
        <button
          className="btn btn--brand"
          onClick={() => {
            setName(""); setPhone(""); setEmail(""); setInfo(""); setConsent(false);
            setService(null); setCustomerType(null);
            setStep("customerType");
          }}
        >
          Noch eine Anfrage
        </button>
      </div>
    </section>
  );
}

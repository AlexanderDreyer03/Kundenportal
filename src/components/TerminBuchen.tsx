import { useEffect, useState } from "react";
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

  // Referral + UTM
  const [referrer, setReferrer] = useState<string>("");
  const [utm, setUtm] = useState<{ source?: string; medium?: string; campaign?: string }>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    const q = new URLSearchParams(window.location.search);

    // Referral
    const r = q.get("ref") || q.get("referrer") || q.get("empf") || "";
    if (r) {
      setReferrer(r);
      localStorage.setItem("referrer", r);
    } else {
      const stored = localStorage.getItem("referrer");
      if (stored) setReferrer(stored);
    }

    // UTM
    const utm_source = q.get("utm_source") || undefined;
    const utm_medium = q.get("utm_medium") || undefined;
    const utm_campaign = q.get("utm_campaign") || undefined;
    const next: typeof utm = {};
    if (utm_source) next.source = utm_source;
    if (utm_medium) next.medium = utm_medium;
    if (utm_campaign) next.campaign = utm_campaign;
    setUtm(next);
  }, []);

  // UI
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function submitForm() {
    setStatus(null);

    if (!name.trim()) return setStatus("Bitte vollständigen Namen eingeben.");
    if (!phone.trim() && !email.trim())
      return setStatus("Bitte Telefon ODER E-Mail angeben.");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setStatus("Bitte gültige E-Mail-Adresse eingeben.");
    if (!consent) return setStatus("Bitte Einwilligung bestätigen.");

    setLoading(true);
    try {
      await sendAppointmentMail({
        topic: `${service} • ${customerType === "privat" ? "Privatkunde" : "Gewerbekunde"}`,
        name,
        phone,
        email,
        message: info,
        refLink: typeof window !== "undefined" ? window.location.href : "",
        // 🔽 neu
        referrer,
        utmSource: utm.source,
        utmMedium: utm.medium,
        utmCampaign: utm.campaign,
      });
      setStep("done");
    } catch (err) {
      console.error("EmailJS error →", err);
      const e = err as any;
      setStatus(
        e?.text ||
          e?.message ||
          (typeof err === "string" ? err : "") ||
          "Senden fehlgeschlagen."
      );
    } finally {
      setLoading(false);
    }
  }

  // ---------- Steps ----------
  if (step === "customerType") {
    return (
      <section className="panel mt-6">
        <h2>Termin buchen</h2>
        <OptionCard title="Privatkunde" onClick={() => { setCustomerType("privat"); setStep("service"); }} />
        <OptionCard title="Gewerbekunde" onClick={() => { setCustomerType("gewerbe"); setStep("service"); }} />
      </section>
    );
  }

  if (step === "service" && customerType) {
    const cfg = DATA[customerType];
    return (
      <section className="panel mt-6">
        <OptionCard title={cfg.general} onClick={() => { setService(cfg.general); setStep("form"); }} />
        {cfg.special.map((topic) => (
          <OptionCard key={topic} title={topic} onClick={() => { setService(topic); setStep("form"); }} />
        ))}
      </section>
    );
  }

  if (step === "form" && customerType) {
    return (
      <form onSubmit={async (e) => { e.preventDefault(); await submitForm(); }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name *" required />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Telefon" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-Mail" type="email" />
        <textarea value={info} onChange={(e) => setInfo(e.target.value)} placeholder="Kommentar / Wunsch" />
        <label>
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required />
          Einwilligung
        </label>
        {status && <p style={{ color: "red" }}>{status}</p>}
        <button type="submit" disabled={loading}>{loading ? "Sende…" : "Absenden"}</button>
      </form>
    );
  }

  return <p>Danke! Deine Anfrage ist eingegangen.</p>;
}

function OptionCard({ title, onClick }: { title: string; onClick: () => void }) {
  return <button onClick={onClick}>{title}</button>;
}

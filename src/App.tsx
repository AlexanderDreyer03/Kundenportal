import React, { useMemo, useState } from "react";
import TerminBuchen from "./components/TerminBuchen";
import Empfehlen from "./components/Empfehlen";

/**
 * Ganz einfache Hash-„Navigation“:
 *  - "#/"            => Start
 *  - "#/hotlines"    => Hotlines
 *  - "#/termin"      => Termin buchen
 *  - "#/empfehlen"   => Empfehlungslink
 */
type Route = "/" | "/hotlines" | "/termin" | "/empfehlen";

function useRoute(): [Route, (r: Route) => void] {
  const get = () => (location.hash.replace(/^#/, "") || "/") as Route;
  const [route, setRoute] = useState<Route>(get());
  React.useEffect(() => {
    const onHash = () => setRoute(get());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const nav = (r: Route) => {
    if (get() !== r) location.hash = r;
    setRoute(r);
  };
  return [route, nav];
}

export default function App() {
  const [route, nav] = useRoute();

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div style={{ fontWeight: 800, letterSpacing: "-.02em" }}>Dein Service-Portal</div>
        <nav className="nav">
          <a href="#/hotlines" onClick={(e) => (e.preventDefault(), nav("/hotlines"))}>
            Hotlines
          </a>
          <a href="#/termin" onClick={(e) => (e.preventDefault(), nav("/termin"))}>
            Termin
          </a>
          <a href="#/empfehlen" onClick={(e) => (e.preventDefault(), nav("/empfehlen"))}>
            Empfehlen
          </a>
        </nav>
      </header>

      {/* Hero / Intro */}
      <section className="panel">
        <div className="chips">
          <span className="chip">QR / NFC Schlüsselanhänger</span>
        </div>
        <h1>Alles Wichtige in deinem Kundenportal.</h1>
        <p>Hotline wählen, Termin buchen oder weiterempfehlen.</p>

        <div className="row mt-4">
          <a
            href="#/hotlines"
            onClick={(e) => (e.preventDefault(), nav("/hotlines"))}
            className="btn btn--ghost"
          >
            <span>📞</span> Hotlines
          </a>
          <a
            href="#/termin"
            onClick={(e) => (e.preventDefault(), nav("/termin"))}
            className="btn btn--brand"
          >
            <span>📅</span> Termin buchen
          </a>
          <a
            href="#/empfehlen"
            onClick={(e) => (e.preventDefault(), nav("/empfehlen"))}
            className="btn btn--ok"
          >
            <span>🤝</span> Empfehlen
          </a>
        </div>
      </section>

      {/* Inhalt je nach Route */}
      {route === "/hotlines" && <Hotlines />}
      {route === "/termin" && <TerminBuchen />}
      {route === "/empfehlen" && <Empfehlen />}

      {/* Footer */}
      <footer className="footer">© 2025 — Gemacht mit ❤️ für meine Kund:innen</footer>
    </div>
  );
}

/* ---------- Sektionen ---------- */

function Hotlines() {
  const items = useMemo(
    () => [
      { label: "Schlüsseldienst", tel: "+49 30 111111" },
      { label: "Glaserei", tel: "+49 30 222222" },
      { label: "Sanitär / Rohre", tel: "+49 30 333333" },
      { label: "Elektriker Notdienst", tel: "+49 30 444444" },
      { label: "IT / Handy-Reparatur", tel: "+49 30 555555" },
      { label: "Abschleppdienst", tel: "+49 30 666666" },
      { label: "Schädlingsbekämpfung", tel: "+49 30 777777" },
      { label: "Heizung / Klima", tel: "+49 30 888888" },
      { label: "Apotheken-Notdienst", tel: "+49 800 123456" },
      { label: "Polizei (Notruf)", tel: "110" },
      { label: "Feuerwehr (Notruf)", tel: "112" },
    ],
    []
  );

  return (
    <section className="panel mt-6">
      <h2>Sofort-Hilfe</h2>
      <p className="mt-2">10 geprüfte Partner – antippen &amp; anrufen.</p>

      <div className="space-y mt-4">
        {items.map((x) => (
          <div
            key={x.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontWeight: 700 }}>{x.label}</div>
              <div style={{ color: "var(--muted)" }}>{x.tel}</div>
            </div>
            <div className="row">
              <a className="btn btn--brand" href={`tel:${x.tel.replace(/\s+/g, "")}`}>
                Anrufen
              </a>
              <button
                className="btn btn--ghost"
                onClick={() => navigator.clipboard.writeText(x.tel)}
              >
                Kopieren
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

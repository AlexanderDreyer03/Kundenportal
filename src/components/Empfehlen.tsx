import React, { useMemo, useState } from "react";

export default function Empfehlen() {
  const [copied, setCopied] = useState<null | "ok" | "err">(null);

  // Link direkt zum Termin-Tunnel
  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    // aktuell laufende Basis + Hash-Route „/termin“
    return `${window.location.origin}${window.location.pathname}#/termin`;
  }, []);

  const title = "Empfehlung";
  const msg =
    "Kurzer Tipp für dich – hier kannst du direkt einen Termin buchen. Ich empfehle das weiter:";

  async function onShare() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Termin direkt buchen",
          text: msg,
          url: shareUrl,
        });
      } else {
        // Fallback: Link kopieren
        await onCopy();
      }
    } catch {
      // (abgebrochen) – kein Fehlerhinweis nötig
    }
  }

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied("ok");
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied("err");
      setTimeout(() => setCopied(null), 3000);
    }
  }

  // Deep-Links für Messenger / Mail
  const encUrl = encodeURIComponent(shareUrl);
  const encText = encodeURIComponent(`${msg}\n${shareUrl}`);
  const whatsapp = `https://wa.me/?text=${encText}`;
  const telegram = `https://t.me/share/url?url=${encUrl}&text=${encodeURIComponent(msg)}`;
  const email = `mailto:?subject=${encodeURIComponent(
    "Empfehlung: Termin direkt buchen"
  )}&body=${encText}`;

  return (
    <section className="panel mt-6" style={{ maxWidth: 720 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-.02em", color: "white" }}>
        Weiterempfehlen
      </h2>
      <p className="mt-2" style={{ color: "rgba(255,255,255,.85)" }}>
        Teile den direkten Link zum Termin-Tunnel. Ideal für WhatsApp, E-Mail & Co.
      </p>

      {/* Share Card */}
      <div
        className="mt-4"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.04))",
          border: "1px solid rgba(255,255,255,.12)",
          borderRadius: 16,
          padding: 16,
        }}
      >
        <label style={{ fontWeight: 700, color: "white", fontSize: 14 }}>Dein Empfehlungslink</label>
        <div className="row mt-2" style={{ gap: 10, flexWrap: "wrap" }}>
          <input
            readOnly
            value={shareUrl}
            style={{
              flex: 1,
              minWidth: 260,
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,.12)",
              background: "#f3f5f8",
              color: "#0b1220",
            }}
            onFocus={(e) => e.currentTarget.select()}
          />
          <button className="btn btn--ghost" onClick={onCopy}>
            Link kopieren
          </button>
          <button className="btn btn--brand" onClick={onShare}>
            Jetzt teilen
          </button>
        </div>

        {/* kleines Feedback */}
        {copied === "ok" && (
          <div className="mt-2" style={{ color: "#a7f3d0", fontWeight: 700 }}>
            ✓ Link kopiert
          </div>
        )}
        {copied === "err" && (
          <div className="mt-2" style={{ color: "#ffb4b4", fontWeight: 700 }}>
            Konnte nicht kopieren – bitte manuell markieren.
          </div>
        )}

        {/* Direkt-Buttons */}
        <div className="row mt-3" style={{ gap: 10, flexWrap: "wrap" }}>
          <a className="btn btn--ok" href={whatsapp} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
          <a className="btn btn--ghost" href={telegram} target="_blank" rel="noreferrer">
            Telegram
          </a>
          <a className="btn btn--ghost" href={email}>
            E-Mail
          </a>
        </div>

        <p className="mt-3" style={{ color: "rgba(255,255,255,.7)", fontSize: 13 }}>
          Tipp: Auf Smartphones öffnet „Jetzt teilen“ den nativen Teilen-Dialog (Web Share API).
        </p>
      </div>
    </section>
  );
}

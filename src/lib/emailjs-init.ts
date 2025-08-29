import emailjs from "@emailjs/browser";

let inited = false;

export function ensureEmailJs() {
  if (inited) return;

  // Public Key aus den Umgebungsvariablen laden und trimmen
  const key = (import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "").trim();

  // Debug-Ausgaben (nur in der Konsole sichtbar)
  console.log("[EmailJS] key:", JSON.stringify(key), "len:", key?.length);
  console.log("[EmailJS] version:", (emailjs as any)?.version || "unknown");

  if (!key || typeof key !== "string") {
    console.error("[EmailJS] VITE_EMAILJS_PUBLIC_KEY fehlt/leer.");
    return;
  }

  // EmailJS v4 benötigt Objekt-Signatur
  emailjs.init({ publicKey: key });

  inited = true;
  console.log("[EmailJS] init OK");
}

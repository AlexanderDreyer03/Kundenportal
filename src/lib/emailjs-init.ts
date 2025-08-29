import emailjs from "@emailjs/browser";

let inited = false;

export function ensureEmailJs() {
  if (inited) return;

  const key = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  // Debug: siehst du später in der Browser-Konsole auf der Live-Seite
  console.log("[EmailJS] key:", JSON.stringify(key), "len:", key?.length);
  console.log("[EmailJS] version:", (emailjs as any)?.version || "unknown");

  if (!key || typeof key !== "string") {
    console.error("[EmailJS] VITE_EMAILJS_PUBLIC_KEY fehlt/leer.");
    return;
  }

  // WICHTIG: v4 benötigt Objekt-Signatur!
  emailjs.init({ publicKey: key });

  inited = true;
  console.log("[EmailJS] init OK");
}

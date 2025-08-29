import emailjs from "@emailjs/browser";

let inited = false;

export function ensureEmailJs() {
  if (inited) return;

  const key = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  // --- Debug: zeigt exakt, was ankommt
  console.log("[EmailJS] key:", JSON.stringify(key), "len:", key?.length);
  console.log("[EmailJS] version:", (emailjs as any)?.version || "unknown");

  if (!key || typeof key !== "string") {
    console.error("[EmailJS] VITE_EMAILJS_PUBLIC_KEY fehlt/ist leer.");
    return;
  }

  try {
    // v4 benötigt Objekt-Signatur:
    emailjs.init({ publicKey: key });
    inited = true;
    console.log("[EmailJS] init OK");
  } catch (e) {
    console.error("[EmailJS] init error:", e);
  }
}

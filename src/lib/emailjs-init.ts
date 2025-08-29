import emailjs from "@emailjs/browser";

let inited = false;

export function ensureEmailJs() {
  if (inited) return;

  const key = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  // Debug: zeigt genau, was im Build ankommt
  console.log("EmailJS key at runtime:", JSON.stringify(key), "(len:", key?.length, ")");

  if (!key) {
    console.error("EmailJS: VITE_EMAILJS_PUBLIC_KEY fehlt.");
    return;
  }

  // >>> v4-Korrektur: Objekt-Signatur verwenden
  // emailjs.init(key); // <-- alte (v3) Signatur, führt oft zu 'invalid'
  emailjs.init({ publicKey: key });

  inited = true;
}

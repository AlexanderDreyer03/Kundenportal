import emailjs from "@emailjs/browser";

let inited = false;

export function ensureEmailJs() {
  if (inited) return;

  const rawKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "";
  const key = rawKey.replace(/\r?\n|"/g, "").trim();

  console.log("[EmailJS] key:", key, "len:", key.length);
  console.log("[EmailJS] version:", (emailjs as any)?.version || "unknown");

  if (!key) {
    console.error("[EmailJS] VITE_EMAILJS_PUBLIC_KEY fehlt/leer.");
    return;
  }

  emailjs.init({ publicKey: key });

  inited = true;
  console.log("[EmailJS] init OK");
}

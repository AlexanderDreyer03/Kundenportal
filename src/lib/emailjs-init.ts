import emailjs from "@emailjs/browser";

let inited = false;

export function ensureEmailJs() {
  if (inited) return;
  const key = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  console.log("EmailJS key at runtime:", JSON.stringify(import.meta.env.VITE_EMAILJS_PUBLIC_KEY));

  if (!key) {
    console.error("EmailJS: VITE_EMAILJS_PUBLIC_KEY fehlt.");
    return;
  }
  emailjs.init(key);
  inited = true;
}

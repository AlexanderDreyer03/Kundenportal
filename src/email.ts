import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_cxh6jaq";
const TEMPLATE_ID = "template_f1ocakc";

export type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  message?: string;
};

/**
 * Mapping auf die Variablen deines EmailJS-Templates.
 * Falls dein Template andere Namen nutzt, hier anpassen.
 */
function mapPayload(p: ContactPayload) {
  return {
    from_name: p.name,
    reply_to: p.email,
    phone: p.phone ?? "",
    message: p.message ?? "",
  };
}

export async function sendContact(p: ContactPayload) {
  try {
    const res = await emailjs.send(SERVICE_ID, TEMPLATE_ID, mapPayload(p));
    return res;
  } catch (err: any) {
    console.error("EmailJS send error:", err);
    const msg =
      err?.text ||
      err?.message ||
      (typeof err === "string" ? err : "Unbekannter Fehler");
    throw new Error(msg);
  }
}

// Kompatibilität: alter Importname bleibt nutzbar

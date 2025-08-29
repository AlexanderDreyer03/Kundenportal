import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_cxh6jaq";
const TEMPLATE_ID = "template_f1ocakc";

export type ContactPayload = {
  name: string;
  email: string;
  phone?: string;

  // optionale Felder – falls du sie mitschickst
  topic?: string;          // z. B. ausgewählter Service
  customerType?: string;   // "Privatkunde" | "Gewerbekunde"
  message?: string;        // Freitext/Hinweis
  refLink?: string;        // window.location.href
};

/**
 * Superset-Mapping: bedient mehrere mögliche Template-Variablennamen.
 * So kommen deine Werte im EmailJS-Template an, egal ob du z. B.
 * {{from_name}} oder {{name}} benutzt, {{reply_to}} oder {{email}}, etc.
 */
function mapPayload(p: ContactPayload) {
  return {
    // Name
    from_name: p.name,
    name: p.name,

    // E-Mail
    reply_to: p.email,
    email: p.email,

    // Telefon
    phone: p.phone ?? "",

    // Thema
    topic: p.topic ?? "",
    thema: p.topic ?? "",

    // Kundentyp
    customer_type: p.customerType ?? "",
    kundentyp: p.customerType ?? "",

    // Nachricht / Hinweise
    message: p.message ?? "",
    notes: p.message ?? "",

    // Referenzlink
    ref_link: p.refLink ?? "",
    refLink: p.refLink ?? "",
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

/** Kompatibilitäts-Alias: alter Importname bleibt funktionsfähig */
export const sendAppointmentMail = (p: ContactPayload) => sendContact(p);

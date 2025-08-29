import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_cxh6jaq";
const TEMPLATE_ID = "template_f1ocakc";

export type ContactPayload = {
  name: string;
  email: string;
  phone?: string;

  topic?: string;          // z. B. ausgewählter Service/Thema
  customerType?: string;   // "Privatkunde" | "Gewerbekunde"
  message?: string;        // Freitext / Kommentar
  refLink?: string;        // window.location.href
};

/**
 * Superset-Mapping: deckt viele mögliche Platzhalter im EmailJS-Template ab.
 * -> Damit erscheinen Werte auch dann, wenn dein Template andere Variablennamen nutzt.
 */
function mapPayload(p: ContactPayload) {
  const msg = p.message ?? "";
  const topic = p.topic ?? "";
  const cust = p.customerType ?? "";
  const ref = p.refLink ?? "";

  return {
    // Name
    from_name: p.name,
    name: p.name,

    // E-Mail
    reply_to: p.email,
    email: p.email,

    // Telefon
    phone: p.phone ?? "",

    // Thema / Subject / Betreff
    topic,
    thema: topic,
    subject: topic,
    betreff: topic,

    // Kundentyp
    customer_type: cust,
    kundentyp: cust,
    kundenart: cust,

    // Kommentar / Nachricht / Hinweis / Wunsch (ALLE gängigen Aliasse)
    message: msg,
    notes: msg,
    info: msg,
    information: msg,
    informationen: msg,
    kommentar: msg,
    comments: msg,
    comment: msg,
    hinweis: msg,
    beschreibung: msg,
    details: msg,
    text: msg,
    nachricht: msg,
    wish: msg,
    wunsch: msg,

    // Referenz-Link / URL
    ref_link: ref,
    refLink: ref,
    ref: ref,
    url: ref,
    page_url: ref,
  };
}

export async function sendContact(p: ContactPayload) {
  try {
    const res = await emailjs.send(SERVICE_ID, TEMPLATE_ID, mapPayload(p));
    return res;
  } catch (err: any) {
    console.error("EmailJS send error:", err);
    const msg =
      err?.text || err?.message || (typeof err === "string" ? err : "Unbekannter Fehler");
    throw new Error(msg);
  }
}

/** Kompatibilitäts-Alias: alter Importname bleibt funktionsfähig */
export const sendAppointmentMail = (p: ContactPayload) => sendContact(p);

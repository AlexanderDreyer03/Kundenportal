import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_cxh6jaq";
const TEMPLATE_ID = "template_f1ocakc";

export type ContactPayload = {
  name: string;
  email: string;
  phone?: string;

  // zusätzliche Felder für bessere Darstellung
  topic?: string;          // z.B. ausgewählter Service
  customerType?: string;   // "Privatkunde" | "Gewerbekunde"
  message?: string;        // Freitext/Hinweis
  refLink?: string;        // window.location.href
};

/** Mappt unsere Payload exakt auf die Template-Variablen */
function mapPayload(p: ContactPayload) {
  return {
    from_name: p.name,
    reply_to: p.email,
    phone: p.phone ?? "",

    topic: p.topic ?? "",
    customer_type: p.customerType ?? "",
    message: p.message ?? "",
    ref_link: p.refLink ?? "",
  };
}

export async function sendContact(p: ContactPayload) {
  try {
    return await emailjs.send(SERVICE_ID, TEMPLATE_ID, mapPayload(p));
  } catch (err: any) {
    console.error("EmailJS send error:", err);
    const msg =
      err?.text || err?.message || (typeof err === "string" ? err : "Unbekannter Fehler");
    throw new Error(msg);
  }
}

// Kompatibilität
export const sendAppointmentMail = (p: ContactPayload) => sendContact(p);

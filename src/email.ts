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
 * Mapping der Payload auf die Template-Variablen in EmailJS.
 * 👉 Passe die Keys an, falls dein Template andere Variablennamen verwendet.
 * Standard bei EmailJS ist: from_name, reply_to, phone, message
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

// Kompatibilität: Falls noch irgendwo sendAppointmentMail importiert wird
export const sendAppointmentMail = (p: ContactPayload) => sendContact(p);

}

// Kompatibilität für vorhandenen Import in TerminBuchen.tsx
export const sendAppointmentMail = (p: ContactPayload) => sendContact(p);

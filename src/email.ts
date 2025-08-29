import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_cxh6jaq";
const TEMPLATE_ID = "template_f1ocakc";

export type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  message?: string;
};

function mapPayload(p: ContactPayload) {
  // ↳ Diese Keys müssen zu deinem EmailJS-Template passen!
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
    // ← Hier sehen wir den echten Grund (401/404/422 etc.)
    console.error("EmailJS send error:", err);
    const msg =
      err?.text || err?.message || (typeof err === "string" ? err : "Unknown EmailJS error");
    throw new Error(msg);
  }
}

// Kompatibilität für vorhandenen Import in TerminBuchen.tsx
export const sendAppointmentMail = (p: ContactPayload) => sendContact(p);

import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_cxh6jaq";
const TEMPLATE_ID = "template_f1ocakc";

// Gemeinsamer Payload-Typ (kannst du lassen/erweitern)
export type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  message?: string;
};

/** bestehende Funktion */
export function sendContact(data: ContactPayload) {
  return emailjs.send(SERVICE_ID, TEMPLATE_ID, {
    from_name: data.name,
    reply_to: data.email,
    phone: data.phone ?? "",
    message: data.message ?? "",
  });
}

/** ⚡ Kompatibilitäts-Alias für TerminBuchen.tsx */
export const sendAppointmentMail = (data: ContactPayload) => sendContact(data);

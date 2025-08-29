import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_cxh6jaq";
const TEMPLATE_ID = "template_f1ocakc";

/**
 * Sendet die Daten aus deinem Formular via EmailJS
 */
export function sendContact(data: {
  name: string;
  email: string;
  phone?: string;
  message?: string;
}) {
  return emailjs.send(SERVICE_ID, TEMPLATE_ID, {
    from_name: data.name,
    reply_to: data.email,
    phone: data.phone ?? "",
    message: data.message ?? "",
  });
}

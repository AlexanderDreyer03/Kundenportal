import emailjs from "@emailjs/browser";

type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  topic: string;
  customerType: string;
  message: string;
  refLink: string;
};

export async function sendAppointmentMail(p: ContactPayload) {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    throw new Error("EmailJS Konfiguration fehlt: Bitte .env prüfen");
  }

  const payload = {
    from_name: p.name,
    reply_to: p.email,
    phone: p.phone,
    topic: p.topic,
    customer_type: p.customerType,
    message: p.message,
    ref_link: p.refLink,
  };

  console.log("[EmailJS] sende Payload:", payload);

  return emailjs.send(serviceId, templateId, payload, publicKey);
}

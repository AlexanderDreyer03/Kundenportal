// src/email.ts
import { send } from "@emailjs/browser";

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;

export type AppointmentPayload = {
  topic: string;
  name: string;
  phone?: string;
  email?: string;
  wish?: string;
  refLink?: string;
  source?: string;
  when?: string;
  page?: string;
};

export async function sendAppointmentMail(data: AppointmentPayload) {
  const params = {
    topic: data.topic,
    name: data.name,
    phone: data.phone ?? "",
    email: data.email ?? "",
    wish: data.wish ?? "",
    refLink: data.refLink ?? "",
    source: data.source ?? "",
    when: data.when ?? new Date().toLocaleString(),
    page: typeof window !== "undefined" ? window.location.href : "",
  };

  return send(SERVICE_ID, TEMPLATE_ID, params, PUBLIC_KEY);
}

import emailjs from "@emailjs/browser";

export interface ContactPayload {
  topic?: string;
  name: string;
  phone?: string;
  email?: string;
  message?: string;
  refLink?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

function mapPayload(p: ContactPayload) {
  return {
    topic: p.topic,
    from_name: p.name,
    phone: p.phone,
    reply_to: p.email,
    message: p.message,

    // Ref-Link
    ref_link: p.refLink,
    url: p.refLink,

    // Referral
    referrer: p.referrer,
    empfohlen_von: p.referrer,
    empfehlung: p.referrer,

    // UTM
    utm_source: p.utmSource,
    utm_medium: p.utmMedium,
    utm_campaign: p.utmCampaign,
  };
}

export async function sendAppointmentMail(p: ContactPayload) {
  try {
    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID!,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID!,
      mapPayload(p),
      { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
    );
  } catch (err) {
    console.error("EmailJS send error:", err);
    throw err;
  }
}

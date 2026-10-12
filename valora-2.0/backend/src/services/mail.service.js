import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendMailService = async ({ to, subject, text, html }) => {
  const msg = {
    to,
    from: {
      email: process.env.EMAIL_FROM,
      name: "Valora",
    },
    subject,
    text,
    html,
    trackingSettings: {
      clickTracking: {
        enable: false,
      },
    },
  };

  await sgMail.send(msg);

  return true;
};
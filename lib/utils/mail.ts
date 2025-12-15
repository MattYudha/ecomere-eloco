import nodemailer from 'nodemailer';

type SendMailOptions = {
  to: string;
  subject: string;
  html: string;
};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendMail = async ({ to, subject, html }: SendMailOptions) => {
  // Supaya build tidak gagal walau SMTP belum diset
  if (!process.env.SMTP_USER) {
    console.warn('[MAIL] SMTP not configured. Email skipped.');
    return;
  }

  await transporter.sendMail({
    from: `"Eloco Store" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};

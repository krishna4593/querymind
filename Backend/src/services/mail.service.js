import nodemailer from "nodemailer";
import dns from "node:dns";

// Force Node.js to prefer IPv4 over IPv6
dns.setDefaultResultOrder("ipv4first");

// Debug (remove after testing)
console.log("GOOGLE_USER:", process.env.GOOGLE_USER);
console.log(
  "APP_PASSWORD EXISTS:",
  !!process.env.GOOGLE_APP_PASSWORD
);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // STARTTLS
  requireTLS: true,

  auth: {
    user: process.env.GOOGLE_USER,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },

  family: 4, // Force IPv4
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,

  tls: {
    rejectUnauthorized: false,
  },
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email server connection failed:", error);
  } else {
    console.log("✅ Email server is ready to send messages");
  }
});

export async function sendEmail({
  to,
  subject,
  text = "",
  html = "",
}) {
  try {
    const info = await transporter.sendMail({
      from: `"QueryMind" <${process.env.GOOGLE_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("✅ Email sent successfully!");
    console.log("Message ID:", info.messageId);

    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
}
import nodemailer from "nodemailer";
import { google } from "googleapis";
import dns from "dns";

// Force Node to prefer IPv4 over IPv6
dns.setDefaultResultOrder("ipv4first");

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

async function createTransporter() {
  try {
    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // STARTTLS
      auth: {
        type: "OAuth2",
        user: process.env.GOOGLE_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.verify();
    console.log("✅ Email server is ready to send messages");

    return transporter;
  } catch (error) {
    console.error("❌ Error creating email transporter:", error);
    throw error;
  }
}

export async function sendEmail({
  to,
  subject,
  text = "",
  html = "",
}) {
  try {
    const transporter = await createTransporter();

    const info = await transporter.sendMail({
      from: `"QueryMind" <${process.env.GOOGLE_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("✅ Message sent:", info.messageId);

    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
}
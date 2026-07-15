import nodemailer from "nodemailer";
import { google } from "googleapis";

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

async function createTransporter() {
  try {
    const accessTokenResponse = await oAuth2Client.getAccessToken();

    const accessToken =
      typeof accessTokenResponse === "string"
        ? accessTokenResponse
        : accessTokenResponse?.token;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GOOGLE_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken,
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
      from: process.env.GOOGLE_USER,
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

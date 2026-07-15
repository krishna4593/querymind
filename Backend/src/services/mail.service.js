import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // SSL
  auth: {
    user: process.env.GOOGLE_USER,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

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
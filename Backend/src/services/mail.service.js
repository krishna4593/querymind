import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  text = "",
  html = "",
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: "QueryMind <onboarding@resend.dev>",
      to,
      subject,
      text,
      html,
    });

    if (error) {
      console.error("❌ Resend Error:", error);
      throw new Error(error.message);
    }

    console.log("✅ Email sent successfully");
    console.log(data);

    return data;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
}
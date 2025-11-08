import { resend, sender } from "../config/resend.js";
import { getWelcomeEmailTemplate } from "./emailTemplate.js";

export const sendWelcomeEmail = async (email: string, name: string) => {
  try {
    const response = await resend.emails.send({
      from: `${sender.name} <${sender.email}>`,
      to: email,
      subject: "Welcome to Chatify 💬",
      html: getWelcomeEmailTemplate(name),
    });

    const { data, error } = response;

    if (error) {
      console.error(" esend error:", error);
      return { success: false, error };
    }

    if (data) {
      console.log("Email sent successfully. ID:", data.id);
      return { success: true, id: data.id };
    }

    
  

  } catch (err) {
    console.error("Failed to send email:", err);
    return { success: false, error: err };
  }
};

import nodemailer from "nodemailer";
import config from "../config/config.js";

export class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      port: 465,
      auth: {
        user: config.EMAIL_FROM,
        pass: config.EMAIL_APP_PASSWORD,
      },
    });
  }

  async sendEmail(to, subject, content) {
    const mailOptions = {
      from: config.EMAIL_FROM,
      to: to,
      subject: subject,
      html: content,
    };
    console.log("HIhi");
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Email sent: %s", info.messageId);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
}

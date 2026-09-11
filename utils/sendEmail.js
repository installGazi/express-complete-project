import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, text, html }) => {
  console.log(`📧 Attempting to send email to: ${to}`);

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("❌ SMTP credentials missing!");
    throw new Error("SMTP_USER বা SMTP_PASS সেট করা নেই!");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: { rejectUnauthorized: false },
  });

  const mailOptions = {
    from: process.env.SMTP_FROM || "noreply@yourapp.com",
    to,
    subject,
    text,
    html: html || text,
  };

  try {
    console.log("📤 Sending email...");
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent! Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Email error: ${error.message}`);
    throw new Error(`Email পাঠানো সম্ভব হয়নি: ${error.message}`);
  }
};

export default sendEmail;
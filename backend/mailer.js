const nodemailer = require("nodemailer");

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // Use true for 465, false for 587
    auth: { user, pass },
    tls: {
      rejectUnauthorized: false
    }
  });
}

async function sendVerificationEmail({ to, verificationUrl }) {
  const transporter = getTransporter();
  if (!transporter) return { sent: false, reason: "smtp_not_configured" };

  const from = process.env.FROM_EMAIL || process.env.SMTP_USER;
  const appName = process.env.APP_NAME || "ZigNote";

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject: `Verify your email for ${appName}`,
      text: `Verify your email by opening this link:\n\n${verificationUrl}\n\nIf you did not create an account, ignore this email.`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5">
          <h2 style="margin:0 0 12px 0;">Verify your email</h2>
          <p>Click the button below to verify your email for <b>${appName}</b>.</p>
          <p style="margin:16px 0;">
            <a href="${verificationUrl}" style="background:#2563EB;color:#fff;padding:10px 14px;border-radius:10px;text-decoration:none;display:inline-block;">
              Verify Email
            </a>
          </p>
          <p style="color:#475569;font-size:13px;">If the button doesn’t work, copy and paste this link:</p>
          <p style="font-size:13px;"><a href="${verificationUrl}">${verificationUrl}</a></p>
        </div>
      `,
    });
    return { sent: true, messageId: info?.messageId };
  } catch (err) {
    return { sent: false, reason: "smtp_error", error: err?.message || String(err) };
  }
}

module.exports = { sendVerificationEmail };


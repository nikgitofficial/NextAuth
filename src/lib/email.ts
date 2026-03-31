import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL ?? "noreply@example.com";
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "AuthSystem";

export async function sendOTPEmail(email: string, otp: string, name?: string) {
  const displayName = name ?? email.split("@")[0];

  return resend.emails.send({
    from: `${APP_NAME} <${FROM}>`,
    to: email,
    subject: `${otp} is your ${APP_NAME} reset code`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset OTP</title>
</head>
<body style="margin:0;padding:0;background:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;min-height:100vh;">
    <tr>
      <td align="center" style="padding:48px 16px;">
        <table width="100%" max-width="480" cellpadding="0" cellspacing="0" style="max-width:480px;background:#18181b;border:1px solid #27272a;border-radius:16px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px;background:linear-gradient(135deg,#4f46e5,#6366f1);text-align:center;">
              <div style="display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;background:rgba(255,255,255,0.15);border-radius:12px;margin-bottom:16px;">
                <span style="font-size:24px;">🔐</span>
              </div>
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">${APP_NAME}</h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.7);font-size:14px;">Password Reset Request</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 8px;color:#a1a1aa;font-size:14px;">Hello, ${displayName}</p>
              <p style="margin:0 0 28px;color:#e4e4e7;font-size:15px;line-height:1.6;">
                We received a request to reset your password. Use the verification code below to continue.
              </p>
              <!-- OTP Box -->
              <div style="background:#09090b;border:1px solid #3f3f46;border-radius:12px;padding:28px;text-align:center;margin-bottom:28px;">
                <p style="margin:0 0 8px;color:#71717a;font-size:12px;text-transform:uppercase;letter-spacing:2px;font-weight:600;">Your verification code</p>
                <div style="letter-spacing:16px;font-size:40px;font-weight:800;color:#818cf8;font-family:'Courier New',monospace;padding-left:16px;">${otp}</div>
                <p style="margin:12px 0 0;color:#71717a;font-size:13px;">Expires in <strong style="color:#a1a1aa;">15 minutes</strong></p>
              </div>
              <p style="margin:0 0 8px;color:#71717a;font-size:13px;line-height:1.6;">
                If you didn't request a password reset, you can safely ignore this email. Your account remains secure.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 32px;border-top:1px solid #27272a;text-align:center;">
              <p style="margin:0;color:#52525b;font-size:12px;">
                © ${new Date().getFullYear()} ${APP_NAME} · Sent with ❤️
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  });
}

export async function sendWelcomeEmail(email: string, name: string) {
  return resend.emails.send({
    from: `${APP_NAME} <${FROM}>`,
    to: email,
    subject: `Welcome to ${APP_NAME}!`,
    html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:48px 16px;">
        <table width="100%" max-width="480" cellpadding="0" cellspacing="0" style="max-width:480px;background:#18181b;border:1px solid #27272a;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:32px 40px 24px;background:linear-gradient(135deg,#4f46e5,#6366f1);text-align:center;">
              <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">Welcome, ${name}! 👋</h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.7);font-size:14px;">Your account is ready</p>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 40px;">
              <p style="color:#e4e4e7;font-size:15px;line-height:1.6;">
                Thanks for joining <strong style="color:#818cf8;">${APP_NAME}</strong>. Your account has been created successfully and is ready to use.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 40px 32px;border-top:1px solid #27272a;text-align:center;">
              <p style="margin:0;color:#52525b;font-size:12px;">© ${new Date().getFullYear()} ${APP_NAME}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  });
}

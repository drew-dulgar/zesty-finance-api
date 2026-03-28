import { routes } from 'zesty-finance-shared';
import { APP_ORIGIN_URL } from '../../../config/env.js';
import emailLayout from './layout.js';

type EmailUser = {
  name: string;
  email: string;
  firstName?: string | null;
};

const emailVerifyEmailAddress = (user: EmailUser, url: string) => {
  const greeting = user.firstName
    ? `Welcome, ${user.firstName}!`
    : 'Welcome to Zesty Finance!';

  const content = `
    <h2 style="margin:0 0 6px;color:#1B3A5C;font-size:26px;font-weight:800;line-height:1.2;">
      Verify your email address
    </h2>
    <p style="margin:0 0 28px;color:#6B7A8D;font-size:16px;">${greeting}</p>

    <p style="margin:0 0 16px;color:#3D4A5C;font-size:16px;line-height:1.7;">
      Thanks for signing up. To activate your account and start using Zesty Finance, please verify your email address by clicking the button below.
    </p>

    <p style="margin:0 0 28px;color:#3D4A5C;font-size:16px;line-height:1.7;">
      This is a one-time step to confirm that this email address belongs to you and helps keep your account secure.
    </p>

    <!-- CTA button -->
    <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin:0 0 32px;">
      <tr>
        <td style="background-color:#00C9B1;border-radius:8px;mso-padding-alt:0;">
          <a href="${url}" style="display:inline-block;padding:14px 36px;color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;letter-spacing:0.02em;border-radius:8px;line-height:1.4;">
            Verify Email Address
          </a>
        </td>
      </tr>
    </table>

    <!-- Fallback link -->
    <p style="margin:0 0 8px;color:#6B7A8D;font-size:14px;line-height:1.6;">
      If the button doesn't work, paste this link into your browser:
    </p>
    <p style="margin:0 0 32px;word-break:break-all;">
      <a href="${url}" style="color:#00C9B1;font-size:13px;text-decoration:underline;">${url}</a>
    </p>

    <!-- Expiry notice -->
    <div style="background-color:#f0f4f3;border-radius:8px;padding:18px 20px;margin-bottom:8px;">
      <p style="margin:0;color:#3D4A5C;font-size:14px;line-height:1.6;">
        <strong style="color:#1B3A5C;">This link expires in 24 hours.</strong>
        If it expires, you can request a new verification email from the
        <a href="${APP_ORIGIN_URL}${routes.account.login}" style="color:#00C9B1;text-decoration:underline;">sign-in page</a>.
      </p>
    </div>
  `;

  return {
    subject: 'Verify your Zesty Finance email address',
    html: emailLayout({
      title: 'Verify your email address',
      preheader: `${greeting} Please verify your email address to activate your Zesty Finance account.`,
      content,
    }),
  };
};

export default emailVerifyEmailAddress;

import { routes } from 'zesty-finance-shared';
import { APP_ORIGIN_URL } from '../../../config/env.js';
import emailLayout from './layout.js';

type EmailUser = {
  name: string;
  email: string;
  firstName?: string | null;
};

const emailChangeEmailConfirmation = (
  user: EmailUser,
  newEmail: string,
  url: string,
) => {
  const greeting = user.firstName ? `Hi ${user.firstName},` : 'Hi there,';

  const content = `
    <h2 style="margin:0 0 6px;color:#1B3A5C;font-size:26px;font-weight:800;line-height:1.2;">
      Confirm your email change
    </h2>
    <p style="margin:0 0 28px;color:#6B7A8D;font-size:16px;">${greeting}</p>

    <p style="margin:0 0 16px;color:#3D4A5C;font-size:16px;line-height:1.7;">
      We received a request to change the email address on your Zesty Finance account.
    </p>

    <!-- Change summary -->
    <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="width:100%;margin:0 0 28px;border-radius:8px;overflow:hidden;border:1px solid #dde6df;">
      <tr>
        <td style="background-color:#f0f4f3;padding:14px 20px;border-bottom:1px solid #dde6df;">
          <p style="margin:0;color:#6B7A8D;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;">Current email</p>
          <p style="margin:4px 0 0;color:#1B3A5C;font-size:15px;font-weight:600;">${user.email}</p>
        </td>
      </tr>
      <tr>
        <td style="background-color:#FAFAF7;padding:14px 20px;">
          <p style="margin:0;color:#6B7A8D;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;">New email</p>
          <p style="margin:4px 0 0;color:#00C9B1;font-size:15px;font-weight:600;">${newEmail}</p>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 28px;color:#3D4A5C;font-size:16px;line-height:1.7;">
      To confirm this change, click the button below. After confirming, you will sign in using <strong style="color:#1B3A5C;">${newEmail}</strong>.
    </p>

    <!-- CTA button -->
    <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin:0 0 32px;">
      <tr>
        <td style="background-color:#00C9B1;border-radius:8px;mso-padding-alt:0;">
          <a href="${url}" style="display:inline-block;padding:14px 36px;color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;letter-spacing:0.02em;border-radius:8px;line-height:1.4;">
            Confirm Email Change
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

    <!-- Warning notice -->
    <div style="border-left:3px solid #F4845F;background-color:#fff7f4;border-radius:0 8px 8px 0;padding:18px 20px;margin-bottom:24px;">
      <p style="margin:0 0 8px;color:#1B3A5C;font-size:14px;font-weight:700;line-height:1.4;">
        This link expires in 1 hour
      </p>
      <p style="margin:0;color:#3D4A5C;font-size:14px;line-height:1.6;">
        If it expires, you can initiate a new email change from your
        <a href="${APP_ORIGIN_URL}${routes.account.settings.email}" style="color:#00C9B1;text-decoration:underline;">account settings</a>.
      </p>
    </div>

    <!-- Didn't request notice -->
    <div style="background-color:#f0f4f3;border-radius:8px;padding:18px 20px;">
      <p style="margin:0;color:#3D4A5C;font-size:14px;line-height:1.6;">
        <strong style="color:#1B3A5C;">Didn't request this change?</strong>
        Your account is safe — ignore this email and your email address will remain unchanged.
        If you're concerned about unauthorized access, consider
        <a href="${APP_ORIGIN_URL}${routes.account.settings.password}" style="color:#00C9B1;text-decoration:underline;">changing your password</a>.
      </p>
    </div>
  `;

  return {
    subject: 'Confirm your Zesty Finance email change',
    html: emailLayout({
      title: 'Confirm your email change',
      preheader: `${greeting} Confirm your request to change your Zesty Finance email address to ${newEmail}.`,
      content,
    }),
  };
};

export default emailChangeEmailConfirmation;

type EmailLayoutOptions = {
  title: string;
  preheader?: string;
  content: string;
};

const emailLayout = ({
  title,
  preheader = '',
  content,
}: EmailLayoutOptions): string => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f4f3;font-family:'DM Sans',Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">

  <!-- Preheader text (hidden, shows in inbox preview) -->
  <div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:#f0f4f3;">${preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background-color:#f0f4f3;">
    <tr>
      <td align="center" style="padding:48px 20px;">

        <!-- Email container (max 600px) -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background-color:#1B3A5C;padding:32px 40px;border-radius:12px 12px 0 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                <tr>
                  <td>
                    <p style="margin:0;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.02em;line-height:1;">
                      Zesty&nbsp;<span style="color:#00C9B1;">Finance</span>
                    </p>
                    <div style="width:36px;height:3px;background-color:#00C9B1;margin-top:10px;border-radius:2px;"></div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:#FAFAF7;padding:40px 40px 32px;border-left:1px solid #dde6df;border-right:1px solid #dde6df;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#1B3A5C;padding:24px 40px;border-radius:0 0 12px 12px;">
              <p style="margin:0 0 6px;color:rgba(255,255,255,0.55);font-size:12px;line-height:1.6;">
                You're receiving this email because you have an account with Zesty Finance. If you didn't request this, you can safely ignore it — no action is required.
              </p>
              <p style="margin:0;color:rgba(255,255,255,0.3);font-size:11px;">
                &copy; ${new Date().getFullYear()} Zesty Finance. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;

export default emailLayout;

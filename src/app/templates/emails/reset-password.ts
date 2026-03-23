const emailResetPasswordTemplate = (url: string) => ({
  subject: 'Reset your password',
  html: `<p>Click <a href="${url}">here</a> to reset your password. This link expires in 1 hour.</p>`,
});

export default emailResetPasswordTemplate;
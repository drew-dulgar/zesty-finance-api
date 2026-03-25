const emailVerifyEmailAddress = (url: string) => ({
  subject: 'Verify your email address',
  html: `<p>Click <a href="${url}">here</a> to verify your email address.</p>`,
});

export default emailVerifyEmailAddress;

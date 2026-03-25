import nodemailer from 'nodemailer';
import { MAIL } from './env.js';

const mailer = nodemailer.createTransport({
  host: MAIL.HOST,
  port: MAIL.PORT,
  secure: MAIL.PORT === 465,
  auth: {
    user: MAIL.USER,
    pass: MAIL.PASSWORD,
  },
});

export const sendMail = (options: {
  to: string;
  subject: string;
  html: string;
}) => mailer.sendMail({ from: MAIL.FROM, ...options });

export default mailer;

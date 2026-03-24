import { betterAuth } from 'better-auth';
import { kyselyAdapter } from '@better-auth/kysely-adapter';
import zestyFinanceDb from '../db/zesty-finance-db.js';
import { emailVerifyEmailAddress, emailResetPassword } from '../app/templates/emails/index.js';
import {
  BETTER_AUTH_SECRET,
  APP_BASE_URL,
  APP_ORIGIN_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  APPLE_CLIENT_ID,
  APPLE_CLIENT_SECRET,
  APPLE_APP_BUNDLE_IDENTIFIER,
} from './env.js';
import databaseHooks from './authHooks.js';
import { sendMail } from './mailer.js';
import { AccountRepository } from '../app/repositories/index.js';
import logger from '../app/lib/logger.js';

export const auth = betterAuth({
  baseURL: APP_BASE_URL,
  basePath: '/auth',
  trustedOrigins: [APP_ORIGIN_URL as string],
  secret: BETTER_AUTH_SECRET,
  database: kyselyAdapter(zestyFinanceDb, { type: 'postgres' }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    onExistingUserSignUp: async ({ user }, request) => {
      if (!user.emailVerified) {
        await auth.api.sendVerificationEmail({
          body: { email: user.email },
          headers: request?.headers,
        }).catch((e) => logger.error('onExistingUserSignUp error:', e));
      }
    },
    sendResetPassword: async ({ user, url }) => {
      await sendMail({
        to: user.email,
        ...emailResetPassword(url)
      }).catch((e) => logger.error('sendResetPassword error:', e));
    },
    onPasswordReset: async ({ user }) => {
      await AccountRepository.logs.resetPassword(user.id, { actor_id: user.id })
        .catch((e) => logger.error('onPasswordReset error:', e));
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendMail({
        to: user.email,
        ...emailVerifyEmailAddress(url)
      }).catch((e) => logger.error('sendVerificationEmail error:', e));
    },
    afterEmailVerification: async (user) => {
      await AccountRepository.logs.verifyEmail(user.id, { actor_id: user.id })
        .catch((e) => logger.error('afterEmailVerification error:', e));
    },
  },
  socialProviders: {
    google: {
      clientId: GOOGLE_CLIENT_ID as string,
      clientSecret: GOOGLE_CLIENT_SECRET as string,
    },
    apple: {
      clientId: APPLE_CLIENT_ID as string,
      clientSecret: APPLE_CLIENT_SECRET as string,
      appBundleIdentifier: APPLE_APP_BUNDLE_IDENTIFIER as string,
    },
  },
  user: {
    modelName: 'accounts',
    fields: {
      emailVerified: 'email_verified',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    additionalFields: {
      firstName: { type: 'string', required: false, fieldName: 'first_name' },
      lastName: { type: 'string', required: false, fieldName: 'last_name' },
      username: { type: 'string', required: false },
      signInCount: { type: 'number', required: false, fieldName: 'sign_in_count' },
      signInAt: { type: 'date', required: false, fieldName: 'sign_in_at' },
      isActive: { type: 'boolean', required: false, fieldName: 'is_active' },
      isDeleted: { type: 'boolean', required: false, fieldName: 'is_deleted' },
    },
  },
  session: {
    modelName: 'sessions',
    fields: {
      userId: 'account_id',
      expiresAt: 'expires_at',
      ipAddress: 'ip_address',
      userAgent: 'user_agent',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
  account: {
    modelName: 'account_providers',
    fields: {
      userId: 'account_id',
      accountId: 'provider_account_id',
      providerId: 'provider_id',
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
      idToken: 'id_token',
      accessTokenExpiresAt: 'access_token_expires_at',
      refreshTokenExpiresAt: 'refresh_token_expires_at',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
  verification: {
    modelName: 'account_verifications',
    fields: {
      expiresAt: 'expires_at',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
  databaseHooks,
  advanced: {
    database: {
      generateId: 'uuid',
    },
  },
  experimental: {
    joins: true,
  },
});

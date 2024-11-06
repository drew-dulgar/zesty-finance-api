import type { Transaction } from 'kysely';
import type { ZestyFinanceDB, AccountSelectable } from '../repositories/zesty-finance-db.js';

import crypto from 'crypto';
import zestyFinanceDb from '../../db/zesty-finance-db.js';
import { AccountRepository } from '../repositories/index.js';
import { selectableToCamel } from '../utils/objects.js';
import { AccountPlanService } from './index.js';

export type Account = {
  id?: number;
  accountPlanId?: number;
  username?: string | null;
  email?: string;
  emailVerified?: boolean;
  salt?: Buffer | null;
  password?: Buffer | null;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  loginLast?: Date | string | null;
  loginAttempts?: number;
  loginLockedUntil?: Date | string | null;
  isDeleted?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

const getCryptoHash_pbkdf2 = (password: string | Buffer, salt: Buffer): Promise<Buffer> => new Promise((resolve, reject) => {
  const iterations: number = 50000;
  const keylen: number = 64;
  const digest: string = 'sha512';

  crypto.pbkdf2(password, salt, iterations, keylen, digest, (err, hashedPassword) => {
    if (err) {
      reject(err);
    } else {
      resolve(hashedPassword);
    }
  })
});

const getSalt = (): Buffer => crypto.randomBytes(16);


const authenticate = async (
  email: string,
  password: string
): Promise<Partial<Account> | null> => {
  const maxLoginAttempts = 5;

  const response = await zestyFinanceDb.transaction().execute(async (trx: Transaction<ZestyFinanceDB>) => {
    const account = await AccountRepository.get({
      select: ['id', 'email', 'username', 'salt', 'password', 'login_attempts', 'login_last', 'login_locked_until'],
      where: {
        email,
        isDeleted: false
      },
      limit: 1,
    }, trx)
      .forUpdate()
      .executeTakeFirstOrThrow();

    if (account && account.id && account.salt && account.password) {
      const hashedPassword = await getCryptoHash_pbkdf2(password, account.salt);

      if (crypto.timingSafeEqual(account.password, hashedPassword)) {
        // successful login, reset the login information
        await AccountRepository.updateAuthenticateAttempt(account.id, {
          loginLast: new Date(),
        }, trx);

        return selectableToCamel<AccountSelectable, Account>(account);
      }

      // failed login, mark it as such
      await AccountRepository.updateAuthenticateAttempt(account.id, {
        loginAttempts: (account.login_attempts || 0) + 1,
      }, trx);
    }

    return null;
  });

  return response;
}

const getWithPlanAndRoles = async (
  accountId: number,
  isDeleted: boolean = false
): Promise<Account> => {
  const account = await AccountRepository.get({
    includes: {
      plan: true,
      roles: true,
    },
    where: {
      id: accountId,
      isDeleted,
    },
    limit: 1,
  }).executeTakeFirstOrThrow();

  return selectableToCamel<AccountSelectable, Account>(account);
}

const getEmailExists = async (
  email: string
): Promise<boolean> => {
  const account = await AccountRepository.get({
    select: ['id'],
    where: {
      email
    },
    limit: 1
  }).executeTakeFirst();


  return account && account.id ? true : false;
}

const getUsernameExists = async (
  username: string
): Promise<boolean> => {
  const account = await AccountRepository.get({
    select: ['id'],
    where: {
      username,
    },
    limit: 1
  })
    .executeTakeFirst();

  return account && account.id > 0 ? true : false;
}


const create = async (
  account: Account,
): Promise<Account | undefined> => {

  if (typeof account.accountPlanId === undefined || !account.accountPlanId) {
    const defaultAccountPlan = await AccountPlanService.getDefaultPlan();

    account.accountPlanId = defaultAccountPlan.id;
  }

  if (typeof account.password !== 'undefined' && account.password) {
    account.salt = getSalt();
    account.password = await getCryptoHash_pbkdf2(account.password, account.salt);
  }

  const response = await AccountRepository.create(account);

  if (response) {
    return selectableToCamel<Partial<AccountSelectable>, Account>(response);
  }
}

export default {
  getWithPlanAndRoles,
  getEmailExists,
  getUsernameExists,
  authenticate,
  create
}
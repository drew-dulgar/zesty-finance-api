
import crypto from 'crypto';
import { Account } from '../models/index';
import { AccountPlanService } from '../services/index';
import BaseService from './BaseService';


const cryptoHash_pbkdf2 = (password, salt) => new Promise((resolve, reject) => {
  const iterations = 50000;
  const keylen = 64;
  const digest = 'sha512';

  crypto.pbkdf2(password, salt, iterations, keylen, digest, (err, hashedPassword) => {
    if (err) {
      reject(err);
    } else {
      resolve(hashedPassword);
    }
  })
});

class AccountService extends BaseService {
  async authenticate(email, password) {
    const account = await this.get({ email, isActive: true, isDeleted: false })
      .select(this.columns(Account.tableName, 'salt', 'password'))
      .limit(1)
      .first();

    if (account) {
      const hashedPassword = await cryptoHash_pbkdf2(password, account.salt);


      if (crypto.timingSafeEqual(account.password, hashedPassword)) {
        
        delete account.salt;
        delete account.password;
        
        return account;
      }
    }

    return null;
  }

  get({
    id,
    username,
    email,
    isActive,
    isDeleted = false
  } = {}) {
    const query = Account.query()
      .select(this.columns(Account.tableName, 'id', 'username', 'email', 'email_verified', 'first_name', 'middle_name', 'last_name', 'last_login', 'is_active', 'is_deleted', 'created_at', 'updated_at'))
      .withGraphJoined({
        accountRoles: true,
        accountPlan: true
      })

    if (typeof id !== 'undefined') {
      if (Array.isArray(id)) {
        query.where(`${Account.tableName}.id`, id);
      } else {
        query.whereIn(`${Account.tableName}.id`, id);
      }
    }

    if (typeof username !== 'undefined') {
      query.where(`${Account.tableName}.username`, username);
    }

    if (typeof email !== 'undefined') {
      query.where(`${Account.tableName}.email`, email);
    }

    if (typeof isActive !== 'undefined') {
      query.where(`${Account.tableName}.is_active`, isActive);
    }

    if (typeof isDeleted !== 'undefined') {
      query.where(`${Account.tableName}.is_deleted`, isDeleted);
    }

    return query;
  }

  getOne(id) {
    return this.get().findById(id);
  }

  async create({
    accountPlanId,
    username,
    email,
    emailVerified,
    password,
    firstName,
    middleName,
    lastName,
    isActive = false,
    isDeleted = false
  } = {}) {
    const insert = {};

    if (typeof accountPlanId !== 'undefined') {
      insert.account_plan_id = accountPlanId;
    }

    if (typeof username !== 'undefined') {
      insert.username = username;
    }

    if (typeof email !== 'undefined') {
      insert.email = email;
    }

    if (typeof emailVerified !== 'undefined') {
      insert.email_verified = emailVerified;
    }

    if (typeof password !== 'undefined') {
      insert.salt = crypto.randomBytes(16);
      insert.password = await cryptoHash_pbkdf2(password, insert.salt);
    }

    if (typeof firstName !== 'undefined') {
      insert.first_name = firstName;
    }

    if (typeof middleName !== 'undefined') {
      insert.middle_name = middleName;
    }

    if (typeof lastName !== 'undefined') {
      insert.last_name = lastName;
    }

    if (typeof isActive !== 'undefined') {
      insert.is_active = isActive;
    }

    if (typeof isDeleted !== 'undefined') {
      insert.is_deleted = isDeleted;
    }

    return Account.query().insert(insert).returning('*');
  }

  update = (
    update = {
      username,
      email,
      emailVerified,
      firstName,
      middleName,
      lastName,
      lastLogin,
      isActive,
      isDeleted
    } = {},
    where = {
      id
    } = {},
    limit
  ) => {

    if (Object.keys(where).length === 0) {
      throw new Error('AccountService.update where clause not specified.');
    }

    const query = Account.query();

    if (typeof update.username !== 'undefined') {
      query.patch({ username: update.username });
    }

    if (typeof update.email !== 'undefined') {
      query.patch({ email: update.email });
    }

    if (typeof update.emailVerified !== 'undefined') {
      query.patch({ email_verified: emailVerified });
    }

    if (typeof update.firstName !== 'undefined') {
      query.patch({ first_name: update.firstName });
    }

    if (typeof update.middleName !== 'undefined') {
      query.patch({ middle_name: update.middleName });
    }

    if (typeof update.lastName !== 'undefined') {
      query.patch({ last_name: update.lastName });
    }

    if (typeof update.lastLogin !== 'undefined') {
      query.patch({ last_login: update.lastLogin });
    }

    if (typeof update.isActive !== 'undefined') {
      query.patch({ is_active: isActive });
    }

    if (typeof update.isDeleted !== 'undefined') {
      query.patch({ is_deleted: isDeleted });
    }

    if (typeof where.id !== 'undefined') {
      query.where('id', where.id);
    }

    if (typeof limit !== 'undefined') {
      query.limit(limit);
    }

    return query;
  }

}

export default new AccountService();
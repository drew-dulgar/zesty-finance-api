import type { Request, Response, NextFunction } from 'express';
import type { AccountUpdateUserInput, AccountUpdateUsernameInput } from 'zesty-finance-shared';
import { AccountRepository } from '../../repositories/index.js';

const get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.send({
      authenticated: req.authenticated,
      authorized: req.authorized.actions || {},
      account: req.account
    });
  } catch (error) {
    next(error);
  }
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, firstName, lastName } = req.body as AccountUpdateUserInput;
    const fields = {
      name,
      ...(firstName !== undefined && { first_name: firstName }),
      ...(lastName !== undefined && { last_name: lastName }),
    };
    await sleep(2000);
    await AccountRepository.update(req.account!.id, fields);
    res.send({ success: true });
  } catch (error) {
    next(error);
  }
};

const updateUsername = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username } = req.body as AccountUpdateUsernameInput;
    await AccountRepository.update(req.account!.id, { username });
    res.send({ success: true });
  } catch (error) {
    next(error);
  }
};

export default {
  get,
  updateProfile,
  updateUsername,
}

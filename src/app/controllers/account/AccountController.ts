import type { NextFunction, Request, Response } from 'express';
import type {
  AccountData,
  AccountUpdateProfileInput,
  AccountUpdateProfileResponse,
  AccountUpdateUsernameInput,
  AccountUpdateUsernameResponse,
} from 'zesty-finance-shared';
import { AccountRepository } from '../../repositories/index.js';

const get = async (
  req: Request,
  res: Response<AccountData>,
  next: NextFunction,
): Promise<void> => {
  try {
    res.send({
      authenticated: req.authenticated,
      authorized: req.authorized.actions || {},
      account: req.account,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (
  req: Request,
  res: Response<AccountUpdateProfileResponse>,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, firstName, lastName } = req.body as AccountUpdateProfileInput;
    const fields = {
      name,
      ...(firstName !== undefined && { first_name: firstName }),
      ...(lastName !== undefined && { last_name: lastName }),
    };
    await AccountRepository.update(req.account!.id, fields);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

const updateUsername = async (
  req: Request,
  res: Response<AccountUpdateUsernameResponse>,
  next: NextFunction,
): Promise<void> => {
  try {
    const { username } = req.body as AccountUpdateUsernameInput;
    const taken = await AccountRepository.isUsernameTaken(
      username,
      req.account!.id,
    );
    if (taken) {
      res
        .status(409)
        .json({ success: false, error: 'Username is already taken' });
      return;
    }
    await AccountRepository.update(req.account!.id, { username });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

export default {
  get,
  updateProfile,
  updateUsername,
};

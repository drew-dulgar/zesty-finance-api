import type { Request, Response, NextFunction } from 'express';
import AccountService from '../../services/AccountService.js';
import { AccountSchemaCreate } from '../../schemas/AccountSchema.js';

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

const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
   
    const values = await AccountSchemaCreate.validateAsync(req.body);

    //console.log(AccountCreateSchema);
    //await AccountService.create(attributes);

    res.send({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  get,
  create
}


import type { IRequest, IResponse, INextFunction } from "../../express/index.js";
import AccountService from './account.service.js';

const get = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
  try {
    const accounts = await AccountService.get(4);

    res.send(accounts);
  } catch (error) {
    next(error);
  }
};

const create = (req: IRequest, res: IResponse, next: INextFunction): void => {
  try {
    res.send({
      foo: 'bar'
    })
  } catch (error) {
    next(error);
  }
};

export default {
  get,
  create
}


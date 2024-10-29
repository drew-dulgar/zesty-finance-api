import { IRequest, IResponse, INextFunction } from "../../express/index.js";

const get = (req: IRequest, res: IResponse, next: INextFunction): void => {
  try {
    res.send({
      foo: 'bar'
    })
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


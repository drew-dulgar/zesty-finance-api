import type { IRequest, IResponse, INextFunction } from "../../../express/index.js";

const authenticate = (req: IRequest, res: IResponse, next: INextFunction): void => {
  try {

  } catch (error) {
    next(error);
  }
}

const logout = (req: IRequest, res: IResponse, next: INextFunction): void => {
  try {
    //req.session.destroy();
    //req.logout(() => { });
    //res.clearCookie('connect.sid');

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

export default {
  authenticate,
  logout
}
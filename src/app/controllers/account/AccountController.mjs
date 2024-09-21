import { AccountService, AccountPlanService } from '../../services/index.mjs';

const get = async (req, res, next) => {
  try {

    res.json({
      user: req.user.account,
      authenticated: req.authenticated,
      authorized: req.authorized.actions,
    });
    /*
    const authorized = {};

    for (const path in authorization.authorized) {
      const item = authorization.authorized[path];

      authorized[item.resource] = item.actions;
    }

    const response = {
      account: req.user,
      authenticated: authorization.authenticated,
      roles: authorization.roles,
      authorized,
    };

    res.json(response);
    */
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const {  } = request.body;

  } catch (err) {

    next(err);
  }
}

export default {
  get,
  create,
}
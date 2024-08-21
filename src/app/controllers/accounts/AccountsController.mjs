import { AccountService, AccountPlanService } from '../../services/index.mjs';
import crypto from 'crypto';

const get = async (req, res, next) => {
  try {
    res.json({ account: req.user });
  } catch (err) {
    console.log(err);
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
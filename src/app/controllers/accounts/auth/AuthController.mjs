
import { AccountService } from '../../../services/index.mjs';
import passport from 'passport';


const authenticate = (req, res, next) => {
  try {

    passport.authenticate('local', (error, account, message) => {

      if (error) {
        return next(error);
      }

      if (!account) {
        return res.status(403).json({
          authenticated: false
        });
      };


      req.logIn(account, async (loginError) => {
        if (loginError) {
          next(loginError);
        }

        await AccountService.update({ lastLogin: new Date().toUTCString() }, { id: account.id }, 1);

        res.json({
          account,
          authenticated: true,
        })
      });

    })(req, res, next);
  } catch(error) {
    next(error);
  }
}

export default {
  authenticate,
}
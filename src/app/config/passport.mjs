import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { AccountService } from '../services/index.mjs';

const initializePassport = () => {
  // Setup local strategy for passport
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
    (email, password, cb) => AccountService.authenticate(email, password)
      .then((account) => {
        
        if (account) {
          return cb(null, account, { message: 'Logged In Successfully' });
        }

        return cb(null, false, { message: 'Invalid email and/or password.' });
      })
      .catch((error) => cb(error))
  ));

  passport.serializeUser((account, cb) => {
    process.nextTick(() =>  cb(null, {
        id: account.id,
        roles: account.accountRoles,
    }));
  });
  
  passport.deserializeUser((account, cb) => {
    process.nextTick(()=> cb(null, account));
  });
};

export default passport;
export { initializePassport };
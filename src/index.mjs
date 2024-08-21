import { Model } from 'objection';
import {APP_PORT} from './app/config/env.mjs';
import { clients } from './app/config/db.mjs';
import logger from './app/config/logger.mjs';
import { initializePassport } from './app/config/passport.mjs';
import { initializeApp } from './app/config/express.mjs';

Model.knex(clients.zestyDb);

initializePassport();

const app = initializeApp();


app.listen(APP_PORT, () => {
  logger.info(`App running on port ${APP_PORT}.`);
});
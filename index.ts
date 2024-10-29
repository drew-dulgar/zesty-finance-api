import {APP_PORT} from './src/config/env.js';
import logger from './src/config/logger.js';
import initializeApplication from './src/express/index.js';

const app = initializeApplication();

app.listen(APP_PORT, () => {
  logger.info(`App running on port ${APP_PORT}.`);
});

import {APP_PORT} from './lib/env.mjs';
import app from './lib/express.mjs';

app.listen(APP_PORT, () => {
  console.log(`App running on port ${APP_PORT}.`);
});
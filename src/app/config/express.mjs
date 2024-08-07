
import express from 'express';
import bodyParser from 'body-parser';
import routes from '../routes.mjs';
import { ENVIRONMENT } from './env.mjs';
import logger from './logger.mjs';

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(routes);

app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: 'The requested resource could not be found.'
  })
})

// Final error handler
app.use((error, request, response, next) => {
  // log error?
  logger.error(error);

  if (ENVIRONMENT === 'production') {
    response.status(500).json({
      status: 500,
      message: 'Whoops, looks like something went wrong!'
    });

  } else {
    response.status(500).json({
      status: 500,
      error: error?.message || '',
      stack: (error?.stack || '').split('\n'),
    });
  }

});



export default app;
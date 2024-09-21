import logger from '../config/logger.mjs';

const loggerMiddleware = (req, res, next) => {

  res.on('finish', () => {
    logger.http(`${req.method} ${req.originalUrl} [${res.statusCode}]`);
  });

  next();
};

export default loggerMiddleware;
import winston from 'winston';
import { APP_LOG_LEVEL } from './env.mjs';

const logger = winston.createLogger({
  level: APP_LOG_LEVEL,
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

export default logger;
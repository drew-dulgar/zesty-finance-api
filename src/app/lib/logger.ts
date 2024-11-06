import winston from 'winston';
import { APP_LOG_LEVEL } from '../../config/env.js';

const { format, transports } = winston;
const { Console } = transports;
const { combine, json, timestamp, printf, colorize, align } = format;

const logger = winston.createLogger({
  level: APP_LOG_LEVEL,
  format: combine(
    colorize({ all: true }),
    timestamp({
      format: 'MMM-DD-YYYY HH:mm:ss'
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [new Console(), new winston.transports.Http({
    level: 'warn',
    format: json()
  })]
});

export default logger;

import pino, { stdTimeFunctions } from 'pino';

const logger = pino({
  prettyPrint: true,
  timestamp: stdTimeFunctions.isoTime,
  messageKey: 'message',
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
});

export default logger;

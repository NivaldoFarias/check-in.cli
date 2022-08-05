import pino, { stdTimeFunctions } from 'pino';
import pretty from 'pino-pretty';

const stream = pretty({
  colorize: true,
  messageKey: 'message',
  timestampKey: 'timestamp',
});
const logger = pino({ timestamp: stdTimeFunctions.isoTime }, stream);

export default logger;

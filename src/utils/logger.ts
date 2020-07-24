import { createLogger, format, transports } from 'winston';

const { combine, metadata, timestamp, printf, colorize } = format;

const printFormat = printf(({ timestamp, level, metadata, message }) => {
  const service = (metadata && metadata.service) || '';

  return `${timestamp} ${level} ${service} - ${message}`;
});

const defaultFormats = combine(metadata(), timestamp(), printFormat);

const colorizedFormats = combine(colorize(), defaultFormats);

const logger = createLogger({
  level: 'info',
  format: defaultFormats,
  transports: [new transports.File({ filename: 'logs.log' })],
  exceptionHandlers: [new transports.File({ filename: 'logs.log' })],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: colorizedFormats,
    })
  );
}

export default logger;

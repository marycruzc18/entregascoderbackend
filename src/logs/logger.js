import { createLogger, format, transports } from 'winston';


const { combine, timestamp, printf, errors } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
});

const developmentLogger = () => {
    return createLogger({
        level: 'debug',
        format: combine(
            format.colorize(),
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            errors({ stack: true }),
            logFormat
        ),
        transports: [new transports.Console()],
    });
};

const productionLogger = () => {
  return createLogger({
      level: 'info',
      format: combine(
          timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          errors({ stack: true }),
          logFormat
      ),
      transports: [
          new transports.Console({
              format: combine(
                  format.colorize(), 
                  logFormat
              )
          }),
          new transports.File({ 
              filename: 'errors.log', 
              level: 'error',
              format: combine(
                  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                  errors({ stack: true }),
                  logFormat 
              )
          }),
      ],
  });
};

const logger = process.env.NODE_ENV === 'production' ? productionLogger() : developmentLogger();

export default logger;

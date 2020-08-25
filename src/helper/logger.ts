import * as winston from 'winston';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: process.env.npm_package_name },
    transports: [
        new winston.transports.Console(),
    ],
});

export default logger;

import 'reflect-metadata';
import { createConnection } from 'typeorm';
import logger from '../helper/logger';

function shouldLog(): boolean {
    return process.env.ENVIRONMENT !== 'production';
}

// eslint-disable-next-line @typescript-eslint/ban-types
export default async function connect(list: Function[]): Promise<void> {
    try {
        await createConnection(
            {
                name: 'default',
                type: 'postgres',
                host: process.env.DS_HOST,
                port: Number(process.env.DS_PORT),
                username: process.env.DS_USER,
                password: process.env.DS_PASSWORD,
                database: process.env.DS_NAME,
                entities: list,
                synchronize: false,
                logging: shouldLog(),
                cache: {
                    type: 'redis',
                    options: {
                        host: process.env.REDIS_HOST,
                        port: process.env.REDIS_PORT,
                        db: process.env.REDIS_DB,
                    },
                },
            },
        );
    } catch (err) {
        logger.error(err.message);
        process.exit(1);
    }
}

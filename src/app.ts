import 'source-map-support/register';

import * as AWS from 'aws-sdk';
import { ConfigurationOptions } from 'aws-sdk/lib/config';

import QueueService from './helper/queue';
import { IQueueService } from './interfaces';
import processMessage from './service/message-processor';

// Connect to database
import connect from './configuration/connection';
import entities from './entity';

connect(entities);

// Update AWS configuration
const { REGION_QUEUE, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

const config: ConfigurationOptions = {
    region: REGION_QUEUE,
    credentials: new AWS.Credentials({
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    }),
};

AWS.config.update(config);

// Create base config for queue
const queueConfig: IQueueService = {
    sqs: new AWS.SQS(),
    processMessage,
};

(async () => {
    const queueService = new QueueService(queueConfig);
    await queueService.startQueue();
})();

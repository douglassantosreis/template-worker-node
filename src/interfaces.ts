import { SQS } from 'aws-sdk';

export interface IQueueService {
    sqs: SQS;
    // eslint-disable-next-line @typescript-eslint/ban-types
    processMessage: Function;
}

import { SQS } from 'aws-sdk';
import { IQueueService } from '../interfaces';
import logger from './logger';

export default class QueueService {
    private queueUrl: string = process.env.QUEUE_URL;

    private sqs: SQS;

    // eslint-disable-next-line @typescript-eslint/ban-types
    private businessFunction: Function;

    constructor(config: IQueueService) {
        this.sqs = config.sqs;
        this.businessFunction = config.processMessage;
    }

    public async startQueue(): Promise<void> {
        const params = {
            AttributeNames: [
                'SentTimestamp',
            ],
            MaxNumberOfMessages: Number(process.env.MESSAGE_PARALLEL),
            MessageAttributeNames: [
                'All',
            ],
            QueueUrl: this.queueUrl,
            VisibilityTimeout: Number(process.env.VISIBILITY_TIMEOUT),
            WaitTimeSeconds: 20,
        };

        logger.info('Worker is listening to queue');
        await this.initPulling(params);
    }

    public async initPulling(params: SQS.Types.ReceiveMessageRequest): Promise<void> {
        try {
            const messages = await this.receiveMessage(params) || [];
            if (messages.length > 0) {
                await this.processMessages(messages);
            }

            setImmediate(() => {
                this.initPulling(params);
            });
        } catch (err) {
            logger.error(err);

            setImmediate(() => {
                this.initPulling(params);
            });
        }
    }

    public async deleteMessage(message: SQS.Message): Promise<void> {
        const messageDelete = {
            QueueUrl: this.queueUrl,
            ReceiptHandle: message.ReceiptHandle,
        };

        await this.sqs.deleteMessage(messageDelete).promise();
    }

    private async receiveMessage(params: SQS.Types.ReceiveMessageRequest): Promise<SQS.Message[]> {
        const result = await this.sqs.receiveMessage(params).promise();
        return result.Messages;
    }

    private async processMessages(messages: AWS.SQS.Message[]): Promise<void> {
        const promises = messages.map(async (message) => {
            try {
                await this.businessFunction(message);
                await this.deleteMessage(message);
            } catch (err) {
                const errMessage = err.response
                    ? `${err.response.status} - ${err.response.statusText} - ${err.config}`
                    : err.message;

                logger.error(errMessage);
            }
        });

        await Promise.all(promises);
    }
}

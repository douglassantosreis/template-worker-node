import CustomerBaselineRepository from '../repository/customer-baseline';
import logger from '../helper/logger';

export default async function processMessage(message: AWS.SQS.Message): Promise<void> {
    // TODO: Create implementation
    const { cpf } = JSON.parse(message.Body);

    const baseline = await CustomerBaselineRepository.GetByCpf(cpf);
    logger.info(baseline);
}

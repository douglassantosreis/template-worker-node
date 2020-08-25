import { getRepository } from 'typeorm';
import CustomerBaseline from '../entity/customer-baseline';

export default class CustomerBaselineRepository {
    static async GetByCpf(cpf: string): Promise<CustomerBaseline> {
        return getRepository(CustomerBaseline)
            .createQueryBuilder('b')
            .where('b.cpf = :cpf', { cpf })
            .getOne();
    }
}

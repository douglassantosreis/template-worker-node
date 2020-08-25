import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('fdl_customer_baseline')
export default class CustomerBaseline {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    vendor: string;

    @Column()
    cpf: string;

    @Column({ name: 'year_month' })
    yearMonth: string;

    @Column()
    coins: number;

    @Column()
    baseline: number;

    @Column()
    points: number;

    @Column()
    total: number;

    @Column({ name: 'updated_at' })
    updatedAt: Date;
}

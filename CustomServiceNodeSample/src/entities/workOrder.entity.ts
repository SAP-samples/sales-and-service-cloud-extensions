import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WorkProduct } from './workProduct.entity';

import { StatusCode, StatusDescription } from '../enums/status.enum';

@Entity('work_order')
export class WorkOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => WorkProduct, (workProduct) => workProduct.workOrder, {
    onDelete: 'CASCADE',
    eager: true,
    nullable: true,
  })
  workProducts?: WorkProduct[];

  @Column({ nullable: true })
  status?: StatusCode;

  @Column({ type: 'date', nullable: true })
  startDate?: Date;

  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  @Column({ nullable: true })
  currencyCode?: string;

  @Column({ nullable: true })
  content?: number;

  @Column({ nullable: true })
  orderName?: string;

  @Column({ type: 'integer', nullable: true })
  numberOfSubscriptions?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  priority?: number;

  @Column({ nullable: true, type: 'uuid' })
  projectLeadId?: string;

  @Column({ nullable: true, type: 'uuid' })
  accountId?: string;

  @Column({ nullable: true })
  Customer?: string;

  @Column({ nullable: true })
  displayId?: string;

  @Column({ nullable: true })
  caseDisplayId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

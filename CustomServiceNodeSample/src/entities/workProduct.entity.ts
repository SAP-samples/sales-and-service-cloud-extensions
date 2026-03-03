import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WorkOrder } from './workOrder.entity';
import { ScheduleLine } from './scheduleLine.entity';

@Entity('work_product')
export class WorkProduct {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  workProductId?: string;

  @Column({ nullable: true })
  workProductName?: string;

  @Column({ nullable: true })
  customizationDetails?: string;

  @Column({ nullable: true, type: 'int' })
  quantity?: number;

  @Column({ nullable: true })
  productCategory?: string;

  @Column({ nullable: true, type: 'int' })
  completionPercentage?: number;

  @Column({ nullable: true })
  productTypeCode?: string;

  @Column({ nullable: true })
  currencyCode?: string;

  @Column({ nullable: true })
  content?: number;

  @Column({ nullable: true })
  status?: string;

  @Column({ nullable: true, type: 'uuid' })
  workOrderId?: string;

  @ManyToOne(() => WorkOrder, (workOrder) => workOrder.workProducts, {
    onDelete: 'CASCADE',
  })
  workOrder?: WorkOrder;

  @OneToMany(() => ScheduleLine, (scheduleLine) => scheduleLine.workProduct, {
    cascade: true,
    eager: false,
  })
  scheduleLines?: ScheduleLine[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

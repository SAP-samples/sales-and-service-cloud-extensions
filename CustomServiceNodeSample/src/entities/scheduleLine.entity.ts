import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WorkProduct } from './workProduct.entity';

@Entity('schedule_lines')
export class ScheduleLine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  displayId?: string;

  @Column({ nullable: true })
  scheduleLineName?: string;

  @Column({ type: 'date', nullable: false })
  date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  requestedQuantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  confirmedQuantity: number;

  @Column({ type: 'date', nullable: true })
  requestedEndDate: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  status: string;

  // Foreign key to Work Product
  @Column({ type: 'uuid', nullable: false })
  workProductId: string;

  // Relationship to Work Product (Many schedule lines belong to one work product)
  @ManyToOne(() => WorkProduct, (workProduct) => workProduct.scheduleLines, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workProductId' })
  workProduct: WorkProduct;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

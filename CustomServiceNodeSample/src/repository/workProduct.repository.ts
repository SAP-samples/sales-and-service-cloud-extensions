import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { WorkProduct } from 'src/entities/workProduct.entity';

@Injectable()
export class WorkProductRepository extends Repository<WorkProduct> {}

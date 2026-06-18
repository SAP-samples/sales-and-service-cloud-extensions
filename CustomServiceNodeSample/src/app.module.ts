import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkOrderModule } from './workOrder/workOrder.module';
import { WorkProductModule } from './workProduct/workProduct.module';
import { ScheduleLineModule } from './scheduleLine/scheduleLine.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkOrder } from './entities/workOrder.entity';
import { WorkProduct } from './entities/workProduct.entity';
import { ScheduleLine } from './entities/scheduleLine.entity';
import { ConfigModule } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

import { SetHeadersMiddleware } from './middleware';
import { SessionMiddleware } from './common/middleware/session.middleware';
import { NestModule, MiddlewareConsumer } from '@nestjs/common';

//TypeORM Configuration - Using BTP User-Provided Variables
@Module({
  imports: [
    // ConfigModule for environment variables 
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({ 
      type: 'sap',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '443'),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      schema: process.env.DB_SCHEMA,
      entities: [WorkOrder, WorkProduct, ScheduleLine],
      synchronize: false, 

      logging: true,
      extra: {
        encrypt: true,
        validateCertificate: false,
      },
    } as DataSourceOptions),
    WorkOrderModule,
    WorkProductModule,
    ScheduleLineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply SessionMiddleware first, then SetHeadersMiddleware
    consumer
      .apply(SessionMiddleware, SetHeadersMiddleware)
      .forRoutes('*');
  }
}

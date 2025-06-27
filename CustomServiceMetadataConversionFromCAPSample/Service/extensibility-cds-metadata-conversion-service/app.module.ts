import { Module } from '@nestjs/common';
import { CdsMetadataConversionController } from './src/modules/cds-metadata-conversion.controller';
import { CdsMetadataConversionService } from './src/modules/cds-metadata-conversion.service';

@Module({
  imports: [],
  controllers: [CdsMetadataConversionController],
  providers: [CdsMetadataConversionService],
})
export class AppModule {}

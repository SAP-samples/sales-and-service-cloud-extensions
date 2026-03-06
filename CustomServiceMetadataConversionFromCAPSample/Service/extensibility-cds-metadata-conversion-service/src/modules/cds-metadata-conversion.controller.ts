import {
  Controller,
  Post,
  Get
} from '@nestjs/common';
import { CdsMetadataConversionService } from './cds-metadata-conversion.service';
import { Request, Response } from 'express';
import {
  XSAPCRMTOKEN,
  cdsSchema,
} from '../common/constants';
import {
  ApiHeader,
  ApiTags,
} from '@nestjs/swagger';

// import { checkHttpActions } from 'src/common/utils';

@ApiTags('CDS Metadata Conversion')
@ApiHeader({
  name: XSAPCRMTOKEN,
  required: true,
  description: 'Json web token identifying the user and tenant it belongs to',
})
@Controller()
export class CdsMetadataConversionController {
  constructor(
    private readonly cdsMetadataConversionService: CdsMetadataConversionService,
  ) {}

  @Get()
  getFormattedMetadata(): Promise<any> {
    return this.cdsMetadataConversionService.convertMetadata(cdsSchema);
  }

  @Post('cdsMetadataConversion')
  getConvertedMetadata(cdsSchema): Promise<any> {
    return this.cdsMetadataConversionService.convertMetadata(cdsSchema);
  }
}

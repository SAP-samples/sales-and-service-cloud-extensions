import { IsNotEmpty, IsString, IsUUID, Matches } from 'class-validator';

export class ReplicateDataDto {
  @IsNotEmpty()
  @IsUUID(4)
  @Matches(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i, {
    message: 'dataRequestId must be a valid UUID v4',
  })
  dataRequestId: string;

  @IsNotEmpty()
  @IsString()
  serviceFullName: string;

  @IsNotEmpty()
  @IsString()
  entityFullName: string;
}

export { ReplicateDataDto as DataExportRequestDto };

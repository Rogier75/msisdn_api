import { IsString } from 'class-validator';

export class AllocateMsisdnDto {
  @IsString()
  readonly personId: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly surname: string;

  @IsString()
  readonly msisdn: string;

  @IsString()
  readonly organisation: string;
}

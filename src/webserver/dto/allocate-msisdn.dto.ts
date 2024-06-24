import { IsString, IsNotEmpty } from 'class-validator';

export class AllocateMsisdnDto {
  @IsString()
  @IsNotEmpty()
  readonly personId: string;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly surname: string;

  @IsString()
  @IsNotEmpty()
  readonly msisdn: string;

  @IsString()
  @IsNotEmpty()
  readonly organisation: string;
}

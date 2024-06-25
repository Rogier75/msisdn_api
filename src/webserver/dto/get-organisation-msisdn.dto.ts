import { IsNotEmpty, IsString } from 'class-validator';

export class GetOrganisationMsisdnDto {
  @IsString()
  @IsNotEmpty()
  readonly organisation: string;
}

import { IsNotEmpty, IsString } from 'class-validator';

export class GetAllocatedInOrganisationDto {
  @IsString()
  @IsNotEmpty()
  readonly organisation: string;
}

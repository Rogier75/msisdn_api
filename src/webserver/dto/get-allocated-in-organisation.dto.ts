import { IsString } from 'class-validator';

export class GetAllocatedInOrganisationDto {
  @IsString()
  readonly organisation: string;
}

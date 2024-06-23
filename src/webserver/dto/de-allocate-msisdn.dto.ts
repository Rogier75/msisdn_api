import { IsString } from 'class-validator';

export class DeAllocateMsisdnDto {
  @IsString()
  readonly personId: string;
}

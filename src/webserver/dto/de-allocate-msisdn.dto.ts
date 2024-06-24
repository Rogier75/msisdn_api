import { IsNotEmpty, IsString } from 'class-validator';

export class DeAllocateMsisdnDto {
  @IsString()
  @IsNotEmpty()
  readonly personId: string;
}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MsisdnDocument = HydratedDocument<Msisdn>;

@Schema()
export class Msisdn {
  @Prop({ required: true })
  msisdn: string;

  @Prop({ required: true })
  assigned: boolean;
}

export const MsisdnSchema = SchemaFactory.createForClass(Msisdn);

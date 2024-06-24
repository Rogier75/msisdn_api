import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { UserDocument } from './user.schema';

export type MsisdnDocument = HydratedDocument<Msisdn>;

@Schema()
export class Msisdn {
  @Prop({ required: true })
  msisdn: string;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'User' })
  user: UserDocument;
}

export const MsisdnSchema = SchemaFactory.createForClass(Msisdn);

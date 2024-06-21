import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Msisdn } from './msisdn.schema';
import { Organisation } from './organisation.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'Organisation' })
  organisation: Organisation;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'Msisdn' })
  msisdn: Msisdn;
}

export const UserSchema = SchemaFactory.createForClass(User);

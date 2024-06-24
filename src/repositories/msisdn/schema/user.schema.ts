import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { OrganisationDocument } from './organisation.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  personId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  surname: string;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'Organisation' })
  organisation: OrganisationDocument;
}

export const UserSchema = SchemaFactory.createForClass(User);

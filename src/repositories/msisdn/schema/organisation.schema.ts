import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrganisationDocument = HydratedDocument<Organisation>;

@Schema()
export class Organisation {
  @Prop()
  name: string;
}

export const OrganisationSchema = SchemaFactory.createForClass(Organisation);

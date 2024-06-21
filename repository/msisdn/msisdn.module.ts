import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MsisdnService } from './msisdn.service';
import { Msisdn, MsisdnSchema } from './schemas/msisdn.schema';
import { User, UserSchema } from './schemas/user.schema';
import {
  Organisation,
  OrganisationSchema,
} from './schemas/organisation.schema';

@Module({
  imports: [
    // the forRoot import would typically be placed inside a root module instead of this one
    MongooseModule.forRoot('mongodb://localhost/nest'),
    MongooseModule.forFeature([{ name: Msisdn.name, schema: MsisdnSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: Organisation.name, schema: OrganisationSchema },
    ]),
  ],
  providers: [MsisdnService],
})
export class MsisdnModule {}

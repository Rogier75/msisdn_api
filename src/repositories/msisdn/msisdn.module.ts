import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MsisdnService } from './msisdn.service';
import { Msisdn, MsisdnSchema } from './schema/msisdn.schema';
import { User, UserSchema } from './schema/user.schema';
import { Organisation, OrganisationSchema } from './schema/organisation.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async function (config: ConfigService) {
        const host = config.get<string>('mongo.host');
        const port = config.get<number>('mongo.port');
        const user = config.get<string>('mongo.user');
        const password = config.get<string>('mongo.password');
        const db = config.get<string>('mongo.db');
        const uri = `mongodb://${user}:${password}@${host}:${port}/${db}`;
        return { uri };
      },
    }),

    MongooseModule.forFeature([{ name: Msisdn.name, schema: MsisdnSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: Organisation.name, schema: OrganisationSchema },
    ]),
  ],
  providers: [MsisdnService],
  exports: [MsisdnService],
})
export class MsisdnModule {}

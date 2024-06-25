import { Module } from '@nestjs/common';
import { MsisdnModule } from './repositories/msisdn/msisdn.module';
import { WebserverModule } from './webserver/webserver.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),

    MsisdnModule,
    WebserverModule,
  ],
  exports: [WebserverModule],
})
export class AppModule {}

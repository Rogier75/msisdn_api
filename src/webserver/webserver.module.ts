import { Module } from '@nestjs/common';
import { WebserverController } from './webserver.controller';
import { WebserverService } from './webserver.service';
import { MsisdnModule } from '../repositories/msisdn/msisdn.module';

@Module({
  imports: [MsisdnModule],
  controllers: [WebserverController],
  providers: [WebserverService],
})
export class WebserverModule {}

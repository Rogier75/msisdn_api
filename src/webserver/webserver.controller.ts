import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  UseFilters,
} from '@nestjs/common';
import { WebserverService } from './webserver.service';
import { HttpExceptionFilter } from './http-exception.filter';
import { AllocateMsisdnDto } from './dto/allocate-msisdn.dto';
import { DeAllocateMsisdnDto } from './dto/de-allocate-msisdn.dto';
import { GetOrganisationMsisdnDto } from './dto/get-organisation-msisdn.dto';
import { SuccessResponse } from './success-response';

@Controller()
@UseFilters(new HttpExceptionFilter())
export class WebserverController {
  constructor(private readonly webService: WebserverService) {}

  @Get('msisdn/available')
  async getAllAvailableMsisdns(): Promise<SuccessResponse> {
    return await this.webService.getAllAvailableMsisdns();
  }

  @Get('msisdn/organisation')
  async getOrganisationMsisdns(
    @Body() body: GetOrganisationMsisdnDto,
  ): Promise<SuccessResponse> {
    return await this.webService.getOrganisationMsisdns(body);
  }

  @Delete('msisdn')
  async deallocateMsisdn(
    @Body() body: DeAllocateMsisdnDto,
  ): Promise<SuccessResponse> {
    return await this.webService.deAllocateMsisdn(body);
  }

  @Post('msisdn')
  @HttpCode(200)
  async allocateMsisdn(
    @Body() body: AllocateMsisdnDto,
  ): Promise<SuccessResponse> {
    return await this.webService.allocateMsisdn(body);
  }
}

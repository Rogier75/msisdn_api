import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  UseFilters,
} from '@nestjs/common';
import { WebserverService } from './webserver.service';
import { HttpExceptionFilter } from './http-exception.filter';
import { AllocateMsisdnDto } from './dto/allocate-msisdn.dto';
import { DeAllocateMsisdnDto } from './dto/de-allocate-msisdn.dto';
import { SuccessResponse } from './success-response';

@Controller()
@UseFilters(new HttpExceptionFilter())
export class WebserverController {
  constructor(private readonly webService: WebserverService) {}

  @Get()
  async getAllAvailableMsisdns(): Promise<NonNullable<unknown>> {
    const result = this.webService.getAllAvailableMsisdns();

    const success = {
      status: HttpStatus.OK,
      result: result,
      error: false,
    };

    return success;
  }

  @Delete('msisdn')
  async deallocateMsisdn(
    @Body() body: DeAllocateMsisdnDto,
  ): Promise<SuccessResponse> {
    return await this.webService.deAllocateMsisdn(body);
  }

  @Post('msisdn')
  async allocateMsisdn(
    @Body() body: AllocateMsisdnDto,
  ): Promise<SuccessResponse> {
    return await this.webService.allocateMsisdn(body);
  }
}

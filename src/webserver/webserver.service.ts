import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { MsisdnService } from '../repositories/msisdn/msisdn.service';
import { AllocateMsisdn } from '../repositories/msisdn/interface/allocate-msisdn';
import { DeAllocateMsisdn } from '../repositories/msisdn/interface/de-allocate-msisdn';
import { SuccessResponse } from './success-response';
import MsisdnServiceException from '../repositories/msisdn/exception/msisdn-service.exception';

@Injectable()
export class WebserverService {
  private readonly logger = new Logger(WebserverService.name);

  public constructor(private readonly msisdnService: MsisdnService) {}

  async getAllAvailableMsisdns(): Promise<string[]> {
    return this.msisdnService.getAllAvailableMsisdns();
  }

  async allocateMsisdn(model: AllocateMsisdn): Promise<SuccessResponse> {
    try {
      const result = await this.msisdnService.assignMsisdnToUser(model);
      return this.wrapResult(result);
    } catch (error) {
      if (error instanceof MsisdnServiceException) {
        return this.wrapServiceException(error);
      }
      throw error;
    }
  }

  async deAllocateMsisdn(model: DeAllocateMsisdn): Promise<SuccessResponse> {
    try {
      const result = await this.msisdnService.deAssignMsisdn(model);
      return this.wrapResult(result);
    } catch (error) {
      if (error instanceof MsisdnServiceException) {
        return this.wrapServiceException(error);
      }
      throw error;
    }
  }

  private wrapResult(result: any): SuccessResponse {
    return {
      status: 'OK',
      error: false,
      result: result,
    };
  }

  private wrapServiceException(error: MsisdnServiceException): SuccessResponse {
    return {
      status: 'INVALID_REQUEST', //TODO get the status from the exception object
      error: true,
      error_message: error.message,
      result: null,
    };
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { MsisdnService } from '../repositories/msisdn/msisdn.service';
import { SuccessResponse } from './success-response';
import MsisdnServiceException from '../repositories/msisdn/exception/msisdn-service.exception';
import ServiceConflictException from './exception/service-conflict.exception';
import { AllocateMsisdnDto } from './dto/allocate-msisdn.dto';
import { DeAllocateMsisdnDto } from './dto/de-allocate-msisdn.dto';

@Injectable()
export class WebserverService {
  private readonly logger = new Logger(WebserverService.name);

  public constructor(private readonly msisdnService: MsisdnService) {}

  async getAllAvailableMsisdns(): Promise<SuccessResponse> {
    try {
      const result = await this.msisdnService.getAllAvailableMsisdns();
      return new SuccessResponse(result);
    } catch (error) {
      if (error instanceof MsisdnServiceException) {
        throw new ServiceConflictException(error.errorCode, error.message);
      }
      throw error;
    }
  }

  async getOrganisationMsisdns(
    organisationId: string,
  ): Promise<SuccessResponse> {
    try {
      const result =
        await this.msisdnService.getOrganisationMsisdns(organisationId);
      return new SuccessResponse(result);
    } catch (error) {
      if (error instanceof MsisdnServiceException) {
        throw new ServiceConflictException(error.errorCode, error.message);
      }
      throw error;
    }
  }

  async allocateMsisdn(model: AllocateMsisdnDto): Promise<SuccessResponse> {
    try {
      const result = await this.msisdnService.allocateMsisdn(model);
      return new SuccessResponse(result);
    } catch (error) {
      if (error instanceof MsisdnServiceException) {
        throw new ServiceConflictException(error.errorCode, error.message);
      }
      throw error;
    }
  }

  async deAllocateMsisdn(model: DeAllocateMsisdnDto): Promise<SuccessResponse> {
    try {
      const result = await this.msisdnService.deAllocateMsisdn(model.personId);
      return new SuccessResponse(result);
    } catch (error) {
      if (error instanceof MsisdnServiceException) {
        throw new ServiceConflictException(error.errorCode, error.message);
      }
      throw error;
    }
  }
}

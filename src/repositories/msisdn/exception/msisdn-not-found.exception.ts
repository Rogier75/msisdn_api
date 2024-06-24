import MsisdnServiceException from './msisdn-service.exception';
import { ErrorCode } from './error-code';

export default class MsisdnNotFoundException extends MsisdnServiceException {
  public readonly errorCode = ErrorCode.MSISDN_NOT_FOUND;

  public constructor(public readonly msisdn: string) {
    super(`Msisdn '${msisdn}' does not exist`);
  }
}

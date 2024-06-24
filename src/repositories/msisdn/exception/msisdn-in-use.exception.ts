import MsisdnServiceException from './msisdn-service.exception';
import { ErrorCode } from './error-code';

export default class MsisdnInUseException extends MsisdnServiceException {
  public readonly errorCode = ErrorCode.MSISDN_IN_USE_BY_OTHER_USER;

  public constructor(public readonly msisdn: string) {
    super(`Msisdn '${msisdn}' is already in use`);
  }
}

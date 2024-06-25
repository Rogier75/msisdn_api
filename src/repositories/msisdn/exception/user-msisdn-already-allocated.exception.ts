import MsisdnServiceException from './msisdn-service.exception';
import { ErrorCode } from './error-code';

export default class UserMsisdnAlreadyAllocatedException extends MsisdnServiceException {
  public readonly errorCode = ErrorCode.USER_ALREADY_HAS_DIFFERENT_MSISDN;

  public constructor(public readonly user: string) {
    super(`User '${user}' already has another msisdn assigned`);
  }
}

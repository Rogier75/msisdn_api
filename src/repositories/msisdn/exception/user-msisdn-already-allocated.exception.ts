import MsisdnServiceException from './msisdn-service.exception';

export default class UserMsisdnAlreadyAllocatedException extends MsisdnServiceException {
  public constructor(public readonly user: string) {
    super(`User ${user} already has another msisdn assigned`);
  }
}

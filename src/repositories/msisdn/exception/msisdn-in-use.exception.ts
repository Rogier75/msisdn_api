import MsisdnServiceException from './msisdn-service.exception';

export default class MsisdnInUseException extends MsisdnServiceException {
  public constructor(public readonly msisdn: string) {
    super(`Msisdn '${msisdn} is already in use`);
  }
}

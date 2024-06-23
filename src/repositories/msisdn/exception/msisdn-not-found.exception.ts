import MsisdnServiceException from './msisdn-service.exception';

export default class MsisdnNotFoundException extends MsisdnServiceException {
  public constructor(public readonly msisdn: string) {
    super(`Msisdn '${msisdn}' does not exist`);
  }
}

import { ErrorCode } from './error-code';

export default abstract class MsisdnServiceException extends Error {
  public abstract readonly errorCode: ErrorCode;
}

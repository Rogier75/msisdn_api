import { HttpException, HttpStatus } from '@nestjs/common';

export default class ServiceConflictException extends HttpException {
  constructor(
    public readonly error_code: string,
    message?: string,
  ) {
    super(message, HttpStatus.CONFLICT);
  }
}

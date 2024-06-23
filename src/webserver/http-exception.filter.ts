import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    if (status >= 400 && status < 500) {
      response.status(status).json({
        statusCode: status,
        message: exception.message,
        error: true,
      });
    } else {
      response.status(500);
      // don't leak internal error messages
    }
  }
}

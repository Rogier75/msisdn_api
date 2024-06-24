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

    response.status(status);

    switch (status) {
      case 409:
        response.json({
          errorCode: exception['error_code'],
          message: exception.message,
          statusCode: status,
        });
        break;
      case 500:
        response.json({ error: 'Internal Server error', statusCode: status }); // we don't leak err info
        break;
      default:
        response.send(exception.getResponse());
    }
  }
}

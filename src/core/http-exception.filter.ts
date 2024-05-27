import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errorRespone =
      typeof exception.getResponse() === 'string'
        ? (exception.getResponse() as any).message
        : (exception.getResponse() as any).errors;

    if (status === HttpStatus.UNPROCESSABLE_ENTITY) {
      return response.status(status).json({
        message: 'Validation error Unprocessable Entity',
        errors: errorRespone,
      });
    }

    return response.status(status).json({
      message: errorRespone,
    });
  }
}

import { Catch, HttpException, Logger, type ArgumentsHost, type ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';  // Importe o tipo Response corretamente

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>(); 
    const status = exception.getStatus();

    // Log da exceção
    this.logger.error(`Status: ${status}, Message: ${exception.message}`);

    response
      .status(status)
      .json({
        statusCode: status,
        message: exception.message, 
        timestamp: new Date().toISOString(),
        path: ctx.getRequest().url,
      });
  }
}
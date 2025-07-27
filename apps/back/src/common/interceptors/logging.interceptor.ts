import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, user } = request;
    const now = Date.now();

    this.logger.log(
      `Incoming Request: ${method} ${url} - User: ${
        user?.id || 'anonymous'
      } - Body: ${JSON.stringify(body)}`
    );

    return next.handle().pipe(
      tap({
        next: (data) => {
          const responseTime = Date.now() - now;
          this.logger.log(
            `Outgoing Response: ${method} ${url} - ${responseTime}ms - Status: Success`
          );
        },
        error: (error) => {
          const responseTime = Date.now() - now;
          this.logger.error(
            `Outgoing Response: ${method} ${url} - ${responseTime}ms - Status: Error - ${error.message}`
          );
        },
      })
    );
  }
}

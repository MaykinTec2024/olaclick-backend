import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, body } = req;

    const now = Date.now();
    console.log(`➡️ [${method}] ${url}`, body);

    return next.handle().pipe(
      tap((data) =>
        console.log(
          `⬅️ [${method}] ${url} - ${Date.now() - now}ms`,
          JSON.stringify(data),
        ),
      ),
    );
  }
}

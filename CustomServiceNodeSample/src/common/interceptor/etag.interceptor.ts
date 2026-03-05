import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';

export interface Response<T> {
  data: T;
}

@Injectable()
export class EtagInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const request: Request = context.switchToHttp().getRequest();
    const method = request.method.toUpperCase();
    const allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
    
    return next.handle().pipe(
      map((response) => {
        if (allowedMethods.includes(method)) {
          this.setEtagValue(request, response);
        }
        return response;
      }),
    );
  }

  setEtagValue(request: Request, response: any) {
    // Handle single entity response
    if (response && response.value) {
      const entity = Array.isArray(response.value) ? response.value[0] : response.value;
      
      if (entity && entity.updatedAt) {
        const etagValue = new Date(entity.updatedAt).toISOString().toString();
        request.res.header('Etag', `W/"${etagValue}"`);
      }
    }
  }
}

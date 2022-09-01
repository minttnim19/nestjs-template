import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { map, Observable } from 'rxjs'
import { IResponseData } from '@common/interfaces/response.interface'

@Injectable()
export class TransformData<T> implements NestInterceptor<T, IResponseData<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<IResponseData<T>> {
    return next.handle().pipe(map((data) => ({ data })))
  }
}

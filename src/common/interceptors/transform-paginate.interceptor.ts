import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { map, Observable } from 'rxjs'
import { IResponseData } from '@common/interfaces/response.interface'
import { Pagination } from 'nestjs-typeorm-paginate'

@Injectable()
export class TransformPaginate<T> implements NestInterceptor<Pagination<T>, IResponseData<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<IResponseData<T>> {
    return next.handle().pipe(
      map((data) => {
        const { items, meta, links } = data as Pagination<T>
        return {
          data: items,
          meta: {
            pagination: {
              total: meta.totalItems,
              count: meta.itemCount,
              perPage: meta.itemsPerPage,
              currentPage: meta.currentPage,
              totalPages: meta.totalPages,
              links: {
                previous: links.previous,
                next: links.next
              }
            }
          }
        }
      })
    )
  }
}

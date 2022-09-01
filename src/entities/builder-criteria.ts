import { promiseAll, removeEmpty } from '@common/functionals'
import { includeCriteria } from '@entities/criterias/include-criteria'
import { IOrderByCriteria, orderByCriteria } from '@entities/criterias/orderby-criteria'
import { ISearchableCriteria, searchableCriteria } from '@entities/criterias/searchable-criteria'
import { selectableCriteria } from '@entities/criterias/selectable-criteria'
import { IRepositoryClassInterface } from '@entities/repository.interface'

export interface IBuilderCriteria {
  select?: string[]
  where?: ISearchableCriteria
  order?: IOrderByCriteria
  relations?: string[]
}
/**
 * It takes in a repository, a query, a select, an orderBy, a sortedBy, and an include, and returns a
 * builderCriteria
 * @param {IRepositoryClassInterface} repo - IRepositoryClassInterface
 * @param {T} query - The query object that will be used to filter the data.
 * @param [select] - The selectable fields of the model
 * @param [orderBy=id] - The column name to order by
 * @param [sortedBy=ASC] - The direction of the sort.
 * @param [include] - This is the relations that you want to include in the query.
 * @returns An object with the following properties:
 *   select: string
 *   where: object
 *   order: string
 *   relations: string
 */
export const builderCriteria = async <T>(
  repo: IRepositoryClassInterface,
  query: T,
  select = '',
  orderBy = 'id',
  sortedBy = 'ASC',
  include = ''
): Promise<IBuilderCriteria> => {
  const { searchable, selectable, includeAvailable } = repo
  const builder = await promiseAll<IBuilderCriteria>([
    { select: selectableCriteria(selectable, select) },
    { where: searchableCriteria<T>(searchable, query) },
    { order: orderByCriteria(orderBy, sortedBy) },
    { relations: includeCriteria(includeAvailable, include) }
  ])
  return await removeEmpty(builder)
}

import { IFieldSearchable } from '@entities/repository.interface'
import { FindOperator, In, LessThanOrEqual, Like, MoreThanOrEqual, Raw } from 'typeorm'

/**
 * It takes a fieldSearchable object and a queryParams object and returns a searchableCriteria object
 * @param {IFieldSearchable} fieldSearchable - This is an object that contains the fields that are
 * searchable. The key is the field name and the value is the operator.
 * @param {T} queryParams - The query parameters that you want to filter by.
 * @returns An object with the keys being the queryParams and the values being the queryParams
 */
export interface ISearchableCriteria {
  [key: string]: string | number | Date | FindOperator<unknown>
}
export const searchableCriteria = <T>(fieldSearchable: IFieldSearchable, queryParams: T): ISearchableCriteria => {
  return Object.keys(queryParams)
    .filter((key) => fieldSearchable.hasOwnProperty(key))
    .reduce((filters, key) => {
      switch (fieldSearchable[key]) {
        case 'where_in':
          filters[key] = In(queryParams[key])
          break
        case 'like':
          filters[key] = Like('%' + queryParams[key] + '%')
          break
        case '>=':
          filters[key] = MoreThanOrEqual(queryParams[key])
          break
        case '<=':
          filters[key] = LessThanOrEqual(queryParams[key])
          break
        case 'date':
          filters[key] = Raw((alias) => `DATE(${alias}) = DATE('${queryParams[key]}')`)
          break
        case '=':
        default:
          filters[key] = queryParams[key]
          break
      }
      return filters
    }, {} as ISearchableCriteria)
}

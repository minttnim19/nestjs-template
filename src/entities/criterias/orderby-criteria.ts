/**
 * It takes two arguments, orderBy and sortedBy, and returns an object with the orderBy property set to
 * the sortedBy value
 * @param [orderBy=id] - The column name to order by.
 * @param [sortedBy=ASC] - 'ASC' | 'DESC'
 * @returns An object with a key of the orderBy value and a value of the sortedBy value.
 */
export interface IOrderByCriteria {
  [key: string]: 'ASC' | 'DESC'
}
export const orderByCriteria = (orderBy = 'id', sortedBy = 'ASC'): IOrderByCriteria => {
  return {
    [`${orderBy}`]: (() => {
      switch (sortedBy.toUpperCase()) {
        case 'DESC':
          return 'DESC'
        default:
          return 'ASC'
      }
    })()
  }
}

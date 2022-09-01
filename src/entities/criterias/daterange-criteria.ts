import { Between, FindOperator } from 'typeorm'

export interface IDateRangeCriteria {
  [key: string]: FindOperator<unknown>
}
/**
 * If the field is in the dateRangeSearchable array, return a date range criteria object, otherwise
 * return an empty object
 * @param {string[]} dateRangeSearchable - An array of strings that represent the fields that are
 * searchable by date range.
 * @param {string} field - The field you want to search on.
 * @param {string} startAt - The start date of the date range
 * @param {string} endAt - The end date of the date range
 * @returns An object with a key of the field and a value of the Between function.
 */
export const dateRangeCriteria = (
  dateRangeSearchable: string[],
  field: string,
  startAt: string,
  endAt: string
): IDateRangeCriteria => {
  return dateRangeSearchable.includes(field) ? { [`${field}`]: Between(startAt, endAt) } : {}
}

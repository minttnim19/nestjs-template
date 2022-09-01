export interface IFieldSearchable {
  readonly [key: string]: 'where_in' | 'like' | '=' | '>=' | '<=' | 'date'
}
export interface IRepositoryClassInterface {
  readonly tableName: string
  readonly selectable: string[]
  readonly searchable: IFieldSearchable
  readonly dateRangeSearchable: string[]
  readonly includeAvailable: string[]
}

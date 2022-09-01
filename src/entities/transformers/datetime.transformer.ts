import * as moment from 'moment'

export class DateTimeTransformer {
  from(data: string): string {
    return data ? moment(data).format('YYYY-MM-DD HH:mm:ss') : null
  }
  to(data: string): string {
    return data
  }
}

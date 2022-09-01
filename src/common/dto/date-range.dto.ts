import { Allow } from 'class-validator'

export class DateRangeDTO {
  @Allow()
  readonly createdStartAt: string
  @Allow()
  readonly createdEndAt: string
  @Allow()
  readonly updatedStartAt: string
  @Allow()
  readonly updatedEndAt: string
}

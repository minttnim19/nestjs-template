import { Allow } from 'class-validator'
import { SortedDTO } from '@common/dto/sorted.dto'
import { RelationsDTO } from '@common/dto/relations.dto'
import { SelectDTO } from '@common/dto/select.dto'
import { DateRangeDTO } from '@common/dto/date-range.dto'

export class PaginationDTO implements SortedDTO, RelationsDTO, SelectDTO, DateRangeDTO {
  @Allow()
  readonly page: number
  @Allow()
  readonly limit: number
  @Allow()
  readonly include: string
  @Allow()
  readonly orderBy: string
  @Allow()
  readonly sortedBy: string
  @Allow()
  readonly select: string
  @Allow()
  readonly createdStartAt: string
  @Allow()
  readonly createdEndAt: string
  @Allow()
  readonly updatedStartAt: string
  @Allow()
  readonly updatedEndAt: string
}

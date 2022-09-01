import { Allow } from 'class-validator'

export class SortedDTO {
  @Allow()
  readonly orderBy: string
  @Allow()
  readonly sortedBy: string
}

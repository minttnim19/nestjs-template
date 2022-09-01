import { Allow } from 'class-validator'

export class RelationsDTO {
  @Allow()
  readonly include: string
}

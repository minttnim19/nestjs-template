import { Allow } from 'class-validator'

export class SelectDTO {
  @Allow()
  readonly select: string
}

import { IsOptional, IsString } from 'class-validator'

export class Locales {
  @IsOptional()
  @IsString()
  readonly th: string

  @IsOptional()
  @IsString()
  readonly en: string
}

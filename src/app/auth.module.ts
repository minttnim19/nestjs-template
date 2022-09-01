import { Module } from '@nestjs/common'
import { JwtStrategy } from '@guard/authentication/jwt.strategy'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [PassportModule],
  providers: [JwtStrategy],
  exports: []
})
export class AuthModule {}

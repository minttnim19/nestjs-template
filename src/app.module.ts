import { Module } from '@nestjs/common'
import { IndexModule } from '@app/index/index.module'
import { RouterModule } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'
import { routes } from '@routes/index'
import { TypeOrmModule } from '@nestjs/typeorm'
import typeOrm from '@config/database/type-orm'
import { SharedModule } from '@shared/shared.module'
import { AuthModule } from '@app/auth.module'

@Module({
  imports: [
    AuthModule,
    IndexModule,
    SharedModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: typeOrm
    }),
    RouterModule.register(routes)
  ]
})
export class AppModule {}

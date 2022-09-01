import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import * as path from 'path'

export default async (): Promise<TypeOrmModuleOptions> => ({
  type: 'mysql',
  host: `${process.env.MYSQL_DB_HOST}`,
  port: parseInt(`${process.env.MYSQL_DB_PORT}`, 10),
  username: `${process.env.MYSQL_DB_USERNAME}`,
  password: `${process.env.MYSQL_DB_PASSWORD}`,
  database: `${process.env.MYSQL_DB_NAME}`,
  entities: [path.resolve(__dirname, '**/*.entity{.ts,.js}')],
  logging: process.env.APP_DEBUG.toLowerCase() === 'true' ? true : false,
  synchronize: false,
  timezone: '+07:00',
  autoLoadEntities: true,
  cache: true
})

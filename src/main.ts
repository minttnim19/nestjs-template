import { BadRequestException, ClassSerializerInterceptor, ValidationError, ValidationPipe } from '@nestjs/common'
import { NestFactory, Reflector } from '@nestjs/core'
import { SharedModule } from '@shared/shared.module'
import { AllExceptionsFilter } from 'exceptions/all-exceptions.filter'
import { AppModule } from './app.module'
import { LineNotifyService } from '@shared/line-notify/line-notify.service'
// import { LocalLoggingService } from '@shared/logging/local-logging.service'
import { GraylogService } from '@shared/logging/graylog.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const logger = app.select(SharedModule).get(GraylogService, { strict: true })
  const notify = app.select(SharedModule).get(LineNotifyService, { strict: true })
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(validationErrors)
      },
      transform: true,
      whitelist: true,
      validateCustomDecorators: true
    })
  )
  app.useGlobalFilters(new AllExceptionsFilter(logger, notify))
  app.useGlobalInterceptors(new ClassSerializerInterceptor(new Reflector()))
  await app.listen(parseInt(`${process.env.SERVICE_PORT}`, 10))
}
bootstrap()

import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'

@Injectable()
export class XProjectIdGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { headers } = context.switchToHttp().getRequest()
    return this.checkProject(headers['x-project-id'])
  }

  checkProject(projectId: string | undefined): boolean {
    if (!projectId || projectId.length === 0) {
      throw new UnauthorizedException({
        statusCode: 4013,
        message: 'Header is invalid. (x-project-id is required)'
      })
    }
    return true
  }
}

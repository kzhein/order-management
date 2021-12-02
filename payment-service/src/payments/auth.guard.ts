import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const { token } = context.switchToWs().getClient();

    if (!(token === 'this-is-a-valid-token')) {
      return false;
    }

    return true;
  }
}

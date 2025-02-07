import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  
    constructor(private readonly jwtService: JwtService) {}
  
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeaders(request);
    if (!token) {
      throw new UnauthorizedException("Invalid token");
    }
    
    try {
      const payload = this.jwtService.verify(token)
      request['user'] = payload;
    } catch (err) {
      throw new UnauthorizedException("Invalid token");
    }
    return true;
  }


  private extractTokenFromHeaders(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
  
    return type === 'Bearer' ? token : undefined;
  }
}

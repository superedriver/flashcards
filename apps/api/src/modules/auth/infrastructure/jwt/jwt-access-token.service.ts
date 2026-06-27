import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthUser } from '../../domain/types';
import { AccessTokenServicePort } from '../../application/ports/access-token-service.port';

type AccessTokenPayload = {
  sub: string;
  email: string;
  role: AuthUser['role'];
};

@Injectable()
export class JwtAccessTokenService implements AccessTokenServicePort {
  constructor(private readonly jwtService: JwtService) {}

  sign(user: AuthUser): Promise<string> {
    return this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }

  async verify(token: string): Promise<AuthUser> {
    const payload =
      await this.jwtService.verifyAsync<AccessTokenPayload>(token);

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}

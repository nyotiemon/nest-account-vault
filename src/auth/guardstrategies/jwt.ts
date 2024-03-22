import { Injectable } from '@nestjs/common';
import { ExtractJwt, JwtFromRequestFunction, Strategy } from 'passport-jwt';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from '../dto/jwt-payload.dto';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

const extractJwtFromCookie: JwtFromRequestFunction = request => {
  return request.signedCookies['token']!;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        extractJwtFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: `${process.env.JWT_SECRET}`,
      ignoreExpiration: false,
      passReqToCallback: false,
    });
  }

  /**
   * 
   * @param payload JwtPayload
   * @returns JwtPayload object
   */
  async validate(payload: JwtPayload): Promise<JwtPayload> {
    return payload;
  }
}
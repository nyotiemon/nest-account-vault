
import { Strategy } from 'passport-local';
import { PassportStrategy, AuthGuard } from '@nestjs/passport';
import { HttpStatus, Injectable, } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { BaseResponse } from '../../utils/baseresponse';
import { Account } from '../entities/account.entity';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<Account> {
    const account = await this.authService.loginLocal(email, password);
    if (!account) {
        throw BaseResponse.CreateAsError(HttpStatus.UNAUTHORIZED, 'incorrect email/password');
    }
    // Passport will build a user object based on the return value of this method, 
    // and attach it as a property on the Request object
    return account;
  }
}
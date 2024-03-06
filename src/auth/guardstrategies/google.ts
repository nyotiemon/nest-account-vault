import { PassportStrategy, AuthGuard } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Injectable, } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Account } from '../entities/account.entity';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/api/auth/google/callback',
        scope: ['email', 'profile'],
    });
  }

  /**
   * Validate google authentication
   * @param _accessToken currently not being used in this fn
   * @param _refreshToken currently not being used in this fn
   * @param profile Google profile
   * @returns Account from db
   */
  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): Promise<Account> {
    let account = await this.authService.loginGoogle(profile);
    // Passport will build a user object based on the return value of this method, 
    // and attach it as a property on the Request object
    return account;
  }
}
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { BaseResponse } from '../utils/baseresponse';
import { Account } from './entities/account.entity';
import { Profile } from 'passport-google-oauth20';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account) private readonly repo: Repository<Account>,
    private readonly jwt: JwtService,
  ) {}

  /**
   * signup will store requested data to db
   * @param entity Account entity created using Account.NewAccount
   * @returns BaseResponse<string>
   */
  async signup(entity: Account): Promise<BaseResponse<string>> {
    var response = new BaseResponse<string>();
    response.statusCode = HttpStatus.CREATED;
    
    // verify email not yet registered
    const result = await this.repo.findOne({where: {email: entity.email}});
    if (result != null) {
      // already registered email will return 200 OK
      response.payload = 'email registered';
      return response
    }

    // store to db
    const newAccount = await this.repo.save(entity);

    // TODO: log id of new account

    response.payload = 'account created';
    return response;
  }

  /**
   * loginLocal will be called by LocalStrategy
   * @param email 
   * @param password 
   * @returns Account entity
   */
  async loginLocal(email: string, password: string): Promise<Account | null> {
    let account = await this.repo.findOne({where: {email: email}})
    if (account == null) {
      return null;
    }

    let valid = await account.ComparePassword(password);
    if (!valid) {
      return null;
    }

    return account;
  }

  /**
   * loginGoogle will be called by GoogleStrategy
   * @param googleProfile 
   * @returns guaranteed Account entity
   */
  async loginGoogle(googleProfile: Profile): Promise<Account> {
    const { id, name, emails } = googleProfile;

    let account = await this.repo.findOne({where: {email: emails[0].value}})
    if (account == null) {
      account = await this.repo.save(
        Account.NewGoogleAccount(id, emails[0].value, name.familyName + ' ' + name.givenName)
      );
    }

    return account;
  }

  /**
   * update db increment loginCount value by 1 of the given account
   * @param account 
   */
  async increaseLoginCount(account: Account) {
    this.repo.update(account.id, {loginCount: account.loginCount+1});
  }

  /**
   * Sign a payload and return signed token
   * @param payload a plain object
   * @returns token string
   */
  async signJwtPayload(payload: object): Promise<string> {
    return this.jwt.sign(payload);
  }
}

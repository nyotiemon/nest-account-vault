import { HttpStatus, Injectable } from '@nestjs/common';
import { Account } from './entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseResponse } from '../utils/baseresponse';
import { JwtService } from '@nestjs/jwt';

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
   * login will be called by LocalStrategy
   * @param email 
   * @param password 
   * @returns Account entity
   */
  async login(email: string, password: string): Promise<Account | null> {
    // verify login request with db data
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
   * Sign a payload and return signed token
   * @param payload a plain object
   * @returns token string
   */
  async signJwtPayload(payload: object): Promise<string> {
    return this.jwt.sign(payload);
  }
}

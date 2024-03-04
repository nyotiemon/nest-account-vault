import { HttpStatus, Injectable } from '@nestjs/common';
import { Account } from './entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseResponse } from '../utils/baseresponse';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account) private readonly repo: Repository<Account>
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
}

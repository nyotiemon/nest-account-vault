import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { BaseResponse } from '../utils/baseresponse';

describe('AuthService', () => {
  let service: AuthService;
  let repo: Repository<Account>;

  let account = new Account();
  account.id = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Account),
          useValue: {
            findOne: jest.fn().mockResolvedValue(account),
            save: jest.fn().mockResolvedValue(account),
          }
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repo = module.get<Repository<Account>>(getRepositoryToken(Account));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
  describe('signup', () => {
    it('should success', async () => {
      const repoFindOne = jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      const repoSave = jest.spyOn(repo, 'save');

      var req = Account.NewAccount('test', 'test', 'abc');
      var res = BaseResponse.CreateAsSuccess(201, 'account created');
      await expect(service.signup(req)).resolves.toEqual(res);
      expect(repoFindOne).toHaveBeenCalledWith({ where: { email: 'test' } });
      expect(repoSave).toHaveBeenCalledTimes(1);
    });

    it('registered should success', async () => {
      const repoFindOne = jest.spyOn(repo, 'findOne');
      const repoSave = jest.spyOn(repo, 'save');

      var req = Account.NewAccount('test', 'test', 'abc');
      var res = BaseResponse.CreateAsSuccess(201, 'email registered');
      await expect(service.signup(req)).resolves.toEqual(res);
      expect(repoFindOne).toHaveBeenCalledWith({ where: { email: 'test' } });
      expect(repoSave).toHaveBeenCalledTimes(0);
    });

  });
});

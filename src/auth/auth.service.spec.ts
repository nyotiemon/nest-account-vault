import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { BaseResponse } from '../utils/baseresponse';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let repo: Repository<Account>;
  let jwt: jest.Mocked<JwtService>;

  let account = Account.NewAccount('test@abc.com', 'nametest', 'plainpwd');
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
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockResolvedValue('signedtoken'),
          }
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repo = module.get<Repository<Account>>(getRepositoryToken(Account));
    jwt = module.get<JwtService, jest.Mocked<JwtService>>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(AuthService);
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

  describe('login', () => {
    const email = 'test@abc.com';
    const password = 'plainpwd';

    it('should success', async () => {
      const repoFindOne = jest.spyOn(repo, 'findOne');

      const loginResult = await service.login(email, password);
      expect(loginResult.email).toEqual(account.email);
      expect(repoFindOne).toHaveBeenCalledWith({ where: { email: email } });
    });

    it('should return null on unregistered email', async () => {
      const repoFindOne = jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.login('test', 'password')).resolves.toBeNull();
      expect(repoFindOne).toHaveBeenCalledWith({ where: { email: 'test' } });
    });

    it('should return null on wrong password', async () => {
      await expect(service.login(email, 'password')).resolves.toBeNull();
    });
  });
  
  it('should sign a new JWT', async () => {
    const token = await service.signJwtPayload({random: 'payload'});
    expect(token).toEqual(expect.any(String));
  });
});

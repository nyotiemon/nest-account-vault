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
  account.loginCount = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Account),
          useValue: {
            findOne: jest.fn().mockResolvedValue(account),
            save: jest.fn().mockResolvedValue(account),
            update: jest.fn(),
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

  describe('local login', () => {
    const email = 'test@abc.com';
    const password = 'plainpwd';

    it('should success', async () => {
      const repoFindOne = jest.spyOn(repo, 'findOne');

      const loginResult = await service.loginLocal(email, password);
      expect(loginResult.email).toEqual(email);
      expect(repoFindOne).toHaveBeenCalledWith({ where: { email: email } });
    });

    it('should return null on unregistered email', async () => {
      const repoFindOne = jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.loginLocal('test', 'password')).resolves.toBeNull();
      expect(repoFindOne).toHaveBeenCalledWith({ where: { email: 'test' } });
    });

    it('should return null on wrong password', async () => {
      await expect(service.loginLocal(email, 'password')).resolves.toBeNull();
    });
  });

  describe('google login', () => {
    const email = 'test@abc.com';
    const profile = {id: 'googleid123', name: {familyName: 'fam', givenName: 'test'}, emails: [{value: email}]};

    it('should create on unregistered', async () => {
      const spyDbFindOne = jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      const spyDbSave = jest.spyOn(repo, 'save').mockResolvedValue(Account.NewGoogleAccount(profile.id, email, 'fam test'));

      const loginResult = await service.loginGoogle(profile);
      expect(loginResult).toBeDefined();
      expect(loginResult).toBeInstanceOf(Account);
      expect(loginResult.name).toEqual('fam test');
      expect(spyDbFindOne).toHaveBeenCalledWith({ where: { email: email } });
      expect(spyDbSave).toHaveBeenCalledTimes(1);
    });

    it('should not create on registered', async () => {
      const spyDbFindOne = jest.spyOn(repo, 'findOne');
      const spyDbSave = jest.spyOn(repo, 'save');

      const loginResult = await service.loginGoogle(profile);
      expect(loginResult).toBeDefined();
      expect(loginResult).toBeInstanceOf(Account);
      expect(loginResult.email).toEqual(email);
      expect(spyDbFindOne).toHaveBeenCalledWith({ where: { email: email } });
      expect(spyDbSave).toHaveBeenCalledTimes(0);
    });
  });

  it('should increment loginCount', async () => {
    const repoUpdate = jest.spyOn(repo, 'update');
    await service.increaseLoginCount(account);
    expect(repoUpdate).toHaveBeenCalledTimes(1);
    expect(repoUpdate).toHaveBeenCalledWith(1, {loginCount: 2});
  });
  
  it('should sign a new JWT', async () => {
    const token = await service.signJwtPayload({random: 'payload'});
    expect(token).toEqual(expect.any(String));
  });
});

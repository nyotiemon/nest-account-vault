import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignupReqDto } from './dto/signup.dto';
import { HttpException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signup: jest.fn().mockImplementation( async () => 
              Promise.resolve({statusCode:201, payload: 'account created'}))
          }
        },
      ],
    }).compile();
    
    service = module.get<AuthService>(AuthService);
    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  
  describe('signup', () => {
    it('should success', async () => {
      var req = new SignupReqDto('test', 'test', 'abc', 'abc');
      await expect(controller.create(req)).resolves.toEqual('account created');
    });

    it('should fail: p1 != p2', async () => {
      var req = new SignupReqDto('test', 'test', 'abc', '');
      try {
        await controller.create(req);
      } catch(e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.status).toEqual(400);
        expect(e.response).toContain('passwords does not matched');
      }
    });
  });
});

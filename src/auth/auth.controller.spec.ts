import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignupReqDto, SignupResDto } from './dto/signup.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import exp from 'constants';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();
    
    service = module.get<AuthService>(AuthService);
    controller = module.get<AuthController>(AuthController);
  });


  describe('signup', () => {
    it('should success', async () => {
      var req = new SignupReqDto('test', 'test', 'abc', 'abc');
      var response = await controller.create(req);
      expect(response).toBeDefined();
      expect(response.name).toBe(req.name);
      expect(response.email).toBe(req.email);
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

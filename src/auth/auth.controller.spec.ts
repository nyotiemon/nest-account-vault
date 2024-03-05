import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignupReqDto } from './dto/signup.dto';
import { HttpException } from '@nestjs/common';
import { BaseResponse } from '../utils/baseresponse';
import { createRequest, createResponse } from 'node-mocks-http';

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
            signup: jest.fn().mockResolvedValue(BaseResponse.CreateAsSuccess<string>(201, 'account created')), 
            signJwtPayload: jest.fn().mockResolvedValue('signedtoken'),
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
      await expect(controller.signup(req)).resolves.toEqual('account created');
    });

    it('should fail: p1 != p2', async () => {
      var req = new SignupReqDto('test', 'test', 'abc', '');
      try {
        await controller.signup(req);
      } catch(e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.status).toEqual(400);
        expect(e.response).toContain('passwords does not matched');
      }
    });
  });

  describe('login', () => {
    it('should add token to response', async() => {
      // const mockRequest = { user: { id: 1, email: 'email', name: 'name', verified: false } } as unknown as Request;
      const req = createRequest({user: { id: 1, email: 'email', name: 'name', verified: null }});
      const res = createResponse();
  
      await controller.login(req, res);
      expect(res.getHeader('Authorization')).toBe('Bearer signedtoken');
      expect(res.cookies).toHaveProperty('token');
    });
  });
});

import { Controller, Post, Body, HttpException, HttpStatus, HttpCode, UseGuards, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SignupReqDto } from './dto/signup.dto';
import { Account } from './entities/account.entity';
import { LocalAuthGuard } from './guardstrategies/local';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly service: AuthService,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() request: SignupReqDto): Promise<string> {
    // verify p1 p2 match
    if (request.password1 != request.password2) {
      throw new HttpException('passwords does not matched', HttpStatus.BAD_REQUEST);
    }

    const res = await this.service.signup(
      Account.NewAccount(request.email, request.name, request.password1));
    return res.payload;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.ACCEPTED)
  async login(
    @Req() request: Request, 
    @Res({ passthrough: true }) response: Response
  ) {
    // req.user is from LocalStrategy.validate()
    let account = request.user as Account;
    
    // generate JWT token
    let payload = {id: account.id, email: account.email, name: account.name, verified: account.verified != null};
    let token = await this.service.signJwtPayload(payload);

    // increase login count before ending
    this.service.increaseLoginCount(account);

    response.setHeader('Authorization', `Bearer ${token}`);
    response.cookie('token', token, {
      httpOnly: true,
      signed: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
  }
}

import { Controller, Post, Body, HttpException, HttpStatus, HttpCode, UseGuards, Res, Req, Get } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SignupReqDto } from './dto/signup.dto';
import { JwtPayload } from './dto/jwt-payload.dto';
import { Account } from './entities/account.entity';
import { LocalAuthGuard } from './guardstrategies/local';
import { GoogleAuthGuard } from './guardstrategies/google';
import { JwtAuthGuard } from './guardstrategies/jwt';

@Controller('auth')
export class AuthController {
  TOKEN_KEY: string;

  constructor(
    private readonly service: AuthService,
  ) {
    this.TOKEN_KEY = 'token';
  }

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

  async successLoginSequence(
    request: Request, 
    response: Response
  ) {
    // req.user is from Strategy.validate()
    let account = request.user as Account;
    
    // generate JWT token
    let payload = new JwtPayload(account.id, account.email, account.name, account.verified != null);
    let token = await this.service.jwtSign(payload);

    // increase login count before ending
    await this.service.increaseLoginCount(account);

    response.setHeader('Authorization', `Bearer ${token}`);
    response.cookie(this.TOKEN_KEY, token, {
      httpOnly: true,
      signed: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
    
    // redirect to dashboard
    response.redirect(HttpStatus.PERMANENT_REDIRECT, '/');
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.ACCEPTED)
  async login(
    @Req() request: Request, 
    @Res({ passthrough: true }) response: Response
  ) {
    await this.successLoginSequence(request, response);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  async googleLogin() {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(
    @Req() request: Request, 
    @Res({ passthrough: true }) response: Response
  ) {
    await this.successLoginSequence(request, response);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  logout(
    @Res({ passthrough: true }) response: Response
  ) {
    response.clearCookie(this.TOKEN_KEY);
    response.redirect(HttpStatus.PERMANENT_REDIRECT, '/');
  }
}

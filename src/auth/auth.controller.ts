import { Controller, Post, Body, HttpException, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupReqDto } from './dto/signup.dto';
import { Account } from './entities/account.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly service: AuthService
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() request: SignupReqDto) {
    // verify p1 p2 match
    if (request.password1 != request.password2) {
      throw new HttpException('passwords does not matched', HttpStatus.BAD_REQUEST);
    }

    const res = await this.service.signup(
      Account.NewAccount(request.email, request.name, request.password1));
    return res.payload;
  }
}

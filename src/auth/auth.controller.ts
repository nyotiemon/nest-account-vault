import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupReqDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  create(@Body() signupReqDto: SignupReqDto) {
    // verify p1 p2 match
    if (signupReqDto.password1 != signupReqDto.password2)  {
      throw new HttpException('passwords does not matched', HttpStatus.BAD_REQUEST);
    }

    return this.authService.signup(signupReqDto);
  }
}

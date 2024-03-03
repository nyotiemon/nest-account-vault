import { Injectable } from '@nestjs/common';
import { SignupReqDto, SignupResDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  signup(signupReqDto: SignupReqDto) {
    
    // verify email not yet registered

    var res = new SignupResDto(1, signupReqDto.email, signupReqDto.name, new Date());
    return res;
  }
}

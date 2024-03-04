import { IsEmail, IsNotEmpty, MaxLength, IsStrongPassword } from "class-validator";

export class SignupReqDto {
    @IsEmail()
    @MaxLength(255)
    email: string;

    @IsNotEmpty()
    name: string;

    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    })
    @MaxLength(255)
    password1: string;

    @IsNotEmpty()
    password2: string;

    constructor(email: string, name: string, password1: string, password2: string) {
        this.email = email;
        this.name = name;
        this.password1 = password1;
        this.password2 = password2;
    }
}
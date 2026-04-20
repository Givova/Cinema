import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class AuthDto {
    @IsEmail()
    email!: string;

    @MinLength(6, {
        message: 'Passport cannot be less than 6 characters!'
    })
    @MaxLength(30, {
        message: 'Passport cannot be more than 30 characters!'
    })
    @IsString()
    password!: string;
}
import { IsString } from "class-validator";


export class RegisterDto {

    @IsString()
    name!: string;

    @IsString()
    email!: string;

    @IsString()
    password!: string;

    @IsString()
    passwordConfirmation!: string;

    @IsString()
    phone!: string;
}
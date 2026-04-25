import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator"

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    email!:string

    @IsStrongPassword()
    @IsNotEmpty()
    pass_word!:string

}

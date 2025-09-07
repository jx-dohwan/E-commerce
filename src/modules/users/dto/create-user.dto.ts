import { IsString, MaxLength } from "class-validator";

// User는 조회 용도인가?
export class CreateUserDto {

    @IsString()
    @MaxLength(255)
    email: string;

    @IsString()
    @MaxLength(255)
    password: string;


}

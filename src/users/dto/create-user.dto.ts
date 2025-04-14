import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { IsString } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({
        description: 'User name',
        example: 'John Doe',
        required: true,
        type: String,
    })
    @Transform(({ value }) => String(value).trim())
    @IsString()
    @Type(() => String)
    @MinLength(3)
    @MaxLength(25)
    name: string;

    @ApiProperty({
        description: 'User email',
        example: 'john.doe@example.com',
        required: true,
        type: String,
    })
    @IsEmail()
    @Type(() => String)
    @MaxLength(255)
    email: string;

    @ApiProperty({
        description: 'User password',
        example: 'password',
        required: true,
        type: String,
    })
    @Transform(({ value }) => String(value).trim())
    @IsString()
    @Type(() => String)
    @MinLength(6)
    @MaxLength(50)
    password: string;
}

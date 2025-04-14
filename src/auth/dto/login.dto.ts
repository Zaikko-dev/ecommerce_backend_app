import { IsString, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { MaxLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class LoginDto {
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

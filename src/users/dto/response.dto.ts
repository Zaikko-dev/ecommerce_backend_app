import { ApiProperty } from '@nestjs/swagger';

export class ResponseUserServiceDto {
    @ApiProperty({
        description: 'User name',
        example: 'John Doe',
        required: true,
        type: String,
    })
    name: string;

    @ApiProperty({
        description: 'User email',
        example: 'john.doe@example.com',
        required: true,
        type: String,
    })
    email: string;
}

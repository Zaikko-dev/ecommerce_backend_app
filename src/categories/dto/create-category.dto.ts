import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { Optional } from '@nestjs/common';

export class CreateCategoryDto {
    @ApiProperty({
        description: 'Category name',
        example: 'Electronics',
        required: true,
        type: String,
    })
    @IsString()
    @Type(() => String)
    @Transform(({ value }: { value: string }) => value?.toLowerCase())
    @MinLength(2)
    @MaxLength(25)
    name: string;

    @ApiProperty({
        description: 'Category description',
        example: 'Smartphones, tablets, laptops, etc.',
        required: false,
        type: String,
    })
    @IsString()
    @Type(() => String)
    @Optional()
    //@MinLength(2)
    @MaxLength(100)
    description: string;
}

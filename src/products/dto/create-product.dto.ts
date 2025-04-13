import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsInt,
    IsNumber,
    IsString,
    MaxLength,
    Min,
    MinLength,
} from 'class-validator';

export class CreateProductDto {
    @ApiProperty({
        description: 'Product name',
        example: 'IPhone 13',
        required: true,
        type: String,
    })
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    @Type(() => String)
    name: string;

    @ApiProperty({
        description: 'Product description',
        example: 'Latest model of IPhone',
        required: false,
        type: String,
    })
    @IsString()
    @Optional()
    @MaxLength(200)
    @Type(() => String)
    description: string;

    @ApiProperty({
        description: 'Product price',
        example: 1000,
        required: true,
        type: Number,
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Type(() => Number)
    price: number;

    @ApiProperty({
        description: 'Product stock',
        example: 100,
        required: true,
        type: Number,
    })
    @IsInt()
    @Min(0)
    @Type(() => Number)
    stock: number;

    @ApiProperty({
        description: 'Product category ID',
        example: 1,
        required: true,
        type: Number,
    })
    @IsInt()
    @Type(() => Number)
    categoryId: number;
}

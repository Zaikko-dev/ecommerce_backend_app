import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export class ProductFiltersDto extends PaginationDto {
    @ApiProperty({
        description: 'Category ID',
        example: 1,
        required: true,
        type: Number,
    })
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    categoryId?: number;

    @ApiProperty({
        description: 'Minimum price',
        example: 0,
        required: false,
        type: Number,
    })
    @IsNumber()
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    minPrice?: number;

    @ApiProperty({
        description: 'Maximum price',
        example: 1000,
        required: false,
        type: Number,
    })
    @IsNumber()
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    maxPrice?: number;

    @ApiProperty({
        description: 'Minimum stock',
        example: 0,
        required: false,
        type: Number,
    })
    @IsNumber()
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    minStock?: number;

    @ApiProperty({
        description: 'Maximum stock',
        example: 1000,
        required: false,
        type: Number,
    })
    @IsNumber()
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    maxStock?: number;

    @ApiProperty({
        description: 'Text to search for in name or description',
        example: 'IPhone',
        required: false,
        type: String,
    })
    @IsString()
    @IsOptional()
    @Type(() => String)
    search?: string;
}

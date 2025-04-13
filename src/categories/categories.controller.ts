import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    ParseIntPipe,
    Put,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiDefaultResponse,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { CreateProductDto } from 'src/products/dto/create-product.dto';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
    Category as CategoryModel,
    Product as ProductModel,
} from 'generated/prisma';

@Controller('categories')
@ApiTags('Categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Get(':id')
    @ApiOperation({
        summary: 'Get a category by ID',
        description: 'Returns the category object',
        operationId: '1',
    })
    @ApiOkResponse({
        description: 'Category found',
        type: CreateCategoryDto,
    })
    @ApiNotFoundResponse({
        description: 'Category not found',
    })
    @ApiBadRequestResponse({
        description: 'Invalid ID',
    })
    @ApiDefaultResponse({
        description: 'Default response',
    })
    @ApiParam({
        name: 'id',
        description: 'Category ID',
        required: true,
        type: Number,
    })
    async findCategoryById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<CategoryModel> {
        return this.categoriesService.findCategoryById(id);
    }

    @Get()
    @ApiOperation({
        summary: 'Get all categories',
        description: 'Returns the list of registered categories',
        operationId: '2',
    })
    @ApiOkResponse({
        description: 'List of registered categories',
        type: [CreateCategoryDto],
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
    })
    @ApiDefaultResponse({
        description: 'Default response',
    })
    async findAllCategories(): Promise<CategoryModel[]> {
        return this.categoriesService.findAllCategories();
    }

    @Post()
    @ApiOperation({
        summary: 'Create a new category',
        description: 'Returns the created category object',
        operationId: '3',
    })
    @ApiCreatedResponse({
        description: 'Category created successfully',
        type: CreateCategoryDto,
    })
    @ApiConflictResponse({
        description: 'Category already exists',
    })
    @ApiBadRequestResponse({
        description: 'Invalid data',
    })
    @ApiDefaultResponse({
        description: 'Default response',
    })
    @ApiBody({ type: CreateCategoryDto })
    async createCategory(
        @Body() createCategoryDto: CreateCategoryDto,
    ): Promise<CategoryModel> {
        return this.categoriesService.createCategory(createCategoryDto);
    }

    @Get(':id/products')
    @ApiOperation({
        summary: 'Get products by category ID',
        description: 'Returns the list of products by category ID',
        operationId: '4',
    })
    @ApiOkResponse({
        description: 'List of registered products',
        type: [CreateProductDto],
    })
    @ApiNotFoundResponse({
        description: 'Category not found',
    })
    @ApiDefaultResponse({
        description: 'Default response',
    })
    @ApiParam({
        name: 'id',
        description: 'Category ID',
        required: true,
        type: Number,
    })
    async getProductsByCategoryId(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ProductModel[]> {
        return this.categoriesService.getProductsByCategoryId(id);
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Update a category by ID',
        description: 'Returns the updated category object',
        operationId: '5',
    })
    @ApiOkResponse({
        description: 'Category updated successfully',
        type: CreateCategoryDto,
    })
    @ApiConflictResponse({
        description: 'Category name already exists',
    })
    @ApiNotFoundResponse({
        description: 'Category not found',
    })
    @ApiDefaultResponse({
        description: 'Default response',
    })
    @ApiParam({
        name: 'id',
        description: 'Category ID',
        required: true,
        type: Number,
    })
    @ApiBody({ type: UpdateCategoryDto })
    async updateCategory(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCategoryDto: UpdateCategoryDto,
    ): Promise<CategoryModel> {
        return this.categoriesService.updateCategory(id, updateCategoryDto);
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Delete a category by ID',
        description: 'Returns the deleted category object',
        operationId: '7',
    })
    @ApiOkResponse({
        description: 'Category deleted successfully',
        type: CreateCategoryDto,
    })
    @ApiNotFoundResponse({
        description: 'Category not found',
    })
    @ApiConflictResponse({
        description: 'Category has products associated',
    })
    @ApiDefaultResponse({
        description: 'Default response',
    })
    @ApiParam({
        name: 'id',
        description: 'Category ID',
        required: true,
        type: Number,
    })
    async removeCategory(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<CategoryModel> {
        return this.categoriesService.removeCategory(id);
    }
}

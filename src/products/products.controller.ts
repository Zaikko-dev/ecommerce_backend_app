import {
    Body,
    Controller,
    Delete,
    FileTypeValidator,
    Get,
    MaxFileSizeValidator,
    Param,
    ParseFilePipe,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product as ProductModel } from 'generated/prisma';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginatedResponse } from './interfaces/paginated-response.interface';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductFiltersDto } from './dto/product-filters.dto';
import { ImagesService } from '../images/images.service';
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiCreatedResponse,
    ApiDefaultResponse,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';

@Controller('products')
@ApiTags('Products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly productImagesService: ImagesService,
    ) {}

    @Get(':id')
    @ApiOperation({
        summary: 'Get a product by ID',
        description: 'Returns the product object',
        operationId: '1',
    })
    @ApiOkResponse({
        description: 'Product found',
        type: CreateProductDto,
    })
    @ApiNotFoundResponse({
        description: 'Product not found',
    })
    @ApiBadRequestResponse({
        description: 'Invalid ID',
    })
    @ApiDefaultResponse({
        description: 'Default response',
    })
    @ApiParam({
        name: 'id',
        description: 'Product ID',
        required: true,
        type: Number,
    })
    async findProductById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ProductModel> {
        return await this.productsService.findProductById(id);
    }

    @Get()
    @ApiOperation({
        summary: 'Get all products',
        description: 'Returns the list of registered products',
        operationId: '2',
    })
    @ApiOkResponse({
        description: 'List of registered products',
        type: [CreateProductDto],
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
    })
    @ApiNotFoundResponse({
        description: 'Category not found',
    })
    @ApiBadRequestResponse({
        description: 'Invalid filters',
    })
    @ApiDefaultResponse({
        description: 'Default response',
    })
    /*@ApiQuery({
        name: 'filtersDto',
        description: 'Filters for the products',
        required: false,
        type: ProductFiltersDto,
    })*/
    async findAllProducts(
        @Query() filtersDto: ProductFiltersDto,
    ): Promise<PaginatedResponse<ProductModel>> {
        return this.productsService.findAllProducts(filtersDto);
    }

    @Get(':id/stock')
    @ApiOperation({
        summary: 'Get the stock of a product by ID',
        description: 'Returns the stock of the product',
        operationId: '3',
    })
    @ApiOkResponse({
        description: 'Stock of the product',
        example: 17,
        type: Number,
    })
    @ApiNotFoundResponse({
        description: 'Product not found',
    })
    @ApiBadRequestResponse({
        description: 'Invalid ID',
    })
    @ApiDefaultResponse({
        description: 'Default response',
    })
    @ApiParam({
        name: 'id',
        description: 'Product ID',
        required: true,
        type: Number,
    })
    async getProductStock(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<number> {
        return this.productsService.getProductStock(id);
    }

    @Post()
    @ApiOperation({
        summary: 'Create a new product',
        description: 'Returns the created product object',
        operationId: '4',
    })
    @ApiCreatedResponse({
        description: 'Product created successfully',
        type: CreateProductDto,
    })
    @ApiNotFoundResponse({
        description: 'Category not found',
    })
    @ApiBadRequestResponse({
        description: 'Invalid data',
    })
    @ApiDefaultResponse({
        description: 'Default response',
    })
    @ApiBody({ type: CreateProductDto, required: true })
    @UseInterceptors(FilesInterceptor('images'))
    async createProduct(
        @Body() createProductDto: CreateProductDto,
        @UploadedFiles(
            new ParseFilePipe({
                validators: [
                    new FileTypeValidator({ fileType: 'image/*' }),
                    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
                ],
            }),
        )
        files?: Express.Multer.File[],
    ): Promise<ProductModel> {
        return this.productsService.createProduct(createProductDto, files);
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Update a product by ID',
        description: 'Returns the updated product object',
        operationId: '5',
    })
    @ApiOkResponse({
        description: 'Product updated successfully',
        type: CreateProductDto,
    })
    @ApiNotFoundResponse({
        description: 'Product or category not found',
    })
    @ApiBadRequestResponse({
        description: 'Invalid data',
    })
    @ApiDefaultResponse({
        description: 'Default response',
    })
    @ApiParam({
        name: 'id',
        description: 'Product ID',
        required: true,
        type: Number,
    })
    @ApiBody({ type: UpdateProductDto, required: true })
    @UseInterceptors(FilesInterceptor('images'))
    async updateProduct(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProductDto: UpdateProductDto,
        @UploadedFiles(
            new ParseFilePipe({
                fileIsRequired: false,
                validators: [
                    new FileTypeValidator({ fileType: 'image/*' }),
                    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
                ],
            }),
        )
        files?: Express.Multer.File[],
    ): Promise<ProductModel> {
        return this.productsService.updateProduct(id, updateProductDto, files);
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Delete a product by ID',
        description: 'Returns the deleted product object',
        operationId: '6',
    })
    @ApiOkResponse({
        description: 'Product deleted successfully',
        type: CreateProductDto,
    })
    @ApiNotFoundResponse({
        description: 'Product not found',
    })
    @ApiBadRequestResponse({
        description: 'Invalid ID',
    })
    @ApiDefaultResponse({
        description: 'Default response',
    })
    @ApiParam({
        name: 'id',
        description: 'Product ID',
        required: true,
        type: Number,
    })
    async removeProduct(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ProductModel> {
        return this.productsService.removeProduct(id);
    }
}

import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Prisma, Product as ProductModel } from 'generated/prisma';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginatedResponse } from './interfaces/paginated-response.interface';
import { CategoriesService } from 'src/categories/categories.service';
import { ProductFiltersDto } from './dto/product-filters.dto';
import { ImagesService } from '../images/images.service';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';

@Injectable()
export class ProductsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly categorieService: CategoriesService,
        private readonly imagesService: ImagesService,
    ) {}

    private handlePrismaError(error: unknown): never {
        if (error instanceof PrismaClientKnownRequestError) {
            throw new BadRequestException('Error in the data provided');
        }
        throw error;
    }

    private async saveProductImages(
        productId: number,
        files: Express.Multer.File[],
    ): Promise<string[]> {
        const productPath = join(
            process.cwd(),
            'uploads',
            'products',
            productId.toString(),
        );
        if (!existsSync(productPath)) {
            mkdirSync(productPath, { recursive: true });
        }

        const imageUrls = await Promise.all(
            files.map((file) => {
                const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`;
                const filePath = join(productPath, filename);
                writeFileSync(filePath, file.buffer);
                return `/uploads/products/${productId}/${filename}`;
            }),
        );

        await Promise.all(
            imageUrls.map((url) =>
                this.imagesService.createProductImage(productId, url),
            ),
        );

        return imageUrls;
    }

    async findProductById(id: number): Promise<ProductModel> {
        try {
            const product = await this.prismaService.product.findUnique({
                where: { id },
                include: {
                    images: true,
                    category: true,
                },
            });

            if (!product) {
                throw new NotFoundException(
                    `Product with id '${id}' not found`,
                );
            }

            return product;
        } catch (error) {
            this.handlePrismaError(error);
        }
    }

    async findAllProducts(
        query: ProductFiltersDto,
    ): Promise<PaginatedResponse<ProductModel>> {
        if (query.categoryId) {
            await this.categorieService.findCategoryById(query.categoryId);
        }
        try {
            const { page = 1, limit = 10, ...filters } = query;
            const skip = (page - 1) * limit;

            const where: Prisma.ProductWhereInput = {};

            if (filters?.categoryId) where.categoryId = filters.categoryId;
            if (filters?.minPrice || filters?.maxPrice) {
                where.price = {
                    ...(filters.minPrice && { gte: filters.minPrice }),
                    ...(filters.maxPrice && { lte: filters.maxPrice }),
                };
            }
            if (filters?.minStock || filters?.maxStock) {
                where.stock = {
                    ...(filters.minStock && { gte: filters.minStock }),
                    ...(filters.maxStock && { lte: filters.maxStock }),
                };
            }
            if (filters?.search) {
                where.OR = [
                    {
                        name: {
                            contains: filters.search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        description: {
                            contains: filters.search,
                            mode: 'insensitive',
                        },
                    },
                ];
            }

            const [products, total] = await Promise.all([
                this.prismaService.product.findMany({
                    skip,
                    take: limit,
                    where,
                    include: {
                        category: true,
                        images: true,
                    },
                    orderBy: {
                        id: 'desc',
                    },
                }),
                this.prismaService.product.count(),
            ]);

            const totalPages = Math.ceil(total / limit);

            return {
                data: products,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages,
                },
            };
        } catch (error) {
            this.handlePrismaError(error);
        }
    }

    async createProduct(
        createProductDto: CreateProductDto,
        files?: Express.Multer.File[],
    ): Promise<ProductModel> {
        await this.categorieService.findCategoryById(
            createProductDto.categoryId,
        );

        try {
            const product = await this.prismaService.product.create({
                data: createProductDto,
            });

            if (files && files.length > 0) {
                await this.saveProductImages(product.id, files);
            }

            return this.findProductById(product.id);
        } catch (error) {
            this.handlePrismaError(error);
        }
    }

    async updateProduct(
        id: number,
        updateProductDto: UpdateProductDto,
        files?: Express.Multer.File[],
    ): Promise<ProductModel> {
        await this.findProductById(id);
        await this.categorieService.findCategoryById(
            updateProductDto.categoryId!,
        );

        try {
            await this.prismaService.product.update({
                where: { id },
                data: updateProductDto,
            });

            if (files && files.length > 0) {
                await this.imagesService.deleteProductImages(id);
                const productPath = join(
                    process.cwd(),
                    'uploads',
                    'products',
                    id.toString(),
                );
                if (existsSync(productPath)) {
                    rmSync(productPath, { recursive: true, force: true });
                }

                await this.saveProductImages(id, files);
            }

            return this.findProductById(id);
        } catch (error) {
            this.handlePrismaError(error);
        }
    }

    async removeProduct(id: number): Promise<ProductModel> {
        await this.findProductById(id);

        try {
            const productPath = join(
                process.cwd(),
                'uploads',
                'products',
                id.toString(),
            );
            if (existsSync(productPath)) {
                rmSync(productPath, { recursive: true, force: true });
            }

            await this.imagesService.deleteProductImages(id);

            return await this.prismaService.product.delete({
                where: { id },
            });
        } catch (error) {
            this.handlePrismaError(error);
        }
    }

    async getProductStock(id: number): Promise<number> {
        try {
            const product = await this.findProductById(id);
            return product.stock;
        } catch (error) {
            this.handlePrismaError(error);
        }
    }
}

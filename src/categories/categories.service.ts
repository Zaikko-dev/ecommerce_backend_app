import {
    ConflictException,
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import {
    Category as CategoryModel,
    Product as ProductModel,
} from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(private readonly prismaService: PrismaService) {}

    private handlePrismaError(error: unknown): never {
        if (error instanceof PrismaClientKnownRequestError) {
            throw new BadRequestException('Error in the data provided');
        }
        throw error;
    }

    private async categoryExistsByName(name: string): Promise<boolean> {
        const existingCategory = await this.prismaService.category.findUnique({
            where: { name: name.toLowerCase() },
        });
        return !!existingCategory;
    }

    async findCategoryById(id: number): Promise<CategoryModel> {
        try {
            const category = await this.prismaService.category.findUnique({
                where: { id },
            });

            if (!category) {
                throw new NotFoundException(
                    `Category with id '${id}' not found`,
                );
            }

            return category;
        } catch (error) {
            this.handlePrismaError(error);
        }
    }

    async findAllCategories(): Promise<CategoryModel[]> {
        try {
            return await this.prismaService.category.findMany({
                orderBy: { id: 'desc' },
            });
        } catch (error) {
            this.handlePrismaError(error);
        }
    }

    async createCategory(
        createCategoryDto: CreateCategoryDto,
    ): Promise<CategoryModel> {
        try {
            if (await this.categoryExistsByName(createCategoryDto.name)) {
                throw new ConflictException(
                    `There is already a category with the name '${createCategoryDto.name}'`,
                );
            }

            return await this.prismaService.category.create({
                data: createCategoryDto,
            });
        } catch (error) {
            this.handlePrismaError(error);
        }
    }

    async updateCategory(
        id: number,
        updateCategoryDto: UpdateCategoryDto,
    ): Promise<CategoryModel> {
        await this.findCategoryById(id);

        try {
            if (
                updateCategoryDto.name &&
                (await this.categoryExistsByName(updateCategoryDto.name))
            ) {
                throw new ConflictException(
                    `There is already a category with the name '${updateCategoryDto.name}'`,
                );
            }

            return await this.prismaService.category.update({
                where: { id },
                data: updateCategoryDto,
            });
        } catch (error) {
            this.handlePrismaError(error);
        }
    }

    async removeCategory(id: number): Promise<CategoryModel> {
        await this.findCategoryById(id);

        try {
            const productCount = await this.prismaService.product.count({
                where: { categoryId: id },
            });

            if (productCount > 0) {
                throw new ConflictException(
                    `Cannot delete a category with associated products`,
                );
            }

            return await this.prismaService.category.delete({ where: { id } });
        } catch (error) {
            this.handlePrismaError(error);
        }
    }

    async getProductsByCategoryId(id: number): Promise<ProductModel[]> {
        await this.findCategoryById(id);

        try {
            return await this.prismaService.product.findMany({
                where: { categoryId: id },
                include: {
                    category: true,
                },
            });
        } catch (error) {
            this.handlePrismaError(error);
        }
    }
}

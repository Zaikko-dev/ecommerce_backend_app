import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductImage } from 'generated/prisma';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';

@Injectable()
export class ImagesService {
    constructor(private readonly prismaService: PrismaService) {}

    private handlePrismaError(error: unknown): never {
        if (error instanceof PrismaClientKnownRequestError) {
            throw new BadRequestException('Error in the data provided');
        }
        throw error;
    }

    async createProductImage(
        productId: number,
        imageUrl: string,
    ): Promise<ProductImage> {
        try {
            return await this.prismaService.productImage.create({
                data: {
                    url: imageUrl,
                    productId,
                },
            });
        } catch (error) {
            this.handlePrismaError(error);
        }
    }

    async getProductImages(productId: number): Promise<ProductImage[]> {
        try {
            const images = await this.prismaService.productImage.findMany({
                where: { productId },
            });

            if (!images.length) {
                throw new NotFoundException(
                    `No images found for product with id '${productId}'`,
                );
            }

            return images;
        } catch (error) {
            this.handlePrismaError(error);
        }
    }

    async deleteProductImages(productId: number) {
        try {
            return this.prismaService.productImage.deleteMany({
                where: {
                    productId,
                },
            });
        } catch (error) {
            this.handlePrismaError(error);
        }
    }
}

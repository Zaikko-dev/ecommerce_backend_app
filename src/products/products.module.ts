import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MulterModule } from '@nestjs/platform-express';
import { CategoriesService } from 'src/categories/categories.service';
import { multerConfig } from 'src/config/multer.config';
import { ImagesService } from '../images/images.service';

@Module({
    controllers: [ProductsController],
    providers: [
        ProductsService,
        PrismaService,
        CategoriesService,
        ImagesService,
    ],
    imports: [MulterModule.register(multerConfig)],
})
export class ProductsModule {}

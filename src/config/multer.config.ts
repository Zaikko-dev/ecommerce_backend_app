import { memoryStorage } from 'multer';
import { Request } from 'express';
import { BadRequestException } from '@nestjs/common';

export const multerConfig = {
    storage: memoryStorage(),
    fileFilter: (
        req: Request,
        file: Express.Multer.File,
        callback: (error: Error | null, acceptFile: boolean) => void,
    ) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
            return callback(
                new BadRequestException(
                    'Only image files (jpg, jpeg, png, gif, webp) are allowed',
                ),
                false,
            );
        }
        callback(null, true);
    },
    limits: {
        fileSize: 3 * 1024 * 1024,
        files: 4,
    },
};

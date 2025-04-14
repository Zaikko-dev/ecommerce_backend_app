import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { User as UserModel } from 'generated/prisma';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUserServiceDto } from './dto/response.dto';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    private handlePrismaError(error: unknown): never {
        if (error instanceof PrismaClientKnownRequestError) {
            throw new BadRequestException('Error in the data provided');
        }
        throw error;
    }

    async findUserByEmail(email: string): Promise<UserModel | null> {
        try {
            return await this.prismaService.user.findUnique({
                where: { email },
            });
        } catch (error) {
            this.handlePrismaError(error);
        }
    }

    async findUserById(id: number): Promise<ResponseUserServiceDto> {
        try {
            const user = await this.prismaService.user.findUnique({
                where: { id },
            });

            if (!user) {
                throw new NotFoundException(`User with id ${id} not found`);
            }

            return {
                name: user.name,
                email: user.email,
            };
        } catch (error) {
            this.handlePrismaError(error);
        }
    }

    async createUser(
        createUserDto: CreateUserDto,
    ): Promise<ResponseUserServiceDto> {
        try {
            const [userByName, userByEmail] = await Promise.all([
                this.prismaService.user.findUnique({
                    where: { name: createUserDto.name },
                }),
                this.prismaService.user.findUnique({
                    where: { email: createUserDto.email },
                }),
            ]);

            if (userByName) {
                throw new ConflictException(
                    `User with name '${createUserDto.name}' already exists`,
                );
            }

            if (userByEmail) {
                throw new ConflictException(
                    `User with email '${createUserDto.email}' already exists`,
                );
            }

            const hashedPassword = await bcrypt.hash(
                createUserDto.password,
                10,
            );

            const user = await this.prismaService.user.create({
                data: {
                    email: createUserDto.email,
                    name: createUserDto.name,
                    password: hashedPassword,
                },
            });

            return {
                name: user.name,
                email: user.email,
            };
        } catch (error) {
            this.handlePrismaError(error);
        }
    }

    async updateUser(
        id: number,
        updateUserDto: UpdateUserDto,
    ): Promise<ResponseUserServiceDto> {
        try {
            const userByName = await this.prismaService.user.findUnique({
                where: { name: updateUserDto.name },
            });

            if (userByName?.name === updateUserDto.name) {
                throw new ConflictException(
                    `User with name '${updateUserDto.name}' already exists`,
                );
            }

            const userbyEmail = await this.findUserByEmail(
                updateUserDto.email!,
            );

            if (userbyEmail) {
                throw new ConflictException(
                    `User with email '${updateUserDto.email}' already exists`,
                );
            }

            const hashedPassword = await bcrypt.hash(
                updateUserDto.password!,
                10,
            );

            const user = await this.prismaService.user.update({
                where: { id },
                data: {
                    ...updateUserDto,
                    password: hashedPassword,
                },
            });

            return {
                name: user.name,
                email: user.email,
            };
        } catch (error) {
            this.handlePrismaError(error);
        }
    }

    async removeUser(id: number): Promise<ResponseUserServiceDto> {
        await this.findUserById(id);
        try {
            await this.prismaService.product.deleteMany({
                where: { userId: id },
            });

            const user = await this.prismaService.user.delete({
                where: { id },
            });

            return {
                name: user.name,
                email: user.email,
            };
        } catch (error) {
            this.handlePrismaError(error);
        }
    }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/users/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/requests.interface';
import { ResponseUserServiceDto } from 'src/users/dto/response.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async register(registerDto: RegisterDto): Promise<ResponseUserServiceDto> {
        return await this.userService.createUser(registerDto);
    }

    async login({ email, password }: LoginDto) {
        const user = await this.userService.findUserByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Email is incorrect');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Password is incorrect');
        }

        const payload = { email: user.email, role: user.role };
        const accessToken = await this.jwtService.signAsync(payload);

        return { email, accessToken };
    }

    async profile(user: JwtPayload): Promise<ResponseUserServiceDto> {
        const profile = await this.userService.findUserByEmail(user.email);

        if (!profile) {
            throw new UnauthorizedException('User unathorized');
        }

        return {
            name: profile.name,
            email: profile.email,
        };
    }
}

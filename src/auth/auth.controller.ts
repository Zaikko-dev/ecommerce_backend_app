import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RequestWithUser } from './interfaces/requests.interface';
import { ROLES } from 'src/utils/roles.enum';
import { Auth } from './decorators/auth.decorator';
import { ResponseUserServiceDto } from 'src/users/dto/response.dto';
import {
    ApiBody,
    ApiConflictResponse,
    ApiDefaultResponse,
    ApiOkResponse,
    ApiOperation,
    ApiBadRequestResponse,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @ApiOperation({
        summary: 'Register a new user',
        description: 'Returns the registered user object',
        operationId: '1',
    })
    @ApiOkResponse({
        description: 'User registered successfully',
        type: ResponseUserServiceDto,
    })
    @ApiConflictResponse({
        description: 'User already exists',
    })
    @ApiBadRequestResponse({
        description: 'Invalid data',
    })
    @ApiDefaultResponse({
        description: 'Default response',
    })
    @ApiBody({ type: RegisterDto })
    register(
        @Body() registerDto: RegisterDto,
    ): Promise<ResponseUserServiceDto> {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @ApiOperation({
        summary: 'Login a user',
        description: 'Returns the logged in user object',
        operationId: '2',
    })
    @ApiOkResponse({
        description: 'User logged in successfully',
        type: ResponseUserServiceDto,
    })
    @ApiBadRequestResponse({
        description: 'Invalid data',
    })
    @ApiDefaultResponse({
        description: 'Default response',
    })
    @ApiBody({ type: LoginDto })
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Get('profile')
    @ApiOperation({
        summary: 'Get user profile',
        description: 'Returns the user profile object',
        operationId: '3',
    })
    @ApiOkResponse({
        description: 'User profile retrieved successfully',
        type: ResponseUserServiceDto,
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized - Invalid or expired token',
    })
    @ApiForbiddenResponse({
        description:
            'Forbidden - User does not have SUPERADMIN, ADMIN or USER role',
    })
    @ApiDefaultResponse({
        description: 'Default response',
    })
    @Auth(ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.USER)
    getProfile(@Req() req: RequestWithUser): Promise<ResponseUserServiceDto> {
        return this.authService.profile(req.user);
    }
}

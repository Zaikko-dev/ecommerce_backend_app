import {
    Body,
    Controller,
    Delete,
    Param,
    ParseIntPipe,
    Put,
} from '@nestjs/common';
import { ResponseUserServiceDto } from './dto/response.dto';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ROLES } from 'src/utils/roles.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import {
    ApiBadRequestResponse,
    ApiConflictResponse,
    ApiDefaultResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
} from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Put(':id')
    @ApiOperation({
        summary: 'Update a user by ID',
        description: 'Returns the updated user object',
        operationId: '1',
    })
    @ApiOkResponse({
        description: 'User updated successfully',
        type: ResponseUserServiceDto,
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized - Invalid or expired token',
    })
    @ApiForbiddenResponse({
        description:
            'Forbidden - User does not have SUPERADMIN, ADMIN or USER role',
    })
    @ApiConflictResponse({
        description: 'User name or email already exists',
    })
    @ApiNotFoundResponse({
        description: 'User not found',
    })
    @ApiDefaultResponse({
        description: 'Default response',
    })
    @ApiParam({
        name: 'id',
        description: 'User ID',
        required: true,
        type: Number,
    })
    @Auth(ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.USER)
    async updateUser(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<ResponseUserServiceDto> {
        return this.userService.updateUser(id, updateUserDto);
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Delete a user by ID',
        description: 'Returns the deleted user object',
        operationId: '2',
    })
    @ApiOkResponse({
        description: 'User deleted successfully',
        type: ResponseUserServiceDto,
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized - Invalid or expired token',
    })
    @ApiForbiddenResponse({
        description: 'Forbidden - User does not have SUPERADMIN role',
    })
    @ApiNotFoundResponse({
        description: 'User not found',
    })
    @ApiBadRequestResponse({
        description: 'Invalid ID',
    })
    @ApiDefaultResponse({
        description: 'Default response',
    })
    @ApiParam({
        name: 'id',
        description: 'User ID',
        required: true,
        type: Number,
    })
    @Auth(ROLES.SUPERADMIN)
    async removeUser(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ResponseUserServiceDto> {
        return this.userService.removeUser(id);
    }
}

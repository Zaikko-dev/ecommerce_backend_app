import { applyDecorators, UseGuards } from '@nestjs/common';
import { ROLES } from 'src/utils/roles.enum';
import { Roles } from './roles.decorator';
import { AuthGuard } from '../guard/auth.guard';
import { RolesGuard } from '../guard/roles.guard';

export function Auth(...roles: ROLES[]) {
    return applyDecorators(Roles(...roles), UseGuards(AuthGuard, RolesGuard));
}

import { Request } from 'express';

export interface RequestWithUser extends Request {
    user: {
        email: string;
        role: string;
    };
}

export interface JwtPayload {
    role: string;
    email: string;
}

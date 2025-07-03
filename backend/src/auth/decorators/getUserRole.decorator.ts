/**
 * @file This module exports the GetUserRole decorator.
 * @module auth/decorator/getUserRole.decorator
 *
 * @description This decorator extracts the user role from the request object.
 * It uses the NestJS createParamDecorator function to access the ExecutionContext
 * and retrieve the user role from the request's user object.
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserRole = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.roles || null;
  },
);

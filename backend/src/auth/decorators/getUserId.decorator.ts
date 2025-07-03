/**
 * @file This module exports the GetUserId decorator.
 * @module auth/decorator/getUserId.decorator
 *
 * @description This decorator extracts the user ID from the request object.
 * It uses the NestJS createParamDecorator function to access the ExecutionContext
 * and retrieve the user ID from the request's user object.
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.sub.value || null; // Assuming that `sub` contains the `userId`
  },
);

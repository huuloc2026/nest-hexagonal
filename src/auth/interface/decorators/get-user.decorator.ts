import { createParamDecorator, ExecutionContext } from '@nestjs/common';

interface UserData {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

type UserFields = keyof UserData;
export const getUser = createParamDecorator(
  (data: UserFields | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (!user) return null;
    return data ? user?.[data] : user;
  },
);

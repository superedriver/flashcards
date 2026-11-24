import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  override getRequestResponse(context: ExecutionContext) {
    if (context.getType() === 'http') {
      const http = context.switchToHttp();
      return {
        req: http.getRequest<Record<string, unknown>>(),
        res: http.getResponse<Record<string, unknown>>(),
      };
    }

    const ctx = GqlExecutionContext.create(context);
    const { req, res } = ctx.getContext<{ req: unknown; res: unknown }>();
    return { req, res } as {
      req: Record<string, unknown>;
      res: Record<string, unknown>;
    };
  }
}

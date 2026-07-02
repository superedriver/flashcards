import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InternalJobGuard } from './internal-job.guard';

function createContext(secretHeader?: string): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({
        headers:
          secretHeader === undefined
            ? {}
            : { 'x-internal-job-secret': secretHeader },
        query: {},
      }),
    }),
  } as ExecutionContext;
}

function createGuard(configuredSecret: string) {
  const configService = {
    get: jest.fn().mockReturnValue(configuredSecret),
  } as unknown as ConfigService;

  return new InternalJobGuard(configService);
}

describe('InternalJobGuard', () => {
  it('throws UnauthorizedException when header is missing', () => {
    const guard = createGuard('expected-secret');

    expect(() => guard.canActivate(createContext())).toThrow(
      UnauthorizedException,
    );
  });

  it('throws UnauthorizedException when configured secret is empty', () => {
    const guard = createGuard('');

    expect(() => guard.canActivate(createContext('expected-secret'))).toThrow(
      UnauthorizedException,
    );
  });

  it('throws UnauthorizedException when header does not match configured secret', () => {
    const guard = createGuard('expected-secret');

    expect(() => guard.canActivate(createContext('wrong-secret'))).toThrow(
      UnauthorizedException,
    );
  });

  it('allows request when header matches configured secret', () => {
    const guard = createGuard('expected-secret');

    expect(guard.canActivate(createContext('expected-secret'))).toBe(true);
  });
});

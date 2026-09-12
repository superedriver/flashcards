import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ErrorCodes } from '../../../../../common/errors';
import { AuthUser, SafeUser } from '../../../domain/types';
import { OptionalGqlAuthGuard } from './optional-gql-auth.guard';

const authUser: AuthUser = {
  id: 'user-1',
  email: 'test@example.com',
  role: 'USER',
};

const safeUser: SafeUser = {
  id: 'user-1',
  email: 'test@example.com',
  role: 'USER',
  emailVerifiedAt: null,
  blockedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

function createContext(authorization?: string) {
  const req: {
    headers: { authorization?: string };
    authUser?: AuthUser;
  } = {
    headers: authorization === undefined ? {} : { authorization },
  };

  jest.spyOn(GqlExecutionContext, 'create').mockReturnValue({
    getContext: () => ({ req }),
  } as GqlExecutionContext);

  return { req, context: {} as ExecutionContext };
}

function createGuard(options?: {
  verifyError?: boolean;
  user?: SafeUser | null;
}) {
  const verify = options?.verifyError
    ? jest.fn().mockRejectedValue(new Error('invalid token'))
    : jest.fn().mockResolvedValue(authUser);
  const findById = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeUser : options.user);

  const guard = new OptionalGqlAuthGuard(
    { sign: jest.fn(), verify },
    {
      findById,
      findByEmail: jest.fn(),
      create: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash: jest.fn(),
      deleteById: jest.fn(),
    },
  );

  return { guard, verify, findById };
}

describe('OptionalGqlAuthGuard', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('allows the request without authUser when the token is missing', async () => {
    const { guard, verify, findById } = createGuard();
    const { context, req } = createContext();

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(verify).not.toHaveBeenCalled();
    expect(findById).not.toHaveBeenCalled();
    expect(req.authUser).toBeUndefined();
  });

  it('throws UNAUTHORIZED when the token is invalid', async () => {
    const { guard, findById } = createGuard({ verifyError: true });
    const { context } = createContext('Bearer invalid-token');

    await expect(guard.canActivate(context)).rejects.toMatchObject({
      code: ErrorCodes.UNAUTHORIZED,
    });
    expect(findById).not.toHaveBeenCalled();
  });

  it('allows the request without authUser when the user no longer exists', async () => {
    const { guard, findById } = createGuard({ user: null });
    const { context, req } = createContext('Bearer access-token');

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(findById).toHaveBeenCalledWith('user-1');
    expect(req.authUser).toBeUndefined();
  });

  it('sets authUser when the user exists', async () => {
    const { guard } = createGuard();
    const { context, req } = createContext('Bearer access-token');

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(req.authUser).toEqual(authUser);
  });
});

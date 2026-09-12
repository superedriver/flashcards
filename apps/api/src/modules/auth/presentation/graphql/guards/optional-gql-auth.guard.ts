import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ApplicationError, ErrorCodes } from '../../../../../common/errors';
import {
  ACCESS_TOKEN_SERVICE,
  AccessTokenServicePort,
} from '../../../application/ports/access-token-service.port';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../application/ports/user-repository.port';
import { AuthUser } from '../../../domain/types';

type GraphqlRequest = {
  headers: {
    authorization?: string;
  };
  authUser?: AuthUser;
};

@Injectable()
export class OptionalGqlAuthGuard implements CanActivate {
  constructor(
    @Inject(ACCESS_TOKEN_SERVICE)
    private readonly accessTokenService: AccessTokenServicePort,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const { req } = gqlContext.getContext<{ req: GraphqlRequest }>();
    const token = this.extractBearerToken(req.headers.authorization);

    if (!token) {
      return true;
    }

    let authUser: AuthUser;

    try {
      authUser = await this.accessTokenService.verify(token);
    } catch {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    const user = await this.userRepository.findById(authUser.id);

    if (!user) {
      return true;
    }

    req.authUser = authUser;
    return true;
  }

  private extractBearerToken(
    authorizationHeader: string | undefined,
  ): string | null {
    if (!authorizationHeader) {
      return null;
    }

    const [scheme, token] = authorizationHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return null;
    }

    return token;
  }
}

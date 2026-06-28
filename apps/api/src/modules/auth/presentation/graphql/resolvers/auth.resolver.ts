import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { RegisterUserUseCase } from '../../../application/use-cases/register-user.use-case';
import { RegisterInput } from '../inputs/register.input';
import { AuthPayloadType } from '../types/auth-payload.type';
import { UserRole } from '../types/user-role.type';

@Resolver()
export class AuthResolver {
  constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

  @Mutation(() => AuthPayloadType)
  async register(
    @Args('input') input: RegisterInput,
  ): Promise<AuthPayloadType> {
    const result = await this.registerUserUseCase.execute(input);

    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: {
        ...result.user,
        role: result.user.role as UserRole,
      },
    };
  }
}

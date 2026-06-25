import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class RootResolver {
  @Query(() => String, {
    description: 'GraphQL transport health check.',
  })
  apiStatus(): string {
    return 'ok';
  }
}

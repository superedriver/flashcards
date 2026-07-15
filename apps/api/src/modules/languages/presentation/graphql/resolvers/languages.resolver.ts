import { Args, Query, Resolver } from '@nestjs/graphql';
import { ListLanguagesUseCase } from '../../../application/use-cases/list-languages.use-case';
import { LanguageType } from '../types/language.type';

@Resolver()
export class LanguagesResolver {
  constructor(private readonly listLanguagesUseCase: ListLanguagesUseCase) {}

  @Query(() => [LanguageType])
  async languages(
    @Args('search', { type: () => String, nullable: true })
    search?: string | null,
  ): Promise<LanguageType[]> {
    return this.listLanguagesUseCase.execute({ search });
  }
}

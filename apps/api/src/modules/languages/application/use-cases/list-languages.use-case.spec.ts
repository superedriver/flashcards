import { Language } from '../../domain/types';
import { ListLanguagesUseCase } from './list-languages.use-case';

const spanish: Language = {
  code: 'es',
  englishName: 'Spanish',
  nativeName: 'Español',
  flag: '🇪🇸',
  popularSortOrder: 2,
};

function createUseCase() {
  const findAll = jest.fn().mockResolvedValue([spanish]);

  const useCase = new ListLanguagesUseCase({
    findAll,
  });

  return { useCase, findAll };
}

describe('ListLanguagesUseCase', () => {
  it('returns languages from repository', async () => {
    const { useCase } = createUseCase();

    await expect(useCase.execute({})).resolves.toEqual([spanish]);
  });

  it('passes null search when search is omitted', async () => {
    const { useCase, findAll } = createUseCase();

    await useCase.execute({});

    expect(findAll).toHaveBeenCalledWith({ search: null });
  });

  it('trims search and passes null when search is empty/whitespace', async () => {
    const { useCase, findAll } = createUseCase();

    await useCase.execute({ search: '   ' });

    expect(findAll).toHaveBeenCalledWith({ search: null });
  });

  it('passes trimmed search to repository', async () => {
    const { useCase, findAll } = createUseCase();

    await useCase.execute({ search: '  span  ' });

    expect(findAll).toHaveBeenCalledWith({ search: 'span' });
  });
});

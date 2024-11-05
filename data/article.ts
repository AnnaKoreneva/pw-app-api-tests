import { faker } from '@faker-js/faker';

interface Article {
    title: string;
    description: string;
    
    
}

export const mockArticle: Article = {
  title: faker.lorem.words(12),
  description: faker.lorem.sentence(12),
};

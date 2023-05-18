
declare module "*.graphql" {
  import { DocumentNode } from 'graphql';
  const GetUserBooks: DocumentNode;
  const UpdateUserBook: DocumentNode;

  export { GetUserBooks, UpdateUserBook };
}

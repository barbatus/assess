
declare module "*.graphql" {
  import { DocumentNode } from 'graphql';
  const GetUserBooks: DocumentNode;
  const UpdateUserBook: DocumentNode;
  const AddUserBook: DocumentNode;
  const GetUserBook: DocumentNode;

  export { GetUserBooks, UpdateUserBook, AddUserBook, GetUserBook };
}

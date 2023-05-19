
declare module "*.graphql" {
  import { DocumentNode } from 'graphql';
  const GetUserBooks: DocumentNode;
  const UpdateUserBook: DocumentNode;
  const UpdateOrCreateUserBook: DocumentNode;
  const AddUserBook: DocumentNode;

  export { GetUserBooks, UpdateUserBook, UpdateOrCreateUserBoo, AddUserBook };
}

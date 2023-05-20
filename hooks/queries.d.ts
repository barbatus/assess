declare module "*.graphql" {
  import { DocumentNode } from "graphql";
  const GetUserBooks: DocumentNode;
  const UpdateUserBook: DocumentNode;
  const AddUserBook: DocumentNode;
  const GetUserBook: DocumentNode;
  const NewFinish: DocumentNode;
  const FinishBook: DocumentNode;

  export { GetUserBooks, UpdateUserBook, AddUserBook, GetUserBook, NewFinish, FinishBook };
}

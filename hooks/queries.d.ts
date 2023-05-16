
declare module "*.graphql" {
  import { DocumentNode } from 'graphql';
  const GetUserBooks: DocumentNode;

  export { GetUserBooks };
}

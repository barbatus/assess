import { MockedProvider, MockedProviderProps } from "@apollo/client/testing";
import { GetUserBooks } from "~/graphql/queries.graphql";

export const mocks: MockedProviderProps['mocks'] = [
  {
    request: {
      query: GetUserBooks,
      variables: {
        offset: 0,
        order: [{ book: { title: 'asc' } }],
        pageSize: 10,
        where: {
          status: { equals: 'READ' },
          userId: { equals: 1 }
        }
      }
    },
    result: {
      data: {
        userBooks: [{ id: 35, status: 'READ', book: { author : "otis fay", cover: null, id: 99, title: 'gee socialism2', __typename: "Book" }, date: "2023-03-19T13:08:49.965Z", __typename: "UserBook" }],
      }
    }
  }
];

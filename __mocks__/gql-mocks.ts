import { MockedProviderProps } from "@apollo/client/testing";
import { GetUserBooks } from "~/graphql/queries.graphql";

type Status = "READ" | "READING" | "TO_READ";

export function buildUserBooks(status: Status, offset: number, len: number) {
  const userBooks = [
    {
      id: 35,
      status,
      book: {
        author: "otis fay",
        cover: null,
        id: 99,
        title: "gee socialism2",
        __typename: "Book",
      },
      date: "2023-03-19T13:08:49.965Z",
      __typename: "UserBook",
    },
    {
      id: 34,
      status,
      book: {
        author: "wallace d'amore",
        cover: "wallace.png",
        id: 11,
        title: "torn scowl lengthen",
        __typename: "Book",
      },
      date: "2023-01-14T17:35:53.783Z",
      __typename: "UserBook",
    },
    {
      id: 23,
      status,
      book: {
        author: "francisco corwin jr.",
        cover: "yuck.png",
        id: 76,
        title: "which likewise yuck",
        __typename: "Book",
      },
      date: "2023-01-14T17:35:53.783Z",
      __typename: "UserBook",
    },
    {
      id: 19,
      status,
      book: { author: "roger paucek", cover: null, id: 72, title: "pfft", __typename: "Book" },
      date: "2022-10-11T14:54:40.007Z",
      __typename: "UserBook",
    },
    {
      id: 27,
      status,
      book: {
        author: "gayle dooley",
        cover: "gayle.png",
        id: 69,
        title: "tomorrow",
        __typename: "Book",
      },
      date: "2022-10-18T22:54:52.539Z",
      __typename: "UserBook",
    },
  ];
  return userBooks.slice(offset, offset + len);
}

export function buildMocks(
  status: Status = "READ",
  pageSize = 10,
  authors?: string[],
): MockedProviderProps["mocks"] {
  return [
    {
      request: {
        query: GetUserBooks,
        variables: {
          offset: 0,
          order: [{ book: { title: "asc" } }],
          pageSize,
          where: {
            status: { equals: status },
            userId: { equals: 1 },
          },
        },
      },
      result: {
        data: {
          userBooks: buildUserBooks(status, 0, pageSize).filter((book) =>
            authors ? authors.includes(book.book.author) : true,
          ),
        },
      },
    },
    {
      request: {
        query: GetUserBooks,
        variables: {
          offset: pageSize,
          order: [{ book: { title: "asc" } }],
          pageSize: pageSize,
          where: {
            status: { equals: status },
            userId: { equals: 1 },
          },
        },
      },
      result: {
        data: {
          userBooks: buildUserBooks(status, pageSize, pageSize).filter((book) =>
            authors ? authors.includes(book.book.author) : true,
          ),
        },
      },
    },
  ];
}

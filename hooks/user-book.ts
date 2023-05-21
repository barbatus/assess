import { useCallback } from "react";
import { useMutation, useQuery } from "@apollo/client";

import { UpdateUserBook, AddUserBook, GetUserBook, FinishBook } from "~/graphql/queries.graphql";

import { UserBook, User } from "~/prisma/generated/type-graphql";

export type UserBookInput = {
  title: string;
  author: string;
  date: Date;
  cover: string | null;
  status: "READ" | "READING" | "TO_READ";
};

export const useUserBook = (opts: { id?: UserBook["id"]; userId?: User["id"] }) => {
  const variables = {
    where: { id: opts.id },
    skip: !opts.id,
  };
  const { data, loading, error } = useQuery<{ userBook: UserBook }>(GetUserBook, {
    variables,
  });

  const [updateMutate] = useMutation(UpdateUserBook);
  const [finishMutate] = useMutation(FinishBook);

  const finishBook = useCallback(
    (rating: number) => {
      return finishMutate({
        variables: {
          book: {
            id: opts.id,
            rating: rating,
          },
        },
      });
    },
    [finishMutate],
  );

  const updateBook = useCallback(
    (input: UserBookInput) => {
      return updateMutate({
        variables: {
          data: {
            book: {
              update: {
                cover: { set: input.cover },
                title: { set: input.title.toLowerCase() },
                author: { set: input.author.toLowerCase() },
              },
            },
            status: { set: input.status },
          },
          where: {
            id: opts.id,
          },
        },
      });
    },
    [updateMutate],
  );

  const [addMutate, { loading: adding }] = useMutation<UserBook>(AddUserBook);

  const addBook = useCallback(
    (data: UserBookInput) => {
      return addMutate({
        variables: {
          data: {
            book: {
              connectOrCreate: {
                create: { title: data.title.toLowerCase(), author: data.author.toLowerCase() },
                where: {
                  title_author: {
                    title: data.title.toLowerCase(),
                    author: data.author.toLowerCase(),
                  },
                },
              },
            },
            user: { connect: { id: opts.userId } },
            date: data.date,
            status: data.status,
          },
          udpate: {},
        },
      }).then((result) => result.data);
    },
    [addMutate],
  );

  return {
    addBook,
    updateBook,
    finishBook,
    adding,
    book: data?.userBook,
    loading,
    error,
  };
};

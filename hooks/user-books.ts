import { useCallback, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";

import { GetUserBooks, UpdateUserBook } from "~/graphql/queries.graphql";

import {
  UserBook,
  User,
  UserBookOrderByWithRelationInput,
  UserBookWhereInput,
} from "~/prisma/generated/type-graphql";

export const useUserBooks = (opts: {
  userId?: User["id"];
  order: UserBookOrderByWithRelationInput[];
  where: UserBookWhereInput;
  status: UserBook["status"];
}) => {
  const [page, setPage] = useState(0);

  const variables = {
    offset: page * 10,
    pageSize: 10,
    where: { userId: { equals: opts.userId }, status: { equals: opts.status }, ...opts.where },
    order: opts.order,
  };
  const { data, loading, error } = useQuery<{ userBooks: UserBook[] }>(GetUserBooks, {
    fetchPolicy: "cache-and-network",
    variables,
    skip: !opts.userId,
  });

  const [finishMutate] = useMutation(UpdateUserBook, {
    update(cache, { data: { updateOneUserBook } }) {
      cache.updateQuery({ query: GetUserBooks, variables }, (data) => {
        return {
          ...data,
          userBooks: data.userBooks.filter((book: UserBook) => book.id !== updateOneUserBook.id),
        };
      });
    },
  });

  const loadNext = useCallback(() => {
    if (loading || !data || (page !== 0 && data.userBooks.length < 10)) return;
    setPage((page) => page + 1);
  }, [loading, data]);

  const loadPrev = useCallback(() => {
    if (loading) return;
    setPage((page) => Math.max(0, page - 1));
  }, [loading]);

  const finishBook = useCallback(
    (userBookId: UserBook["id"], rating: number) => {
      return finishMutate({
        variables: {
          data: {
            status: { set: "READ" },
            rating: { set: rating },
          },
          where: {
            id: userBookId,
          },
        },
      });
    },
    [finishMutate],
  );

  return {
    books: data?.userBooks || [],
    loading,
    error,
    loadNext,
    loadPrev,
    finishBook,
  };
};

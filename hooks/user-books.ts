import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';

import { GetUserBooks, UpdateUserBook } from '~/graphql/queries.graphql';

import { UserBook, User, UserBookOrderByWithRelationInput, UserBookWhereInput } from '~/prisma/generated/type-graphql';

export const useUserBooks = (opts: { userId: User['id'], order: UserBookOrderByWithRelationInput[], where: UserBookWhereInput, status: UserBook['status']  }) => {
  const [page, setPage] = useState(0);

  const variables = {
    offset: page * 10,
    pageSize: 10,
    where: { userId: { equals: 1 }, status: { equals: opts.status }, ...opts.where },
    order: opts.order,
  };
  const { data, loading, error } = useQuery<{ userBooks: UserBook[] }>(GetUserBooks, {
    fetchPolicy: 'cache-and-network',
    variables,
  });

  const [mutate] = useMutation(UpdateUserBook, {
    update(cache, { data: { updateOneUserBook } }) {
      cache.updateQuery({ query: GetUserBooks, variables }, (data) => {
        return {
          ...data,
          userBooks: data.userBooks.filter((book: UserBook) => book.id !== updateOneUserBook.id)
      }});
    },
  });

  const loadNext = useCallback(() => {
    if (loading || !data || (page !== 0 && data.userBooks.length < 10)) return;
    setPage(page => page + 1);
  }, [loading, data]);

  const loadPrev = useCallback(() => {
    if (loading) return;
    setPage(page => Math.max(0, page - 1));
  }, [loading]);

  const finisheBook = useCallback((userBookId: UserBook['id'], rating: number) => {
    return mutate({
      variables: {
        data: {
          status: { set: 'READ' },
          date: { set: new Date() },
          rating: { set: rating },
        },
        where: {
          id: userBookId,
        },
      },
    });
  }, [mutate]);

  return {
    books: data?.userBooks || [], 
    loading,
    error,
    loadNext,
    loadPrev,
    finisheBook,
  };
}

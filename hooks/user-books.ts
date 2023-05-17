import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useQuery } from '@apollo/client';

import { GetUserBooks } from './queries.graphql';

import { UserBook, User, UserBookOrderByWithRelationInput } from '~/prisma/generated/type-graphql';

export const useUserBooks = (opts: { userId: User['id'], order: UserBookOrderByWithRelationInput[], status: UserBook['status']  }) => {
  const [page, setPage] = useState(0);
  const [books, setBooks] = useState<UserBook[]>([]);

  const { data, loading, error } = useQuery<{ userBooks: UserBook[] }>(GetUserBooks, {
    fetchPolicy: 'cache-and-network',
    variables: {
      userId: opts.userId,
      status: opts.status,
      offset: page * 10,
      pageSize: 10,
      order: opts.order,
    },
  });

  useEffect(() => {
    if (error || loading || !data) return;
    if (data.userBooks.length === 0) {
      setPage(page => Math.max(0, page - 1));
    } else {
      setBooks(data.userBooks);
    }
  }, [error, data, loading]);

  const loadNext = useCallback(() => {
    if (loading) return;
    setPage(page => page + 1);
  }, [loading]);

  const loadPrev = useCallback(() => {
    if (loading) return;
    setPage(page => Math.max(0, page - 1));
  }, [loading]);

  return {
    books, 
    loading,
    error,
    loadNext,
    loadPrev,
  };
}

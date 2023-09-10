import { useState, useCallback } from 'react';

import { Prisma, UserBook, User } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

import { server$ } from '@tanstack/bling';

import { prisma } from '~/server/db.secret$';

const userBookWithBook = Prisma.validator<Prisma.UserBookArgs>()({
  include: { book: true },
});

export type UserBookBook = Prisma.UserBookGetPayload<typeof userBookWithBook>;

export const useUserBooks = (opts: {
  userId?: User["id"];
  status: UserBook["status"];
  order: Prisma.UserBookOrderByWithRelationInput[],
  where: Prisma.UserBookWhereInput,
  pageSize?: number;
}) => {
  const [page, setPage] = useState(0);
  const pageSize = opts.pageSize || 10;

  const variables = {
    skip: page * pageSize,
    take: pageSize,
    where: { userId: { equals: opts.userId }, status: { equals: opts.status }, ...opts.where },
    orderBy: opts.order,
  };

  const { data, isLoading } = useQuery(['user.books', ...Object.values(variables)], () => {
    return server$((opts: Prisma.UserBookFindManyArgs) => {
      return prisma.userBook.findMany({
        ...opts,
        include: {
          book: true
        },
      });
    })(variables);
  });


  const loadNext = useCallback(() => {
    if (isLoading || !data || data.length < pageSize) return;
    setPage((page) => page + 1);
  }, [isLoading, data]);

  const loadPrev = useCallback(() => {
    if (isLoading) return;
    setPage((page) => Math.max(0, page - 1));
  }, [isLoading]);

  return { books: data || [], loading: isLoading, loadNext, loadPrev };
};

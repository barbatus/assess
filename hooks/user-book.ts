import { useCallback } from 'react';
import { useMutation } from '@apollo/client';

import { UpdateUserBook, AddUserBook } from '~/graphql/queries.graphql';

import { UserBook, User } from '~/prisma/generated/type-graphql';

export type UserBookInput = {
  title: string;
  author: string;
  date: Date;
  status: 'READ' | 'READING' | 'TO_READ';
}

export const useUserBook = (opts: { id?: UserBook['id'], userId: User['id'] }) => {
  const [finishMutate] = useMutation(UpdateUserBook);

  const finishBook = useCallback((rating: number) => {
    return finishMutate({
      variables: {
        data: {
          status: { set: 'READ' },
          rating: { set: rating },
        },
        where: {
          id: opts.id,
        },
      },
    })
  }, [finishMutate]);

  const [addMutate, { loading: adding }] = useMutation<UserBook>(AddUserBook);

  const addBook = useCallback((data: UserBookInput) => {
    return addMutate({
      variables: {
        data: {
          book: {
            connectOrCreate: {
              create: { title: data.title.toLowerCase(), author: data.author.toLowerCase() },
              where: { title_author: { title: data.title.toLowerCase(), author: data.author.toLowerCase() } },
            },
          },
          user: { connect: { id: opts.userId } },
          date: data.date,
          status: data.status,
        },
        udpate: {},
      },
    }).then(result => result.data);
  }, [addMutate]);

  return {
    finishBook,
    addBook,
    adding,
  };
}

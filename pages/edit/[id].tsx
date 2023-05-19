import { useState, useCallback } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ArrowLeft, CheckSquareIcon } from "lucide-react";
import { Rating } from "react-simple-star-rating";

import { BookForm } from "~/components/book-form";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

import { useUserBook, UserBookInput } from "~/hooks/user-book";

import { getServerApolloClient } from "~/graphql/client";
import { GetUserBook } from "~/graphql/queries.graphql";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const apolloClient = getServerApolloClient();

  await apolloClient.query({
    query: GetUserBook,
    variables: {
      where: { id: Number(query.id) },
    },
  });

  const apolloCache = apolloClient.cache.extract();

  return {
    props: {
      apolloCache,
    },
  };
};

export default function Edit() {
  const router = useRouter();
  const [showRate, setShowRate] = useState(false);
  const [rating, setRating] = useState<number>(0);

  const { book, finishBook, updateBook } = useUserBook({ userId: 1, id: Number(router.query.id) });

  const onFinish = useCallback(() => {
    finishBook(rating);
  }, [finishBook, rating]);

  const onClose = useCallback(() => {
    setShowRate(false);
  }, []);

  const onUpdate = useCallback(
    (data: UserBookInput) => {
      return updateBook(data).then(() => router.push("/"));
    },
    [updateBook],
  );

  return (
    <div className="flex-1">
      {!!showRate && (
        <Dialog open onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Rate</DialogTitle>
            </DialogHeader>
            <Rating onClick={setRating} />
            <DialogFooter>
              <Button variant="secondary" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" size="sm" onClick={onFinish}>
                Ok
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <div className="grid grid-cols-4 items-center max-w-md mx-auto">
        <Button
          variant="ghost"
          className="col-start-1 w-fit ml-auto"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          className="col-start-4 ml-auto text-muted-foreground"
          onClick={() => setShowRate(true)}
        >
          <CheckSquareIcon className="h-5 w-5 mr-2" />
          Finished
        </Button>
      </div>
      <BookForm initialData={book} onDone={onUpdate} />
    </div>
  );
}

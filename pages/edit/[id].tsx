import { useState, useCallback } from "react";
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

import { UserBook } from "~/prisma/generated/type-graphql";

import { useUserBook } from "~/hooks/user-book";

export default function Edit() {
  const router = useRouter();
  const [showRate, setShowRate] = useState(false);
  const [rating, setRating] = useState<number>(0);

  const { finishBook } = useUserBook({ userId: 1, id: Number(router.query.id) });

  const onFinish = useCallback(() => {
    finishBook(rating);
  }, [finishBook, rating]);

  const onClose = useCallback(() => {
    setShowRate(false);
  }, []);

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
      <BookForm onDone={() => router.push("/")} />
    </div>
  );
}

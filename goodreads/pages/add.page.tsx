import { useCallback } from "react";
import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";

import { BookForm } from "~/goodreads/components/book-form";
import { Button } from "~/goodreads/components/ui/button";

import { useUserBook, UserBookInput } from "~/goodreads/hooks/user-book";
import { useAuth } from "~/goodreads/hooks/auth";

export default function Create() {
  const router = useRouter();
  const { user } = useAuth();

  const { addBook } = useUserBook({ userId: user?.id });

  const onAdd = useCallback(
    (data: UserBookInput) => {
      return addBook(data).then(() => router.push("/"));
    },
    [router, addBook],
  );

  return (
    <div className="flex-1">
      <div className="grid grid-cols-4 items-center max-w-md mx-auto">
        <Button
          variant="ghost"
          className="col-start-1 w-fit ml-auto"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </div>
      <BookForm onDone={onAdd} />
    </div>
  );
}

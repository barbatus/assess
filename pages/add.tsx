import { useCallback } from "react";
import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";

import { BookForm } from "~/components/book-form";
import { Button } from "~/components/ui/button";

import { useUserBook, UserBookInput } from "~/hooks/user-book";
import { useAuth } from "~/hooks/auth";

export default function Create() {
  const router = useRouter();
  const { user } = useAuth();

  const { addBook } = useUserBook({ userId: user?.id });

  const onAdd = useCallback(
    (data: UserBookInput) => {
      return addBook(data).then(() => router.push("/"));
    },
    [addBook],
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

import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";

import { BookForm } from "~/components/book-form";
import { Button } from "~/components/ui/button";

export default function Create() {
  const router = useRouter();
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
      <BookForm onBookAdded={() => router.push("/")} />
    </div>
  );
}

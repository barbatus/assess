import { useCallback } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Calendar as CalendarIcon } from "lucide-react";

import { TypeOf, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "~/lib/utils";

import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

import { useUserBook } from "~/hooks/user-book";
import { UserBook } from "~/prisma/generated/type-graphql";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  author: z.string().min(1, { message: "Author is required" }),
  date: z.date({ required_error: "Date is required" }),
  status: z.enum(["READ", "READING", "TO_READ"], { required_error: "Status is required" }),
});

export const BookForm = (props: { onBookAdded: (book: UserBook) => void }) => {
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    control,
  } = useForm<TypeOf<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const { addBook, adding } = useUserBook({ userId: 1 });

  const onSubmitHandler = useCallback(
    async (values: TypeOf<typeof formSchema>) => {
      const newBook = await addBook(values);
      if (newBook) {
        props.onBookAdded(newBook);
      }
    },
    [props.onBookAdded],
  );

  return (
    <div className="grid gap-4 gap-y-5 py-2 max-w-md mx-auto">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Title
        </Label>
        <Input id="title" className="col-span-3" {...register("title")} />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="author" className="text-right">
          Author
        </Label>
        <Input id="author" className="col-span-3" {...register("author")} />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="date" className="text-right">
          Date
        </Label>
        <Controller
          control={control}
          name="date"
          render={({ field: { onChange, ...fieldProps }, fieldState: { error } }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !fieldProps.value && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fieldProps.value ? fieldProps.value.toDateString() : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={fieldProps.value}
                  onSelect={onChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="username" className="text-right">
          Status
        </Label>
        <Controller
          control={control}
          name="status"
          render={({ field: { onChange, ...fieldProps }, fieldState: { error } }) => (
            <Select value={fieldProps.value} onValueChange={onChange}>
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="READ">Read</SelectItem>
                <SelectItem value="READING">Reading</SelectItem>
                <SelectItem value="TO_READ">Want to read</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="grid grid-cols-4 gap-4">
        <Button
          size="sm"
          loading={adding}
          className="col-start-4"
          onClick={handleSubmit(onSubmitHandler)}
        >
          Add
        </Button>
      </div>
    </div>
  );
};

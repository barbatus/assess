import { ReactNode, useCallback, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Calendar as CalendarIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { TypeOf, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "~/lib/utils";
import { UserBookInput } from "~/hooks/user-book";
import { UserBookBook } from "~/hooks/user-books";

import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  author: z.string().min(1, { message: "Author is required" }),
  date: z.date({ required_error: "Date is required" }),
  status: z.enum(["READ", "READING", "TO_READ"], { required_error: "Status is required" }),
  cover: z.string().nullable(),
});

type FormInput = TypeOf<typeof formSchema>;

const FormRow = (props: { children: ReactNode }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
      {props.children}
    </div>
  );
};

export const BookForm = (props: {
  initialData?: Partial<UserBookBook>;
  onDone: (book: UserBookInput) => Promise<unknown>;
}) => {
  const {
    register,
    formState: { errors, isValid },
    setValue,
    handleSubmit,
    control,
    reset,
  } = useForm<FormInput>({
    resolver: zodResolver(formSchema),
  });
  const { t } = useTranslation();

  useEffect(() => {
    reset({
      title: props.initialData?.book?.title ?? "",
      author: props.initialData?.book?.author ?? "",
      status: props.initialData?.status as FormInput["status"],
      date: props.initialData?.date ? new Date(props.initialData.date) : undefined,
      cover: props.initialData?.book?.cover || null,
    });
  }, [props.initialData]);

  const [loading, setLoading] = useState(false);
  const onSubmitHandler = useCallback(
    async (values: TypeOf<typeof formSchema>) => {
      setLoading(true);
      await props.onDone(values).finally(() => setLoading(false));
      setLoading(false);
    },
    [props.onDone],
  );

  const [uploading, setUploading] = useState(false);
  const uploadImage = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.length || uploading) return;

      setUploading(true);
      try {
        const file = e.target.files[0];
        const filename = encodeURIComponent(file.name);
        const res = await fetch(`/api/upload?file=${filename}`);
        const data = await res.json();
        const formData = new FormData();
        setValue("cover", file.name);

        Object.entries({ ...data.fields, file }).forEach(([key, value]) => {
          // @ts-ignore
          formData.append(key, value);
        });

        await fetch(data.url, {
          method: "POST",
          body: formData,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setUploading(false);
      }
    },
    [setValue],
  );

  return (
    <div className="grid gap-4 gap-y-5 py-2 max-w-md mx-auto">
      <FormRow>
        <Label htmlFor="name" className="sm:text-right font-bold">
          {t("Title")}
        </Label>
        <Input id="title" className="col-span-3 capitalize" {...register("title")} />
      </FormRow>
      <FormRow>
        <Label htmlFor="author" className="sm:text-right font-bold">
          {t("Author")}
        </Label>
        <Input id="author" className="col-span-3 capitalize" {...register("author")} />
      </FormRow>
      <FormRow>
        <Label htmlFor="date" className="sm:text-right font-bold">
          {t("Date")}
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
      </FormRow>
      <FormRow>
        <Label htmlFor="" className="sm:text-right font-bold">
          {t("Cover")}
        </Label>
        <Controller
          control={control}
          name="cover"
          render={({ field: { onChange, ...fieldProps }, fieldState: { error } }) => (
            <>
              <Label className="cursor-pointer col-span-1">
                Upload
                <input
                  onChange={uploadImage}
                  type="file"
                  accept="image/png, image/jpeg"
                  name="cover"
                  className="hidden"
                />
              </Label>
              {!uploading && (
                <span className="text-sm leading-3 text-muted-foreground whitespace-nowrap">
                  {fieldProps.value}
                </span>
              )}
              {uploading && <span className="text-sm leading-3">Uploading...</span>}
            </>
          )}
        />
      </FormRow>
      <FormRow>
        <Label htmlFor="status" className="sm:text-right font-bold">
          {t("Status")}
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
                <SelectItem value="READ">{t("Read")}</SelectItem>
                <SelectItem value="READING">{t("Reading")}</SelectItem>
                <SelectItem value="TO_READ">{t("Want To Read")}</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </FormRow>
      <div className="flex justify-end">
        <Button
          size="sm"
          className="w-full sm:w-auto"
          loading={loading}
          onClick={handleSubmit(onSubmitHandler)}
        >
          {props.initialData?.id ? t("Save") : t("Add")}
        </Button>
      </div>
    </div>
  );
};

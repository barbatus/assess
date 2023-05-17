import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import { BooksTable } from "~/components/books";

export default function Home() {
  return (
    <Tabs defaultValue="read" className="w-full">
      <TabsList className="grid grid-cols-3 w-[400px]">
        <TabsTrigger value="read">Read</TabsTrigger>
        <TabsTrigger value="reading">Reading</TabsTrigger>
        <TabsTrigger value="wantToRead">Want To Read</TabsTrigger>
      </TabsList>
      <TabsContent value="read" className="w-full">
        <BooksTable status="READ" />
      </TabsContent>
      <TabsContent value="reading" className="w-full">
        <BooksTable status="READING" />
      </TabsContent>
      <TabsContent value="wantToRead" className="w-full">
        <BooksTable status="WANT_TO_READ" />
      </TabsContent>
    </Tabs>
  );
}

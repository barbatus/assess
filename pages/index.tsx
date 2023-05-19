import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import { getServerApolloClient } from "~/graphql/client";
import { BooksTable } from "~/components/books";

import { GetUserBooks } from "~/graphql/queries.graphql";

export const getServerSideProps = async () => {
  const apolloClient = getServerApolloClient();

  await apolloClient.query({
    query: GetUserBooks,
    variables: {
      offset: 0,
      pageSize: 10,
      where: { userId: { equals: 1 }, status: { equals: "READ" } },
      order: [{ book: { title: "asc" } }],
    },
  });

  const apolloCache = apolloClient.cache.extract();

  return {
    props: {
      apolloCache,
    },
  };
};

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
        <BooksTable status="TO_READ" />
      </TabsContent>
    </Tabs>
  );
}

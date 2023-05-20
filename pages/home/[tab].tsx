import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { useTranslation } from "react-i18next";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { BooksTable } from "~/components/books";

import { getServerApolloClient } from "~/graphql/client";
import { GetUserBooks } from "~/graphql/queries.graphql";

import { getUser } from "../../middleware";

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const tab = query.tab as string | undefined;
  const apolloClient = getServerApolloClient(req.cookies["authToken"]);

  const user = await getUser(req);

  try {
    await apolloClient.query({
      query: GetUserBooks,
      variables: {
        offset: 0,
        pageSize: 10,
        where: { userId: { equals: user.id }, status: { equals: tab?.toUpperCase() } },
        order: [{ book: { title: "asc" } }],
      },
    });
  } catch (e) {
    console.log(e);
  }

  const apolloCache = apolloClient.cache.extract();

  return {
    props: {
      apolloCache,
      initialUser: user,
    },
  };
};

export default function Home() {
  const router = useRouter();
  const tab = router.query.tab as string;
  const { t } = useTranslation();

  return (
    <Tabs defaultValue={tab || "read"} className="w-full">
      <TabsList className="grid grid-cols-3 sm:w-[400px]">
        <TabsTrigger value="read" onClick={() => router.push("./read")}>
          {t('Read')}
        </TabsTrigger>
        <TabsTrigger value="reading" onClick={() => router.push("./reading")}>
          {t('Reading')}
        </TabsTrigger>
        <TabsTrigger value="to_read" onClick={() => router.push("./to_read")}>
          {t('Want To Read')}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="read" className="w-full">
        <BooksTable status="READ" />
      </TabsContent>
      <TabsContent value="reading" className="w-full">
        <BooksTable status="READING" />
      </TabsContent>
      <TabsContent value="to_read" className="w-full">
        <BooksTable status="TO_READ" />
      </TabsContent>
    </Tabs>
  );
}

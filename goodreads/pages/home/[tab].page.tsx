import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { useTranslation } from "react-i18next";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/goodreads/components/ui/tabs";
import { BooksTable } from "~/goodreads/pages/home/books";

import { getServerApolloClient } from "~/goodreads/graphql/client";
import { GetUserBooks } from "~/graphql/queries.graphql";

import { getUser } from "../../middleware.page";

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const tab = query.tab as string | undefined;
  const pageSize = Number(query.ps) || 4 ;
  const apolloClient = getServerApolloClient(req.cookies["authToken"]);

  const user = await getUser(req);

  try {
    await apolloClient.query({
      query: GetUserBooks,
      variables: {
        offset: 0,
        pageSize,
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
  const pageSize = Number(router.query.ps) || 4 ;
  const { t } = useTranslation();

  return (
    <Tabs defaultValue={tab || "read"} className="w-full">
      <TabsList className="grid grid-cols-3 sm:w-[400px]">
        <TabsTrigger data-testid="read" value="read" onClick={() => router.push("./read")}>
          {t("Read")}
        </TabsTrigger>
        <TabsTrigger data-testid="reading" value="reading" onClick={() => router.push("./reading")}>
          {t("Reading")}
        </TabsTrigger>
        <TabsTrigger data-testid="to_read" value="to_read" onClick={() => router.push("./to_read")}>
          {t("Want To Read")}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="read" className="w-full">
        <BooksTable status="READ" pageSize={pageSize} />
      </TabsContent>
      <TabsContent value="reading" className="w-full">
        <BooksTable status="READING" pageSize={pageSize} />
      </TabsContent>
      <TabsContent value="to_read" className="w-full">
        <BooksTable status="TO_READ" pageSize={pageSize} />
      </TabsContent>
    </Tabs>
  );
}

import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { BooksTable } from "./books";

// import { getUser } from "../../middleware.page";

export default function Home() {
  const route = useParams();
  const navigate = useNavigate();
  const tab = route.tab as string;
  const pageSize = 4; // Number(router.query.ps) || 4 ;
  const { t } = useTranslation();

  return (
    <Tabs defaultValue={tab || "read"} className="w-full">
      <TabsList className="grid grid-cols-3 sm:w-[400px]">
        <TabsTrigger data-testid="read" value="read" onClick={() => navigate("../read", { relative: "path" })}>
          {t("Read")}
        </TabsTrigger>
        <TabsTrigger data-testid="reading" value="reading" onClick={() => navigate("../reading", { relative: "path" })}>
          {t("Reading")}
        </TabsTrigger>
        <TabsTrigger data-testid="to_read" value="to_read" onClick={() => navigate("../to_read", { relative: "path" })}>
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

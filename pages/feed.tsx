import { useTranslation } from "react-i18next";
import { useFeed } from "~/hooks/user-books";

export default function Feed() {
  const { feed } = useFeed();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col max-w-lg h-full py-2 mx-auto">
      {feed.map((event, index) => (
        <div key={index} className="border-b py-3 text-sm">
          <span className="capitalize font-bold">{event.userName}</span> {t("finished")}{" "}
          <span className="capitalize font-bold">{event.bookTitle}</span> {t("and rated it")}{" "}
          {event.rating} {t("stars")}
        </div>
      ))}
      {feed.length === 0 && (
        <div className="text-center text-sm text-muted-foreground">No activity yet</div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";

import { useSubscription } from "@apollo/client";

import { NewFinish } from "~/graphql/queries.graphql";

import { FinishEventPayload } from "~/graphql/resolvers";

export default function Feed() {
  const { data } = useSubscription<{ newFinish: FinishEventPayload }>(NewFinish);
  const [events, setEvents] = useState<FinishEventPayload[]>([]);

  useEffect(() => {
    if (data) {
      setEvents((events) => [data.newFinish, ...events]);
    }
  }, [data]);

  return (
    <div className="flex flex-col max-w-lg h-full py-2 mx-auto">
      {events.map((event, index) => (
        <div key={index} className="border-b py-3 text-sm">
          <span className="capitalize font-bold">{event.userName}</span> finished{" "}
          <span className="capitalize font-bold">{event.bookTitle}</span> and rated it{" "}
          {event.rating} stars
        </div>
      ))}
      {events.length === 0 && <div className="text-center text-md text-muted">No activity yet</div>}
    </div>
  );
}

import EventsServer from "@/server/events";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function useEventData() {
  const { eventId } = useParams<{
    eventId: string;
  }>();

  return useQuery({
    queryKey: ["events-details", eventId || ""],
    staleTime: Infinity,
    queryFn: async () => {
      if (!eventId) return null;

      const response = await EventsServer.getEvent(eventId);
      if (!response.isSuccess) throw new Error();
      else return response.data;
    },
  });
}

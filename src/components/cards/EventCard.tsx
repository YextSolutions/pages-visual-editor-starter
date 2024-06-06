import { Image } from "@yext/pages-components";
import { LinkedEvent } from "../../types/autogen";
import { Card, CardContent, CardFooter, CardTitle } from "../ui/card";
import { CTA } from "../ui/cta";
import { formatEventTime } from "../../utils/formatEventTime";

interface EventCardProps {
  event: LinkedEvent;
}

export const EventCard = ({ event }: EventCardProps) => {
  return (
    <Card className="w-full">
      {event?.c_coverPhoto && (
        <div className="w-full pb-4">
          <div className="group relative w-full h-44">
            <Image
              image={event.c_coverPhoto}
              className="absolute h-full w-full rounded-md"
            />
          </div>
        </div>
      )}
      <CardContent className="flex flex-col gap-y-4">
        <CardTitle className="text-blue-950 text-2xl">{event?.name}</CardTitle>
        <div className="flex flex-col gap-y-8">
          {event?.time && (
            <p className="text-gray-500 text-sm">
              {formatEventTime(event.time)}
            </p>
          )}
          <p className="line-clamp-4">{event?.c_description}</p>
        </div>
      </CardContent>
      <CardFooter>
        <CTA label="Learn More" url="#" variant="outline" />
      </CardFooter>
    </Card>
  );
};

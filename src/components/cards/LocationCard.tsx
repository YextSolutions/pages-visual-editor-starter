import { HoursStatus } from "@yext/pages-components";
import { AssociatedLocation } from "../../types/autogen";
import { CardHeader, CardTitle, CardContent, Card } from "../atoms/card";

interface LocationCardProps {
  location: AssociatedLocation;
}

export const LocationCard = ({ location }: LocationCardProps) => {
  return (
    <Card className="w-full">
      <CardContent className="p-8 flex flex-col gap-y-4">
        <CardTitle className="text-blue-950 text-2xl">
          {location.name}
        </CardTitle>
        <div>
          <HoursStatus hours={location.hours} />
          <p>{location.address?.line1}</p>
        </div>
      </CardContent>
    </Card>
  );
};

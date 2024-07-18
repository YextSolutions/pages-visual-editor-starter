import { LinkedFinancialProfessional } from "../../types/autogen";
import { CardHeader, CardTitle, CardContent, Card } from "../atoms/card";
import { ChevronUp, CircleUserRound } from "lucide-react";
import { Phone, Mail } from "lucide-react";
import { Image } from "@yext/pages-components";
import { Skeleton } from "../atoms/skeleton";

interface AdvisorCardProps {
  advisor: LinkedFinancialProfessional;
}

export const AdvisorCard = ({ advisor }: AdvisorCardProps) => {
  const headshot = advisor?.photoGallery?.[0];
  return (
    <Card className="h-full gap-y-4 rounded-lg border border-zinc-200">
      <CardHeader className="flex flex-row gap-x-6 border-b border-zinc-200">
        {headshot ? (
          <div className="rounded-full w-24 h-24">
            <Image
              image={headshot}
              className="rounded-full object-cover h-full w-full"
            />
          </div>
        ) : (
          <CircleUserRound className="stroke-gray-300 h-20 w-20" />
        )}
        <div className="flex flex-col ">
          <CardTitle className="text-2xl text-blue-950 text-center">
            {advisor.name}
          </CardTitle>
          <p className="">{advisor.c_role}</p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-4 py-8">
        <div>
          <Phone className="inline-block w-4 h-4" />
          <span className="ml-2">{advisor.mainPhone}</span>
        </div>
        <div>
          <Mail className="inline-block w-4 h-4" />
          {/* TODO: Clean up */}
          <span className="ml-2">{advisor?.emails?.[0]}</span>
        </div>
        <div className="flex">
          {/* TODO: clean up */}
          <p className="text-blue-950 font-bold underline">Visit Profile</p>
          <ChevronUp className="rotate-90" />
        </div>
      </CardContent>
    </Card>
  );
};

const AdvisorCardSkeleton = () => {
  return (
    <div className="h-full gap-y-4 rounded-lg border border-zinc-200">
      <div className="flex flex-row gap-x-6 border-b border-zinc-200">
        <Skeleton className="w-24 h-24 rounded-full" />
        <div className="flex flex-col ">
          <Skeleton className="w-48 h-8 mb-2" />
          <Skeleton className="w-32 h-6" />
        </div>
      </div>
      <div className="flex flex-col gap-y-4 py-8">
        <div>
          <Skeleton className="inline-block w-4 h-4" />
          <Skeleton className="ml-2 w-24 h-6" />
        </div>
        <div>
          <Skeleton className="inline-block w-4 h-4" />
          <Skeleton className="ml-2 w-24 h-6" />
        </div>
        <div className="flex">
          <Skeleton className="w-24 h-6" />
          <Skeleton className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export { AdvisorCardSkeleton };

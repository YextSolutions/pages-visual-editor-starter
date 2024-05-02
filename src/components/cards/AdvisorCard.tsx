import { ComponentType, ReactElement } from "react";
import {
  LinkedFinancialProfessional,
  LinkedService,
} from "../../types/autogen";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChevronUp, CircleUserRound } from "lucide-react";
import { Phone, Mail } from "lucide-react";

interface AdvisorCardProps {
  advisor: LinkedFinancialProfessional;
}

export const AdvisorCard = ({ advisor }: AdvisorCardProps) => {
  return (
    <Card className="h-full gap-y-4 rounded-lg border border-zinc-200">
      <CardHeader className="flex flex-row gap-x-6 border-b border-zinc-200">
        {advisor?.c_headshot ? (
          <img
            className="w-24 h-24 rounded-full"
            src={"https://via.placeholder.com/150"}
            alt={advisor.name}
          />
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

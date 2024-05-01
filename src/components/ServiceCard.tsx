import { ComponentType, ReactElement } from "react";
import { LinkedService } from "../types/autogen";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  HeartHandshake,
  Landmark,
  Bitcoin,
  ListTodo,
  Calculator,
  Scale,
  CircleHelp,
} from "lucide-react";

const iconKeys = [
  "CHARITY",
  "INVESTMENT-MANAGEMENT",
  "CRYPTO",
  "LIST-TODO",
  "CALCULATOR",
  "SCALE",
] as const;
type IconKey = (typeof iconKeys)[number];

const icons: { [K in IconKey]: ComponentType } = {
  CHARITY: HeartHandshake,
  "INVESTMENT-MANAGEMENT": Landmark,
  CRYPTO: Bitcoin,
  "LIST-TODO": ListTodo,
  CALCULATOR: Calculator,
  SCALE: Scale,
};

function isIconKey(key: any): key is IconKey {
  return iconKeys.includes(key);
}

interface ServiceCardProps {
  service: LinkedService;
}

export const ServiceCard = ({ service }: ServiceCardProps) => {
  console.log(service);

  const Icon = isIconKey(service.c_iconName)
    ? icons[service.c_iconName]
    : CircleHelp;

  return (
    <Card className="h-full gap-y-4">
      <CardHeader>
        <Icon className="mx-auto stroke-blue-950 h-14 w-14" />
        <CardTitle className="text-2xl text-blue-950 text-center">
          {service.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center line-clamp-4">{service.c_description}</p>
      </CardContent>
      {/* <CardFooter>
        <p>Card Footer</p>
      </CardFooter> */}
    </Card>
  );
};

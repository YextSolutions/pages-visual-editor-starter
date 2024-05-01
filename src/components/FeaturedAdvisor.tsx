import { ComponentConfig } from "@measured/puck";
// import { cn } from "../../utils/cn";
import { Image } from "@yext/pages-components";
import { useDocument } from "../hooks/useDocument";
import { FinancialProfessionalStream } from "../types/autogen";
import { Button } from "./ui/button";
import { Phone, Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

export type AdvisorHeroProps = {};

export const AdvisorHero: ComponentConfig<AdvisorHeroProps> = {
  fields: {},
  defaultProps: {},
  render: ({}) => {
    const hero = useDocument<FinancialProfessionalStream>(
      (document) => document.c_hero
    );

    return (
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    );
  },
};

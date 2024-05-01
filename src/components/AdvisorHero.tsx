import { ComponentConfig } from "@measured/puck";
// import { cn } from "../../utils/cn";
import { Image } from "@yext/pages-components";
import { useDocument } from "../hooks/useDocument";
import { FinancialProfessionalStream } from "../types/autogen";
import { Button } from "./ui/button";
import { Phone, Mail } from "lucide-react";

export type AdvisorHeroProps = {};

export const AdvisorHero: ComponentConfig<AdvisorHeroProps> = {
  fields: {},
  defaultProps: {},
  render: ({}) => {
    const hero = useDocument<FinancialProfessionalStream>(
      (document) => document.c_hero
    );

    return (
      <div className="w-full bg-blue-950 bg-opacity-80 py-28 flex-col justify-center items-center gap-4 inline-flex">
        <h1 className="text-white text-center text-lg  font-bold leading-10 pb-1 border-b border-white md:text-3xl">
          Capital’s Wealth Management
        </h1>
        <p className="text-center text-white text-sm font-bold leading-[30px] md:text-2xl">
          New York City
        </p>
        <div className="text-center text-white text-sm font-normal leading-normal">
          2145 Pennsylvania Avenue West
          <br />
          New York City, NY 11202
        </div>
        <div className="justify-start items-center gap-4 inline-flex">
          <Phone className="w-5 h-5 text-white" />
          <div className="text-white text-base font-normal  leading-normal">
            (339) 291-5039
          </div>
          <div className="h-5 w-0.5 bg-white"></div>
          <div className="justify-start items-center gap-2 flex">
            <Mail className="text-white text-base font-normal leading-normal" />
            <div className="text-white text-base font-normal underline leading-normal">
              capital-nyc@capital.com
            </div>
          </div>
        </div>
        <Button variant="secondary">Button</Button>
      </div>
    );
  },
};

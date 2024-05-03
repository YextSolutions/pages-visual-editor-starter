import { ComponentConfig } from "@measured/puck";
// import { cn } from "../../utils/cn";
import { Image } from "@yext/pages-components";
import { useDocument } from "../hooks/useDocument";
import { C_hero, FinancialProfessionalStream } from "../types/autogen";
import { Button } from "./ui/button";
import { Mail, Phone } from "lucide-react";

export type AdvisorHeroProps = {};

export const AdvisorHero: ComponentConfig<AdvisorHeroProps> = {
  fields: {},
  defaultProps: {},
  render: ({}) => {
    // TODO: ask team about types
    const hero: C_hero = useDocument<FinancialProfessionalStream>(
      (document) => document.c_hero
    );

    const backgroundImageUrl = hero?.image?.image.url;

    return (
      <div className="relative bg-blue-950 opacity-90 py-28 flex flex-col justify-center items-center gap-4">
        {backgroundImageUrl && (
          <>
            <img
              className="absolute inset-0 h-full w-full object-cover"
              src={backgroundImageUrl}
              alt=""
            />
            <div className="absolute inset-0 bg-blue-950 bg-opacity-70"></div>
          </>
        )}
        <div className="z-10 flex flex-col items-center text-center gap-y-4">
          <h1 className="text-white text-lg font-bold leading-10 pb-1 border-b border-white md:text-3xl">
            {hero?.title}
          </h1>
          <p className="text-white text-sm font-bold leading-[30px] md:text-2xl">
            New York City
          </p>
          <div className="text-white text-sm font-normal leading-normal">
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
      </div>
    );
  },
};

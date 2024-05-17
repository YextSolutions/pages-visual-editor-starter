import { ComponentConfig } from "@measured/puck";
import { Address, Image } from "@yext/pages-components";
import { useDocument } from "../hooks/useDocument";
import { C_hero, FinancialProfessionalStream } from "../types/autogen";
import { Mail, Phone } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../utils/cn";

export type AdvisorHeroProps = {
  imageMode: "background" | "left" | "right";
  advisorInfoLayout: "center" | "left";
};

export const AdvisorHero: ComponentConfig<AdvisorHeroProps> = {
  fields: {
    imageMode: {
      type: "radio",
      label: "Image Mode",
      options: [
        { label: "Background", value: "background" },
        { label: "Left", value: "left" },
        { label: "Right", value: "right" },
      ],
    },
    advisorInfoLayout: {
      type: "radio",
      label: "Advisor Info Layout",
      options: [
        { label: "Center", value: "center" },
        { label: "Left", value: "left" },
      ],
    },
  },
  defaultProps: {
    imageMode: "background",
    advisorInfoLayout: "left",
  },
  render: ({ imageMode, advisorInfoLayout }) => {
    const hero: C_hero = useDocument<FinancialProfessionalStream>(
      (document) => document.c_hero
    );

    const containerClasses = cn(
      "relative bg-blue-950 opacity-90 py-28 flex h-[465px]",
      imageMode === "background"
        ? "flex-col justify-center items-center"
        : "flex-row items-center",
      imageMode === "left"
        ? "flex-row"
        : imageMode === "right"
          ? "flex-row-reverse"
          : ""
    );

    const imageClasses = cn(
      "h-[465px]",
      imageMode === "background"
        ? "absolute inset-0 h-full w-full object-cover"
        : "w-1/2 object-cover"
    );

    const contentContainerClasses = cn(
      "z-10 flex-col",
      imageMode === "background" ? "flex justify-center items-center" : "w-1/2",
      advisorInfoLayout === "center"
        ? "items-center text-center"
        : "items-start text-left pl-4"
    );

    return (
      <div className={containerClasses}>
        {hero?.image && (
          <>
            {hero.image && (
              <div className="">
                <Image className={imageClasses} image={hero.image} />
              </div>
            )}
            {imageMode === "background" && (
              <div className="absolute inset-0 bg-blue-950 bg-opacity-70" />
            )}
          </>
        )}
        <div className={contentContainerClasses}>
          <h1 className="text-white text-lg font-bold leading-10 pb-1 border-b border-white md:text-3xl">
            {hero?.title}
          </h1>
          <h3 className="text-white font-bold mt-4">{hero?.subtitle}</h3>
          {hero?.address && (
            <Address
              className="text-white font-normal leading-normal mt-4"
              lines={[["line1"], ["city", "region", "postalCode"]]}
              address={hero?.address}
            />
          )}

          <div
            className={cn(
              "flex gap-4  mt-4",
              advisorInfoLayout === "left" ? "" : "justify-center"
            )}
          >
            {hero?.phoneNumber && (
              <>
                <Phone className="w-5 h-5 text-white" />
                <div className="text-white text-base font-normal leading-normal ml-2">
                  {hero?.phoneNumber}
                </div>
              </>
            )}
            {hero?.email && (
              <>
                <Mail className="w-5 h-5 text-white" />
                {hero?.email && (
                  <div className="text-white text-base font-normal underline leading-normal">
                    {hero?.email}
                  </div>
                )}
              </>
            )}
          </div>
          <Button className="mt-4" variant="secondary">
            Button
          </Button>
        </div>
      </div>
    );
  },
};

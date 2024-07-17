import { ComponentConfig } from "@measured/puck";
import { Address, Image } from "@yext/pages-components";
import { useDocument } from "../hooks/useDocument";
import { C_hero, FinancialProfessionalStream } from "../types/autogen";
import { Mail, Phone } from "lucide-react";
import { cn } from "../utils/cn";
import { CTA, CTAProps } from "./ui/cta";

export type HeroProps = {
  imageMode: "background" | "left" | "right";
  layout: "center" | "left";
  cta: CTAProps;
};

export const Hero: ComponentConfig<HeroProps> = {
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
    layout: {
      type: "radio",
      label: "Layout",
      options: [
        { label: "Center", value: "center" },
        { label: "Left", value: "left" },
      ],
    },
    cta: {
      type: "object",
      label: "CTA",
      objectFields: {
        label: { type: "text", label: "Label" },
        url: { type: "text", label: "URL" },
        variant: {
          type: "radio",
          label: "Variant",
          options: [
            { label: "Default", value: "default" },
            { label: "Secondary", value: "secondary" },
            { label: "Outline", value: "outline" },
          ],
        },
        size: {
          type: "radio",
          label: "Size",
          options: [
            { label: "Default", value: "default" },
            { label: "Large", value: "lg" },
          ],
        },
      },
    },
  },
  defaultProps: {
    imageMode: "background",
    layout: "left",
    cta: {
      label: "Button",
      url: "#",
      variant: "default",
      size: "default",
    },
  },
  render: ({ imageMode, layout, cta }) => {
    const hero: C_hero = useDocument<FinancialProfessionalStream>(
      (document) => document.c_hero
    );

    console.log(hero);

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
      layout === "center"
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
              layout === "left" ? "" : "justify-center"
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
          <CTA className="mt-4" {...cta} />
        </div>
      </div>
    </Section>
  );
};

export const HeroComponent: ComponentConfig<HeroProps> = {
  fields: heroFields,
  defaultProps: {
    imageMode: "left",
    name: {
      size: "section",
      color: "default",
    },
    location: {
      size: "section",
      color: "default",
    },
    cta1: {
      variant: "default",
    },
    cta2: {
      variant: "default",
    },
  },
  render: ({ imageMode, name, location, cta1, cta2 }) => (
    <Hero
      imageMode={imageMode}
      name={name}
      location={location}
      cta1={cta1}
      cta2={cta2}
    />
  ),
};

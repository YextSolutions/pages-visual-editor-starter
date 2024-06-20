import { ComponentConfig } from "@measured/puck";
import { C_hero, LocationStream } from "../types/autogen";
import { useDocument } from "../hooks/useDocument";
import { Section } from "./ui/section";
import { HoursStatus, Image } from "@yext/pages-components";
import { Heading, HeadingProps } from "./ui/heading";
import { CTA } from "./ui/cta";
import { ButtonProps } from "./ui/button";
import { cn } from "../utils/cn";
import useDeviceSizes from "../hooks/useDeviceSizes";

export type HeroProps = {
  imageMode: "left" | "right";
  name: {
    size: HeadingProps["size"];
    color: HeadingProps["color"];
  };
  location: {
    size: HeadingProps["size"];
    color: HeadingProps["color"];
  };
  cta1: {
    variant: ButtonProps["variant"];
  };
  cta2: {
    variant: ButtonProps["variant"];
  };
};

export const Hero: ComponentConfig<HeroProps> = {
  fields: {
    imageMode: {
      label: "Image Mode",
      type: "radio",
      options: [
        { label: "Left", value: "left" },
        { label: "Right", value: "right" },
      ],
    },
    name: {
      type: "object",
      label: "Location Name",
      objectFields: {
        size: {
          label: "Size",
          type: "radio",
          options: [
            { label: "Page", value: "page" },
            { label: "Section", value: "section" },
            { label: "Subheading", value: "subheading" },
          ],
        },
        color: {
          label: "Color",
          type: "radio",
          options: [
            { label: "Default", value: "default" },
            { label: "Primary", value: "primary" },
            { label: "Accent", value: "accent" },
          ],
        },
      },
    },
    location: {
      type: "object",
      label: "Location",
      objectFields: {
        size: {
          label: "Size",
          type: "radio",
          options: [
            { label: "Page", value: "page" },
            { label: "Section", value: "section" },
            { label: "Subheading", value: "subheading" },
          ],
        },
        color: {
          label: "Color",
          type: "radio",
          options: [
            { label: "Default", value: "default" },
            { label: "Primary", value: "primary" },
            { label: "Accent", value: "accent" },
          ],
        },
      },
    },
    cta1: {
      type: "object",
      label: "CTA 1",
      objectFields: {
        variant: {
          label: "Variant",
          type: "radio",
          options: [
            { label: "Default", value: "default" },
            { label: "Outline", value: "outline" },
            { label: "Link", value: "link" },
          ],
        },
      },
    },
    cta2: {
      type: "object",
      label: "CTA 2",
      objectFields: {
        variant: {
          label: "Variant",
          type: "radio",
          options: [
            { label: "Default", value: "default" },
            { label: "Outline", value: "outline" },
            { label: "Link", value: "link" },
          ],
        },
      },
    },
  },
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
  render: ({ imageMode, name, location, cta1, cta2 }) => {
    const hero: C_hero = useDocument<LocationStream>(
      (document) => document.c_hero
    );
    const address = useDocument<LocationStream>((document) => document.address);
    const locationName = useDocument<LocationStream>(
      (document) => document.name
    );
    const hours = useDocument<LocationStream>((document) => document.hours);

    const { isMediumDevice } = useDeviceSizes();

    console.log("name", name);

    return (
      <Section>
        <div
          className={cn(
            "flex flex-col gap-x-10 md:flex-row",
            imageMode === "right" && "md:flex-row-reverse"
          )}
        >
          {hero?.image ? (
            <Image
              className="rounded-[30px]"
              image={hero.image}
              layout="fixed"
              width={isMediumDevice ? 723 : 343}
              height={isMediumDevice ? 482 : 232}
            />
          ) : (
            <></>
          )}
          <div className="flex flex-col justify-center gap-y-3 pt-8">
            <Heading level={2} size={name.size} color={name.color}>
              {locationName}
            </Heading>
            <Heading level={1} size={location.size} color={location.color}>
              {address.city}
            </Heading>
            {hours && <HoursStatus className="font-semibold" hours={hours} />}
            <div className="flex">
              {hero?.cta1 && (
                <CTA
                  className="mr-3"
                  variant={cta1.variant}
                  label={hero.cta1.name}
                  url={hero.cta1.link ? hero.cta1.link : "#"}
                />
              )}
              {hero?.cta2 && (
                <CTA
                  variant={cta2.variant}
                  label={hero.cta2.name}
                  url={hero.cta2.link ? hero.cta2.link : "#"}
                />
              )}
            </div>
          </div>
        </div>
      </Section>
    );
  },
};

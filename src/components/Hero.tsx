import { ComponentConfig, Fields } from "@measured/puck";
import { LocationStream } from "../types/autogen";
import { useDocument } from "@yext/pages/util";
import { Section } from "./atoms/section";
import { HoursStatus, Image } from "@yext/pages-components";
import { Heading, HeadingProps } from "./atoms/heading";
import { CTA } from "./atoms/cta";
import { ButtonProps } from "./atoms/button";
import { cn } from "../utils/cn";
import { EntityField } from "@yext/visual-editor";
import "./index.css";

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

const heroFields: Fields<HeroProps> = {
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
          { label: "Secondary", value: "secondary" },
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
          { label: "Secondary", value: "secondary" },
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
          { label: "Secondary", value: "secondary" },
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
          { label: "Secondary", value: "secondary" },
          { label: "Link", value: "link" },
        ],
      },
    },
  },
};

const Hero = ({ imageMode, name, location, cta1, cta2 }: HeroProps) => {
  const {
    hours,
    address,
    name: locationName,
    c_hero: hero,
  } = useDocument<LocationStream>();

  return (
    <Section className="components">
      <div
        className={cn(
          "flex flex-col gap-x-10 md:flex-row",
          imageMode === "right" && "md:flex-row-reverse",
        )}
      >
        {hero?.image && (
          <EntityField displayName="Hero Image" fieldId="c_hero.image">
            <Image
              className="rounded-[30px] max-w-3xl max-h-96"
              image={hero.image}
            />
          </EntityField>
        )}
        <div className="flex flex-col justify-center gap-y-3 pt-8">
          <EntityField displayName="Location Name" fieldId="name">
            <Heading level={2} size={name.size} color={name.color}>
              {locationName}
            </Heading>
          </EntityField>
          <EntityField displayName="City" fieldId="address">
            <Heading level={1} size={location.size} color={location.color}>
              {address?.city}
            </Heading>
          </EntityField>
          {hours && (
            <EntityField displayName="Hours" fieldId="hours">
              <HoursStatus className="font-semibold" hours={hours} />
            </EntityField>
          )}
          <div className="flex">
            {hero?.cta1 && (
              <EntityField displayName="CTA" fieldId="hero.cta1">
                <CTA
                  className="mr-3"
                  variant={cta1.variant}
                  label={hero.cta1.name}
                  url={hero.cta1.link ? hero.cta1.link : "#"}
                />
              </EntityField>
            )}
            {hero?.cta2 && (
              <EntityField displayName="CTA" fieldId="hero.cta2">
                <CTA
                  variant={cta2.variant}
                  label={hero.cta2.name}
                  url={hero.cta2.link ? hero.cta2.link : "#"}
                />
              </EntityField>
            )}
          </div>
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

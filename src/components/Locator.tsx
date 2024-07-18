import { ComponentConfig } from "@measured/puck";
import { Section } from "./Section";
import { Mail, Phone } from "lucide-react";
import useScreenSizes from "../hooks/useScreenSizes";
import { backgroundColors } from "../puck/theme";
import { cn } from "../utils/cn";
import { C_locator, FinancialProfessionalStream } from "../types/autogen";
import { useDocument } from "../hooks/useDocument";
import useEnvironment from "../hooks/useEnvironment";
import { CTAProps, CTA } from "./atoms/cta";
import { SectionTitleProps, SectionTitle } from "./atoms/sectionTitle";
import { Skeleton } from "./atoms/skeleton";

export type LocatorProps = {
  sectionTitle?: SectionTitleProps;
  backgroundColor: string;
  cta?: CTAProps;
};

export const Locator: ComponentConfig<LocatorProps> = {
  fields: {
    sectionTitle: {
      type: "object",
      label: "Section Title",
      objectFields: {
        title: { type: "text", label: "Title" },
        align: {
          type: "radio",
          label: "Align",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
        size: {
          type: "radio",
          label: "Size",
          options: [
            { label: "Small", value: "sm" },
            { label: "Medium", value: "md" },
            { label: "Large", value: "lg" },
          ],
        },
      },
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
    backgroundColor: {
      label: "Background Color",
      type: "select",
      options: backgroundColors,
    },
  },
  defaultProps: {
    sectionTitle: {
      title: "Section",
      align: "center",
      size: "md",
    },
    backgroundColor: "bg-white",
    cta: {
      label: "Button",
      url: "#",
      variant: "default",
      size: "default",
    },
  },
  render: ({ sectionTitle, backgroundColor, cta }) => {
    const locator: C_locator = useDocument<FinancialProfessionalStream>(
      (document) => document.c_locator
    );
    const isMediumDevice = useScreenSizes();
    const isEditor = useEnvironment();

    if (!locator) {
      if (isEditor) {
        return (
          <LocatorSkeleton
            backgroundColor={backgroundColor}
            sectionTitle={sectionTitle}
          />
        );
      } else {
        return <></>;
      }
    }

    const mapDimensions = isMediumDevice ? "556x252" : "342x242";
    const coordinates = `${locator.coordinates?.longitude},${locator.coordinates?.latitude}`;

    // TODO: add placeholder for null content value
    return (
      <Section className={cn("gap-y-4 md:gap-y-8", backgroundColor)}>
        <SectionTitle {...sectionTitle} />
        <div className="grid grid-cols-1 md:grid-cols-2 mt-8 gap-x-[30px]">
          <div>
            <p>{locator.description}</p>
            <div className="my-8 flex flex-1 justify-between w-full">
              <div className="items-center gap-2 inline-flex">
                <Phone className="w-5 h-5 text-zinc-800" />
                <div className="text-zinc-800 text-base font-normal  leading-normal">
                  {locator.phoneNumber}
                </div>
              </div>
              <div className="items-center gap-2 flex">
                <Mail className="text-zinc-800 text-base font-normal leading-normal" />
                <div className="text-zinc-800 text-base font-normal underline leading-normal">
                  {locator.email}
                </div>
              </div>
            </div>
            <CTA {...cta} />
          </div>

          <img
            className="mx-auto"
            src={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-l+ff0000(${coordinates})/${coordinates},10.45,0/${mapDimensions}?access_token=${YEXT_PUBLIC_MAPBOX_TOKEN}`}
          />
        </div>
      </Section>
    );
  },
};

interface LocatorSkeletonProps {
  backgroundColor: string;
  sectionTitle?: SectionTitleProps;
}

const LocatorSkeleton = ({
  backgroundColor,
  sectionTitle,
}: LocatorSkeletonProps) => {
  return (
    <Section className={`gap-y-4 md:gap-y-8 w-full ${backgroundColor}`}>
      <SectionTitle {...sectionTitle} />
      <div className="grid grid-cols-1 md:grid-cols-2 mt-8 gap-x-[30px]">
        <div>
          <Skeleton className="h-6 my-2" />
          <div className="my-8 flex flex-1 justify-between w-full">
            <div className="items-center gap-2 inline-flex">
              <Skeleton className="w-5 h-5" />
              <Skeleton className="w-24 h-6" />
            </div>
            <div className="items-center gap-2 flex">
              <Skeleton className="w-5 h-5" />
              <Skeleton className="w-24 h-6" />
            </div>
          </div>
          <Skeleton className="w-full h-10" />
        </div>
        <Skeleton className="h-[200px] mx-auto w-full" />
      </div>
    </Section>
  );
};

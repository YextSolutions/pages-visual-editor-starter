import { ComponentConfig } from "@measured/puck";
// import { cn } from "../../utils/cn";

import { Section } from "./Section";
import { Mail, Phone } from "lucide-react";
import useScreenSizes from "../hooks/useScreenSizes";
import { Button } from "./ui/button";
import { backgroundColors } from "../puck/theme";
import { cn } from "../utils/cn";

export type LocatorProps = {
  sectionTitle: string;
  backgroundColor: string;
};

export const Locator: ComponentConfig<LocatorProps> = {
  fields: {
    sectionTitle: {
      label: "Section Title",
      type: "text",
    },
    backgroundColor: {
      label: "Background Color",
      type: "select",
      options: backgroundColors,
    },
  },
  defaultProps: {
    sectionTitle: "Section",
    backgroundColor: "bg-white",
  },
  render: ({ sectionTitle, backgroundColor }) => {
    // const insights: FeaturedBlogsType =
    //   useDocument<FinancialProfessionalStream>(
    //     (document) => document.c_insights
    //   );
    const isMediumDevice = useScreenSizes();

    const mapDimensions = isMediumDevice ? "556x252" : "342x242";

    // TODO: add placeholder for null content value
    return (
      <Section className={cn("gap-y-4 md:gap-y-8", backgroundColor)}>
        <h2 className="text-center text-blue-950 text-[34px] font-bold mb-8">
          {sectionTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 mt-8 gap-x-[30px]">
          <div>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
              finibus placerat justo a viverra. Quisque ut congue tellus, vitae
              fermentum velit. Suspendisse sed gravida libero. Etiam pulvinar
              tincidunt augue vitae fermentum. Maecenas tortor nunc, ullamcorper
              eu tortor sed, vestibulum suscipit libero.
            </p>
            <div className="my-8 flex flex-1 justify-between w-full">
              <div className="items-center gap-2 inline-flex">
                <Phone className="w-5 h-5 text-zinc-800" />
                <div className="text-zinc-800 text-base font-normal  leading-normal">
                  (339) 291-5039
                </div>
              </div>
              <div className="items-center gap-2 flex">
                <Mail className="text-zinc-800 text-base font-normal leading-normal" />
                <div className="text-zinc-800 text-base font-normal underline leading-normal">
                  capital-nyc@capital.com
                </div>
              </div>
            </div>
            <div>
              <Button variant="outline">Button</Button>
            </div>
          </div>

          <img
            className="mx-auto"
            src={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/-73.9884,40.7279,10.45,0/${mapDimensions}?access_token=${YEXT_PUBLIC_MAPBOX_TOKEN}`}
          />
        </div>
      </Section>
    );
  },
};

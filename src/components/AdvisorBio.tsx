import { ComponentConfig } from "@measured/puck";
import { Image } from "@yext/pages-components";
import { useDocument } from "../hooks/useDocument";
import { C_advisorBio, FinancialProfessionalStream } from "../types/autogen";
import { Section } from "./Section";
import { backgroundColors } from "../puck/theme";

export type AdvisorBioProps = {
  backgroundColor: string;
};

export const AdvisorBio: ComponentConfig<AdvisorBioProps> = {
  fields: {
    backgroundColor: {
      label: "Background Color",
      type: "select",
      options: backgroundColors,
    },
  },
  defaultProps: {
    backgroundColor: "bg-white",
  },
  render: ({ backgroundColor }) => {
    // TODO: ask team about types
    const bio: C_advisorBio = useDocument<FinancialProfessionalStream>(
      (document) => document.c_advisorBio
    );

    return (
      <Section className={backgroundColor}>
        <div className="flex flex-col gap-x-8 md:flex-row">
          {bio?.headshot && (
            <div className="aspect-[4/3] md:w-60  w-96 flex-none  md:rounded-lg object-cover">
              <Image
                className="object-cover"
                // aspectRatio={4 / 3}
                image={bio.headshot}
              ></Image>
            </div>
          )}

          <div className="flex flex-col gap-y-6">
            {bio?.name && (
              <h3 className="font-bold text-blue-950 text-2xl">{bio.name}</h3>
            )}
            {bio?.role && (
              <p className="text-blue-950 font-bold text-base">{bio.role}</p>
            )}
            {bio?.email && <p className="text-[#333333]">{bio.email}</p>}
            {bio?.bio && <p className="text-black">{bio.bio}</p>}
          </div>
        </div>
      </Section>
    );
  },
};

import { ComponentConfig } from "@measured/puck";
import { Image } from "@yext/pages-components";
import { useDocument } from "../hooks/useDocument";
import { C_advisorBio, FinancialProfessionalStream } from "../types/autogen";
import { Section } from "./Section";
import { backgroundColors } from "../puck/theme";
import { Skeleton } from "./ui/skeleton";
import useEnvironment from "../hooks/useEnvironment";

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

    const isEditor = useEnvironment();

    if (!bio) {
      if (isEditor) {
        return <AdvisorBioSkeleton backgroundColor={backgroundColor} />;
      } else {
        return <></>;
      }
    }

    return (
      <Section className={backgroundColor}>
        <div className="flex flex-col gap-x-8 md:flex-row">
          {bio?.headshot && (
            <div className="aspect-[4/3] md:w-60  w-96 flex-none  md:rounded-lg object-cover">
              <Image className="object-cover" image={bio.headshot}></Image>
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
            {bio?.bio && (
              <p className="text-black font-extralight">{bio.bio}</p>
            )}
          </div>
        </div>
      </Section>
    );
  },
};

interface AdvisorBioSkeletonProps {
  backgroundColor: string;
}

const AdvisorBioSkeleton = ({ backgroundColor }: AdvisorBioSkeletonProps) => {
  return (
    <Section className={backgroundColor}>
      <div className="flex flex-col gap-x-8 md:flex-row">
        <Skeleton className="aspect-[4/3] md:w-60 w-96 flex-none rounded-lg" />{" "}
        {/* Placeholder for the headshot */}
        <div className="flex flex-col gap-y-6">
          <Skeleton className="h-8 w-48" /> {/* Placeholder for the name */}
          <Skeleton className="h-6 w-40" /> {/* Placeholder for the role */}
          <Skeleton className="h-6 w-56" /> {/* Placeholder for the email */}
          <Skeleton className="h-24 w-full" />{" "}
          {/* Placeholder for the bio text */}
        </div>
      </div>
    </Section>
  );
};

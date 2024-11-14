import { Link } from "@yext/pages-components";

export interface CTAProps {
  label?: string;
  link?: string;
  linkType?: string;
}

interface _CTAProps {
  cta: CTAProps;
  ctaType: "primaryCta" | "secondaryCta";
  additionalClasses?: string;
}

const Cta = ({ cta, ctaType, additionalClasses }: _CTAProps) => {
  return (
    <Link
      className={`${additionalClasses && additionalClasses} border-2 text-sm md:text-base p-2 flex justify-center md:w-[220px] rounded-md ${ctaType}`}
      cta={{
        url: cta.link,
        label: cta.label,
      }}
    />
  );
};

export default Cta;

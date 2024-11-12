import { CTA, Link } from "@yext/pages-components";

interface CTAProps {
  cta: CTA;
  ctaType: "primaryCta" | "secondaryCta";
  additionalClasses?: string;
}

const Cta = ({ cta, ctaType, additionalClasses }: CTAProps) => {
  return (
    <Link
      className={`${additionalClasses && additionalClasses} border-2 text-sm md:text-base p-2 flex justify-center md:w-[220px] rounded-md ${ctaType}`}
      cta={{
        link: cta.link,
        label: cta.label,
        linkType: cta.linkType,
      }}
    />
  );
};

export default Cta;

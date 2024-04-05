import { ComponentConfig } from "@measured/puck";
import { Link } from "@yext/pages-components";                         // New
import { twMerge } from "tailwind-merge";

export interface CtaProps {
  buttonText: string;
  url?: string;
  style?: string;
}

export const Cta = ({ buttonText, url, style }: CtaProps) => {
  return (
    <>
      <Link
        href={url}
        className={twMerge(
          "py-4 px-6 text-base font-bold rounded-lg hover:scale-[1.02] duration-250",
          style
        )}
        target=""
        rel="noopener noreferrer"
        cta={{link: url, label: buttonText, linkType: "URL"}}
      >
        {buttonText}
      </Link>
    </>
  );
};

export const PuckCta: ComponentConfig<CtaProps> = {
  fields: {
    buttonText: { type: "text" },
    url: { type: "text" },
    style: { type: "text" }
  },
  render: ({ buttonText, url, style}) => (
    <Cta buttonText={buttonText} url={url} style={style}/>
  )
};

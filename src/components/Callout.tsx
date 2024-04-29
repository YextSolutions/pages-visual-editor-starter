import { ComponentConfig } from "@measured/puck";
// import { cn } from "../../utils/cn";
import { Image } from "@yext/pages-components";
import { useDocument } from "../hooks/useDocument";
import { FinancialProfessionalStream } from "../types/autogen";
import useScreenSizes from "../hooks/useScreenSizes";

export type CalloutProps = {};

export const Callout: ComponentConfig<CalloutProps> = {
  fields: {},
  defaultProps: {},
  render: ({}) => {
    return (
      <div className="w-[1199px] h-32 relative">
        <div className="w-[352px] h-32 left-0 top-0 absolute flex-col justify-start items-start gap-[30px] inline-flex">
          <div className="w-[352px] text-neutral-800 text-[28px] font-bold font-['RBC Display'] leading-loose">
            You have dreams. We have the expertise to help you make them a
            reality.{" "}
          </div>
          <div className="w-[174px] h-0.5 relative">
            <div className="w-[174px] h-0.5 left-0 top-0 absolute bg-sky-900"></div>
          </div>
        </div>
        <div className="w-[790px] left-[409px] top-0 absolute text-neutral-800 text-xl font-normal font-['RBC Display'] leading-[30px]">
          Our team of experts is poised to help you take advantage of
          opportunities, handle challenges, and – ultimately – reach your goals.
          Taking an all-encompassing, personalized approach, we lean on the
          sophisticated tools, best-in-class resources, and esteemed specialists
          of RBC to manage, grow, and preserve your wealth.
        </div>
      </div>
    );
  },
};

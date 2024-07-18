import { ComponentConfig } from "@measured/puck";
import { Section } from "./Section";

export type CalloutProps = {};

export const Callout: ComponentConfig<CalloutProps> = {
  fields: {},
  defaultProps: {},
  render: ({}) => {
    return (
      <Section className="flex">
        <div className="flex-col justify-start items-start gap-[30px] inline-flex">
          <div className=" text-neutral-800 text-[28px] font-bold font-['RBC Display']">
            You have dreams. We have the expertise to help you make them a
            reality.{" "}
          </div>
          <div className="w-[174px] h-0.5 relative">
            <div className="w-[174px] h-0.5 left-0 top-0 absolute bg-sky-900"></div>
          </div>
        </div>
        <div className=" text-neutral-800 text-xl font-normal font-['RBC Display']">
          Our team of experts is poised to help you take advantage of
          opportunities, handle challenges, and – ultimately – reach your goals.
          Taking an all-encompassing, personalized approach, we lean on the
          sophisticated tools, best-in-class resources, and esteemed specialists
          of RBC to manage, grow, and preserve your wealth.
        </div>
      </Section>
    );
  },
};

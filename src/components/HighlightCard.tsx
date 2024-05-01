import { Highlights } from "../types/autogen";

export const HighlightCard = ({ title, image, description }: Highlights) => {
  return (
    <div className="w-[380px] h-[490px] relative">
      <img
        className="w-[380px] h-[250px] left-0 top-0 absolute"
        src="https://via.placeholder.com/380x250"
      />
      <div className="w-[379px] h-60 px-[30px] pt-[50px] left-[1px] top-[250px] absolute flex-col justify-start items-start gap-[30px] inline-flex">
        <div className="w-[317px] text-neutral-800 text-[28px] font-bold font-['RBC Display'] leading-[34px]">
          Our team
        </div>
        <div className="w-80 text-neutral-800 text-base font-light font-['Roboto'] leading-normal tracking-tight">
          We pride ourselves on attentive client service, backed by industry
          experience and credentials.
        </div>
        <div className="w-80 text-sky-700 text-base font-bold font-['Roboto'] underline leading-normal tracking-tight">
          Learn more
        </div>
      </div>
    </div>
  );
};

import { Landmark } from "lucide-react";

const SiteLogo = () => {
  return (
    <div className="flex items-center gap-x-1">
      <Landmark className="stroke-blue-950" />
      <div className="text-[30px] text-blue-950">Capital</div>
      <div className="h-full w-px mx-1 bg-orange-500" />
      <div className="flex flex-col justify-center">
        <span className="text-[15px] text-blue-950 ">Wealth</span>
        <span className="text-[15px] text-blue-950 ">Management</span>
      </div>
    </div>
  );
};

export default SiteLogo;

import { ComponentConfig } from "@measured/puck";
import { LocationStream } from "../types/autogen";
import { useDocument } from "../hooks/useDocument";

export type HeroProps = {
  imageMode: "inline" | "inline-fancy" | "background";
};

export const Hero: ComponentConfig<HeroProps> = {
  fields: {
    imageMode: {
      label: "Image Mode",
      type: "radio",
      options: [
        { label: "Inline", value: "inline" },
        { label: "Inline Fancy", value: "inline-fancy" },
        { label: "Background", value: "background" },
      ],
    },
  },
  render: ({ imageMode }) => {
    const hero = useDocument<LocationStream>(document => document.c_hero);
    const backgroundImageUrl = hero?.image.image.url;
    return (
      <div
        className={`relative ${imageMode === "background" ? "bg-gray-900" : ""}`}
      >
        {hero?.image && imageMode === "background" && (
          <>
            <img
              className="absolute inset-0 h-full w-full object-cover"
              src={backgroundImageUrl}
              alt=""
            />
            <div className="absolute inset-0 bg-gray-800 bg-opacity-70"></div>
          </>
        )}

        <div className="mx-auto max-w-7xl">
          <div
            className={`relative z-10 pt-14 lg:w-full lg:max-w-2xl ${imageMode === "background" ? "text-white" : ""}`}
          >
            {imageMode === "inline-fancy" && (
              <svg
                className="absolute inset-y-0 right-8 hidden h-full w-80 translate-x-1/2 transform fill-white lg:block"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <polygon points="0,0 90,0 50,100 0,100" />
              </svg>
            )}

            <div className="relative px-6 py-32 sm:py-40 lg:px-8 lg:py-56 lg:pr-0">
              <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
                <img
                  className="h-11"
                  src="https://a.mktgcdn.com/p/7VJD1Cq6Hm_CVQM8ejzL5PKXZPechztCKS4gOKucv1Q/800x800.png?timestamp=1712936686883"
                  alt="Your Company"
                />
                <h1 className="text-4xl font-bold tracking-tight sm:mt-32 lg:mt-16 sm:text-6xl">
                  {hero?.title ?? "Location Page"}
                </h1>
                <p className="mt-6 text-lg leading-8">
                  Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure
                  qui lorem cupidatat commodo. Elit sunt amet fugiat veniam
                  occaecat fugiat aliqua.
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <a
                    href="#"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {hero?.image && imageMode !== "background" && (
          <div className="bg-gray-50 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <img
              className="aspect-[3/2] object-cover lg:aspect-auto lg:h-full lg:w-full"
              src={backgroundImageUrl}
              alt=""
            />
          </div>
        )}
      </div>
    );
  },
};

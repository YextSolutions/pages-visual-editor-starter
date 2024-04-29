import { useState, useEffect } from "react";

const useScreenSizes = () => {
  const [sizes, setSizes] = useState({
    isSmallDevice: false, // Tailwind sm: min-width: 640px
    isMediumDevice: false, // Tailwind md: min-width: 768px
    isLargeDevice: false, // Tailwind lg: min-width: 1024px
    isExtraLargeDevice: false, // Tailwind xl: min-width: 1280px
    is2XLargeDevice: false, // Tailwind 2xl: min-width: 1536px
  });

  useEffect(() => {
    const mediaQueries = {
      isSmallDevice: window.matchMedia("(min-width: 640px)"),
      isMediumDevice: window.matchMedia("(min-width: 768px)"),
      isLargeDevice: window.matchMedia("(min-width: 1024px)"),
      isExtraLargeDevice: window.matchMedia("(min-width: 1280px)"),
      is2XLargeDevice: window.matchMedia("(min-width: 1536px)"),
    };

    const handler = () =>
      setSizes({
        isSmallDevice: mediaQueries.isSmallDevice.matches,
        isMediumDevice: mediaQueries.isMediumDevice.matches,
        isLargeDevice: mediaQueries.isLargeDevice.matches,
        isExtraLargeDevice: mediaQueries.isExtraLargeDevice.matches,
        is2XLargeDevice: mediaQueries.is2XLargeDevice.matches,
      });

    Object.values(mediaQueries).forEach((mq) =>
      mq.addEventListener("change", handler)
    );

    // Set initial state
    handler();

    return () => {
      Object.values(mediaQueries).forEach((mq) =>
        mq.removeEventListener("change", handler)
      );
    };
  }, []);

  return sizes;
};

export default useScreenSizes;

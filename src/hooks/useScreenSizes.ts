import { useMediaQuery } from "@mantine/hooks";

const useScreenSizes = () => {
  const isSmallDevice = useMediaQuery("(min-width: 640px)");
  const isMediumDevice = useMediaQuery("(min-width: 768px)");
  const isLargeDevice = useMediaQuery("(min-width: 1024px)");
  const isExtraLargeDevice = useMediaQuery("(min-width: 1280px)");
  const is2XLargeDevice = useMediaQuery("(min-width: 1536px)");

  // Additional breakpoints for '3xl' and '4xl'
  const is3XLargeDevice = useMediaQuery("(min-width: 1600px)");
  const is4XLargeDevice = useMediaQuery("(min-width: 1800px)");

  return {
    isSmallDevice,
    isMediumDevice,
    isLargeDevice,
    isExtraLargeDevice,
    is2XLargeDevice,
    is3XLargeDevice,
    is4XLargeDevice,
  };
};

export default useScreenSizes;

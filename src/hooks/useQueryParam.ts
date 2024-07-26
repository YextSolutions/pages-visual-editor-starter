import { useState, useEffect } from "react";

const useQueryParameter = (param: string) => {
  const [value, setValue] = useState<string | null>();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const paramValue = searchParams.get(param);
    setValue(paramValue);
  }, [param]);

  return value;
};

export default useQueryParameter;

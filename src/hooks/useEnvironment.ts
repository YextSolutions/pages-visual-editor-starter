import { useEffect, useState } from "react";

const useEnvironment = () => {
  const [pathContainsEdit, setPathContainsEdit] = useState(false);

  useEffect(() => {
    // Set the state based on the current pathname
    setPathContainsEdit(window.location.pathname.includes("/edit"));
  }, []); // Runs only once on mount

  return pathContainsEdit;
};

export default useEnvironment;

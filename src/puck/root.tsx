import { ReactNode } from "react";

import { DefaultRootProps, RootDataWithoutProps } from "@measured/puck";
import Header from "../components/Header";
import Footer from "../components/Footer";

export type RootProps = {
  children?: ReactNode;
} & RootDataWithoutProps;

function Root({ children }: RootProps) {
  return (
    <>
      {/* <Header /> */}
      {children}
      <Footer />
    </>
  );
}

export default Root;

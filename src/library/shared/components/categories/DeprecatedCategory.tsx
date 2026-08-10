// @ts-nocheck
import { Header, HeaderProps } from "../header/Header";
import { Footer, FooterProps } from "../footer/Footer";

export interface DeprecatedCategoryProps {
  Header: HeaderProps;
  Footer: FooterProps;
}

export const DeprecatedCategoryComponents = {
  Header,
  Footer,
};

export const DeprecatedCategory = Object.keys(
  DeprecatedCategoryComponents
) as (keyof DeprecatedCategoryProps)[];

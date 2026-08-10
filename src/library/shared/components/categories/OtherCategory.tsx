// @ts-nocheck
import {
  CustomCodeSectionProps,
  CustomCodeSection,
} from "../customCode/CustomCodeSection";
import {
  ExpandedFooterProps,
  ExpandedFooter,
} from "../footer/ExpandedFooter";
import {
  ExpandedHeaderProps,
  ExpandedHeader,
} from "../header/ExpandedHeader";

export interface OtherCategoryProps {
  ExpandedHeader: ExpandedHeaderProps;
  ExpandedFooter: ExpandedFooterProps;
  CustomCodeSection: CustomCodeSectionProps;
}

export const OtherCategoryComponents = {
  ExpandedHeader,
  ExpandedFooter,
  CustomCodeSection,
};

export const OtherCategory = Object.keys(
  OtherCategoryComponents
) as (keyof OtherCategoryProps)[];

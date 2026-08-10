// @ts-nocheck
import { LocatorProps, LocatorComponent } from "../locator/Locator";

export interface LocatorCategoryProps {
  Locator: LocatorProps;
}

export const LocatorCategoryComponents = {
  Locator: LocatorComponent,
};

export const LocatorCategory = Object.keys(
  LocatorCategoryComponents
) as (keyof LocatorCategoryProps)[];

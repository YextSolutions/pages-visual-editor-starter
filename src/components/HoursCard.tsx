import {ComponentConfig, Fields} from "@measured/puck";
import {useDocument} from "../hooks/useDocument";
import {LocationStream} from "../types/autogen";
import { HoursTable } from "@yext/pages-components";

export type HoursCardProps = {};
const hoursCardFields: Fields<HoursCardProps> = {};

const HoursCard = ({}: HoursCardProps) => {
  const hours = useDocument<LocationStream>(document => document.hours);

  return (
      <HoursTable hours={hours}/>
  );
};

export const HoursCardComponent: ComponentConfig<HoursCardProps> = {
  fields: hoursCardFields,
  defaultProps: {},
  render: ({}) => (
    <HoursCard/>
  ),
};
import {ComponentConfig, Fields} from "@measured/puck";
import {useDocument} from "../hooks/useDocument";
import {LocationStream} from "../types/autogen";
import { HoursTable } from "@yext/pages-components";
import {Section} from "./atoms/section";
import {Heading} from "./atoms/heading";

export type HoursCardProps = {};
const hoursCardFields: Fields<HoursCardProps> = {};

const HoursCard = ({}: HoursCardProps) => {
  const hours = useDocument<LocationStream>(document => document.hours);

  const css = `
      .HoursTable-row {
        display: inline-flex;
        justify-content: space-between;
        gap: 30px;
      }
  `

  return (
      <Section
        className='flex flex-col justify-center components'
        padding='small'
      >
        <style>{css}</style>
        <div>
          <Heading>Hours</Heading>
          <div className='flex flex-col justify-center gap-y-3'>
            <HoursTable hours={hours}/>
          </div>
        </div>
      </Section>
  );
};

export const HoursCardComponent: ComponentConfig<HoursCardProps> = {
  fields: hoursCardFields,
  defaultProps: {},
  render: ({}) => (
    <HoursCard/>
  ),
};
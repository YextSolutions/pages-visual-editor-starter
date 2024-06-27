import {ComponentConfig, Fields} from "@measured/puck";
import {useDocument} from "../hooks/useDocument";
import {LocationStream, Hours} from "../types/autogen";
import {HoursTable, HoursType} from "@yext/pages-components";
import {Section} from "./atoms/section";
import {Heading} from "./atoms/heading";
import "@yext/pages-components/style.css";

export type HoursCardProps = {};
const hoursCardFields: Fields<HoursCardProps> = {};

const HoursCard = ({}: HoursCardProps) => {
  const hours:Hours = useDocument<LocationStream>(document => document.hours);
  const additionalHoursText:string = useDocument<LocationStream>(document => document.additionalHoursText);

  const css = `
      .is-today {
        font-weight: 700;
      }
  `

  return (
      <Section
        className='flex flex-col justify-center components items-center'
        padding='small'
      >
        <style>{css}</style>
        <div>
          <Heading level={2} size={'subheading'} className={'mb-4'}>Hours</Heading>
          <HoursTable hours={hours as HoursType} startOfWeek={'monday'}/>
          {additionalHoursText && (
              <div className="mt-4">{additionalHoursText}</div>
          )}
        </div>
      </Section>
  );
};

export const HoursCardComponent: ComponentConfig<HoursCardProps> = {
  fields: hoursCardFields,
  defaultProps: {},
  label: 'Hours Card',
  render: ({}) => (
    <HoursCard/>
  ),
};
import { Link, Image, HoursStatus } from "@yext/pages-components";
import { useDocument } from "../hooks/useDocument";
import { C_locationHero, LocationStream, Cta, Address, ComplexImage, Hours } from '../types/autogen';
import { ComponentConfig } from "@measured/puck";

const Hero = () => {
  const hero: C_locationHero = useDocument<LocationStream>((document) => document.c_locationHero);  

  return (
    <HeroLayout
      name={hero?.name ?? ""}
      cta1={hero?.cta1}
      cta2={hero?.cta2}
      address={hero?.address ?? {}}
      background={hero?.image}
      hours={hero?.hours}
      numReviews={hero?.numberOfReviews}
      rating={hero?.rating}
    />
  );
};

type HeroLayoutProps = {
  name: string;
  address: Address;
  background?: ComplexImage;
  cta1?: Cta;
  cta2?: Cta;
  hours?: Hours;
  numReviews?: number;
  rating?: number;
};

const HeroLayout = (props: HeroLayoutProps) => {
  return (
    <div className="location-hero container">
        <div className="">
          <h1 className="heading">{props.name}</h1>
          <div className="heading heading-lead">
            {props.address.line1}
          </div>
          {props.hours && (
            <div className="">
              <HoursStatus
                hours={props.hours}
                separatorTemplate={() => <span className="bullet" />}
                dayOfWeekTemplate={() => null}
                className=""
              />
            </div>
          )}
          {props.rating && (
            <div className="">
              <span> {props.rating} out of 5 </span>
              <span>({props.numReviews} reviews)</span>
            </div>
          )}
          {(props.cta1 || props.cta2) && (
            <div className="cta">
              {props.cta1 && (
                <Link className="button button-primary" cta={props.cta1} />
              )}
              {props.cta2 && (
                <Link className="button button-secondary" cta={props.cta2} />
              )}
            </div>
          )}
        </div>
        {props.background && (
          <div className="">
            <Image
              className=""
              image={props.background}
            />
          </div>
        )}
    </div>
  );
};

export const LocationHero: ComponentConfig = {
  fields: {
  },
  render: () => (
    <Hero/>
  )
};
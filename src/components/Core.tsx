import { ReactNode } from "react";
import {
  Link,
  Address,
  AddressType,
  HoursTable,
} from "@yext/pages-components";
import { FaPhone, FaEnvelope } from "react-icons/fa";
import { C_locationCore, LocationStream } from "../types/autogen";
import { useDocument } from "../hooks/useDocument";
import { ComponentConfig } from "@measured/puck";

const Core = () => {
  const profile = useDocument<LocationStream>((document) => document.c_locationCore);  

  if (profile) {
    return (
      <CoreLayout profile={profile} />
    );
  }
};

type CoreLayoutProps = {
  profile: C_locationCore;
};

const CoreSection = (props: { children: ReactNode }) => {
  return <div className="section">{props.children}</div>;
};

const CoreHeading = (props: { children: ReactNode }) => {
  return <h2 className="heading">{props.children}</h2>;
};

const CoreLayout = (props: CoreLayoutProps) => {
  const { profile } = props;

  return (
    <div className="core">
      <CoreSection>
        <CoreHeading>Information</CoreHeading>
        <Address address={profile.address as AddressType} />
        {profile.mainPhone && (
          <div className="phone-section">
            <FaPhone className="icon" />
            <span className="phone">Phone</span>
            <span>{profile.mainPhone}</span>
          </div>
        )}
        {profile.tollfreePhone && (
          <div className="phone-section">
            <FaPhone className="icon" />
            <span className="phone">Toll-free</span>
            <span>{profile.tollfreePhone}</span>
          </div>
        )}
        {profile.emails && (
          <div className="email">
            <FaEnvelope className="icon" />
            <Link
              className="link"
              cta={{ link: profile.emails[0], linkType: "Email" }}
              eventName="email"
            />
          </div>
        )}
      </CoreSection>
      {(profile.hours) && (
        <CoreSection>
          <CoreHeading>Hours</CoreHeading>
          {profile.hours && (
            <HoursTable hours={profile.hours} startOfWeek="Monday" />
          )}
        </CoreSection>
      )}
      {profile.services && (
        <CoreSection>
          <CoreHeading>Services</CoreHeading>
          <ul className="list-inside">
            {profile.services.map((service) => (
              <li className="mb-2" key={service}>
                {service}
              </li>
            ))}
          </ul>
        </CoreSection>
      )}
    </div>
  );
};

export const PuckCore: ComponentConfig = {
  fields: {
  },
  render: () => (
    <Core/>
  )
};
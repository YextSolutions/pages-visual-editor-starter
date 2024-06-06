import { ReactNode } from "react";
import { Link, Address, AddressType, HoursTable } from "@yext/pages-components";
import { FaPhone, FaEnvelope } from "react-icons/fa";
import { BranchStream, C_locationCore } from "../types/autogen";
import { useDocument } from "../hooks/useDocument";
import { ComponentConfig } from "@measured/puck";
import { Section } from "./Section";
import { SectionTitle } from "./ui/sectionTitle";

const Core = () => {
  const profile = useDocument<BranchStream>(
    (document) => document.c_locationCore
  );

  if (profile) {
    return <CoreLayout profile={profile} />;
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
  const address = profile.address?.address;

  console.log(profile);

  return (
    <Section className="flex flex-col gap-y-8 md:grid md:grid-cols-3">
      <CoreSection>
        <SectionTitle title="Information" size="md" />
        {address && <Address className="text-blue-950" address={address} />}

        {profile.phone && (
          <div className="flex gap-x-2 pt-4 items-center">
            <FaPhone className="icon text-blue-950" />
            <span className="phone">Phone</span>
            <span>{profile.phone}</span>
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
      {profile.hours && (
        <CoreSection>
          <SectionTitle title="Hours" size="md" />
          {profile.hours && (
            <HoursTable
              className="text-blue-950"
              hours={profile.hours}
              startOfWeek="Monday"
            />
          )}
        </CoreSection>
      )}
      {profile.services && (
        <CoreSection>
          <SectionTitle title="Services" size="md" />
          <ul className="list-inside">
            {profile.services.map((service) => (
              <li className="mb-2" key={service}>
                {service}
              </li>
            ))}
          </ul>
        </CoreSection>
      )}
    </Section>
  );
};

export interface LocationCoreProps {}

export const LocationCore: ComponentConfig = {
  label: "Branch Information",
  fields: {},
  render: () => <Core />,
};

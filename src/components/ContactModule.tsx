import { ComponentConfig, Fields, WithPuckProps } from "@measured/puck";
import {
  YextEntityField,
  useDocument,
  resolveYextEntityField,
  YextEntityFieldSelector,
} from "@yext/visual-editor";
import { SingleOption, Location } from "../types/components";
import { formatPhone, pushContactSubmitToDataLayer } from "../common/helpers";
import { useState } from "react";
import { MapboxMaps, LocationMap, Link, getDirections } from "@yext/pages-components";

export type ContactModuleProps = {
  formVersion: YextEntityField<SingleOption>;
};

const contactModuleFields: Fields<ContactModuleProps> = {
  formVersion: YextEntityFieldSelector<any, SingleOption>({
    label: "Contact Form Version",
    filter: {
      types: ["type.option"],
      allowList: ["c_contactFormVersion"],
    },
    disableConstantValueToggle: true
  }),
}

async function submitForm(e: React.FormEvent<HTMLFormElement>, formURL: string, salesforceId: string, setFormSubmitted: Function) {
  e.preventDefault();
  const formEl = e.target as HTMLFormElement;
  const formData = new FormData(formEl);

  const response = await fetch(formURL, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(formData),
    method: "POST",
    mode: "no-cors",
  });

  // TODO: need to add 'Access-Control-Allow-Origin' header server side for us to access response code
  // if (response.ok) {
  const consentToContact = formData.get("00N5f00000hYeYM") === "1";
  const comments = formData.get("00NJR000005yW3n")?.toString() || "";
  const concatenatedComments = comments.length > 100 ? comments.substring(0, 100) : comments;
  pushContactSubmitToDataLayer(consentToContact, concatenatedComments, salesforceId);
  // }

  setFormSubmitted(true);
}

const ContactModuleComponent = ({
                                  formVersion,
                                  puck: { isEditing },
                                }: WithPuckProps<ContactModuleProps>) => {
  const veDocument = useDocument();
  const streamDocument = useDocument<any>();
  const resolvedPhone = resolveYextEntityField<string>(veDocument, {field: "c_teamPhoneNumber", constantValue: ""});
  const resolvedEmail = resolveYextEntityField<string>(veDocument, {field: "c_teamEmail", constantValue: ""});
  const resolvedContactFormDelegate = resolveYextEntityField<Location[]>(veDocument, {field: "c_contactFormDelegate", constantValue: []});
  let resolvedFormVersion = resolveYextEntityField<string>(veDocument, formVersion);
  const formattedPhone = resolvedPhone ? formatPhone(resolvedPhone) : "";
  const [formSubmitted, setFormSubmitted] = useState(false);
  if (!resolvedFormVersion) {
    resolvedFormVersion = "LONG_FORM";
  }

  const mapPinUrl = getDirections(streamDocument.address, streamDocument.ref_listings, streamDocument.googlePlaceId);

  const salesforceId = (resolvedContactFormDelegate && resolvedContactFormDelegate[0]) ? resolvedContactFormDelegate[0].c_salesforceID : ""
  // orgId for UAT environment is the same across long and short forms
  const formURL = `https://test.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8&orgId=00DAu000008XvpJ`;

  return (
      <div id="contact" className={`ContactModule components text-gray-500 px-8 md:px-40 lg:px-0 lg:max-w-[1140px] lg:w-full lg:m-auto py-[96px]`}>
        <div className="flex flex-col items-center">
          <div className="Heading--head text-center font-primary">
            {streamDocument._site.c_contactFormSectionHeader}
          </div>
          <div className="my-8 w-[175px] h-[2px] bg-brand-primary"></div>
          <div className="text-base text-center font-secondary font-light mb-[48px]">
            <div>{streamDocument._site.c_contactFormEmailSubheading}: {resolvedEmail}</div>
            <div>{streamDocument._site.c_contactFormPhoneSubheading}: {formattedPhone}</div>
          </div>
        </div>
        {formSubmitted && (
            <div className="flex flex-col items-center mb-[32px]">
              <div className="my-8 w-[175px] h-[2px] bg-brand-primary"></div>
              <div className="Heading--head text-center font-primary">
                Thank you for your submission!
              </div>
            </div>
        )}
        {!formSubmitted && (
            <div className="mb-8">
              <form onSubmit={(e) => submitForm(e, formURL, salesforceId ?? '', setFormSubmitted)} >
                <input type="hidden" name="oid" value="00DAq000008maPZ"></input> {/* updated oid for UAT environment */}
                <input type="hidden" name="ownerid" value={salesforceId}></input>
                <input type="hidden" id="Advisor_Email__c" name="Advisor_Email__c" value="richard.r.liu@rbc.com"></input>
                <input type="hidden" id="recordType" name="recordType" value="0125f000000Rsor"></input>
                <input type="hidden" id="leadsource" name="lead_source" value="Advisor Website"></input>
                <input type="hidden" name="retURL" value="http://www.rbcwealthmanagement.com"></input>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="flex flex-col">
                    <label className="font-primary text-2xl mb-2" htmlFor="first_name">{streamDocument._site.c_contactFormFirstName}</label>
                    <input id="first_name" className="border border-gray-200 p-[15px] placeholder-gray-100" maxLength={40} name="first_name" size={20} type="text" placeholder="First name" /><br />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-primary text-2xl mb-2" htmlFor="last_name">{streamDocument._site.c_contactFormLastName}</label>
                    <input id="last_name" className="border border-gray-200 p-[15px] placeholder-gray-100" maxLength={80} name="last_name" size={20} type="text" placeholder="Last name" /><br />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-primary text-2xl mb-2" htmlFor="email">{streamDocument._site.c_contactFormEmailAddress}</label>
                    <input id="email" className="border border-gray-200 p-[15px] placeholder-gray-100" maxLength={80} name="email" size={20} type="text" placeholder="Email address" /><br />
                  </div>
                  {resolvedFormVersion == "LONG_FORM" && (
                      <>
                        <div className="flex flex-col">
                          <label className="font-primary text-2xl mb-2" htmlFor="phone">{streamDocument._site.c_contactFormPhoneNumber}</label>
                          <input id="phone" className="border border-gray-200 p-[15px] placeholder-gray-100" maxLength={40} name="phone" size={20} type="text" placeholder="Phone number (optional)" /><br />
                        </div>
                        <div className="flex flex-col">
                          <label className="font-primary text-2xl mb-2" htmlFor="city">{streamDocument._site.c_contactFormCity}</label>
                          <input id="city" className="border border-gray-200 p-[15px] placeholder-gray-100" maxLength={40} name="city" size={20} type="text" placeholder="City" /><br />
                        </div>
                        <div className="flex flex-col">
                          <label className="font-primary text-2xl mb-2" htmlFor="state">{streamDocument._site.c_contactFormProvince}</label>
                          <input id="state" className="border border-gray-200 p-[15px] placeholder-gray-100" maxLength={20} name="state" size={20} type="text" placeholder="Province/State" /><br />
                        </div>
                      </>
                  )}
                </div>
                {resolvedFormVersion == "LONG_FORM" && (
                    <div className="flex flex-col">
                      <label className="font-primary text-2xl mb-2" htmlFor="00NJR000005yW3n">
                        {streamDocument._site.c_contactFormQuestionsOrComments}
                      </label>
                      <textarea className="border border-gray-200 p-[15px] placeholder-gray-100 placeholder-font-light placeholder-font-secondary" id="00NJR000005yW3n" name="00NJR000005yW3n" rows={3} wrap="soft" placeholder="Questions or Comments (optional)" ></textarea><br />
                    </div>
                )}
                <div className="flex flex-col mb-8">
                  <div className="font-primary text-2xl mb-2">
                    {streamDocument._site.c_contactFormConsentHeading}
                  </div>
                  <div className="flex py-4">
                    <label className="switch mr-8">
                      <input className="" id="00N5f00000hYeYM" name="00N5f00000hYeYM" type="checkbox" value="1" />
                      <span className="slider round"></span>
                    </label>
                    <label className="font-secondary font-light" htmlFor="00N5f00000hYeYM">
                      {streamDocument._site.c_contactFormConsentToggleText}
                    </label>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row">
                  <input className="Button--primary w-[160px] rounded-none text-base mr-8 mb-8 hover:cursor-pointer font-primary" type="submit" alt="submit" name={streamDocument._site.c_contactFormConsentCTAText} value="Submit"></input>
                  <div className="font-secondary font-light">
                    {streamDocument._site.c_contactFormConsentDisclaimer}
                  </div>
                </div>
              </form>
            </div>
        )}
        <div>
          {typeof document !== "undefined" && document.getElementById("preview-frame") ? (
              <div> no map doc </div>
          ) : (
              <LocationMap
                  className="w-full h-[250px] lg:h-[350px]"
                  provider={MapboxMaps}
                  clientKey="gme-yextinc"
                  apiKey={"pk.eyJ1IjoieWV4dCIsImEiOiJqNzVybUhnIn0.hTOO5A1yqfpN42-_z_GuLw"}
                  coordinate={streamDocument.yextDisplayCoordinate ?? { latitude: 0, longitude: 0 }}
                  providerOptions={{
                    style: "mapbox://styles/mapbox/light-v11",
                  }}
                  controls={false}
                  panHandler={() => null}
                  singleZoom={13}
              >
                <Link target="_blank" href={mapPinUrl ?? ""} eventName="directions">
                  <span className="sr-only">get directions</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="50" viewBox="0 0 48 50" fill="none">
                    <path d="M24.0815 1C28.3842 1 32.2795 2.74402 35.0992 5.56371C37.9189 8.3834 39.6629 12.2788 39.6629 16.5815C39.6629 22.3904 34.4317 33.1926 24.0807 49C13.7306 33.1913 8.5 22.39 8.5 16.5815C8.5 12.2788 10.244 8.3834 13.0637 5.56371C15.8834 2.74402 19.7788 1 24.0815 1Z" fill="#006AC3" stroke="black" strokeOpacity="0.5"/>
                    <path d="M24.0813 23.5064C27.906 23.5064 31.0064 20.406 31.0064 16.5813C31.0064 12.7567 27.906 9.65625 24.0813 9.65625C20.2567 9.65625 17.1562 12.7567 17.1562 16.5813C17.1562 20.406 20.2567 23.5064 24.0813 23.5064Z" fill="white"/>
                  </svg>
                </Link>
              </LocationMap>
          )}
        </div>
      </div>
  );
};

export const ContactModule: ComponentConfig<ContactModuleProps> = {
  fields: contactModuleFields,
  defaultProps: {
    formVersion: {
      field: "c_contactFormVersion",
      constantValue: {},
    },
  },
  resolveFields: async () => {
    return {
      ...contactModuleFields,
    };
  },
  render: (props) => <ContactModuleComponent {...props} />,
};
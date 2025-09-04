import { ComponentConfig, Fields, WithPuckProps } from "@measured/puck";
import {
  YextEntityField,
  useDocument,
  YextEntityFieldSelector,
    resolveYextEntityField,
} from "@yext/visual-editor";
import { MapboxMaps, LocationMap, Link, getDirections } from "@yext/pages-components";

export type ContactModuleProps = {
  formVersion: YextEntityField<string>;
};

const contactModuleFields: Fields<ContactModuleProps> = {
  formVersion: YextEntityFieldSelector<any, string>({
    label: "Contact Form Version",
    filter: {
      types: ["type.option"],
      allowList: ["c_contactFormVersion"],
    },
    disableConstantValueToggle: true
  }),
}

const ContactModuleComponent = ({formVersion,
                                  puck: { isEditing },
                                }: WithPuckProps<ContactModuleProps>) => {
  const streamDocument = useDocument<any>();

  const mapPinUrl = getDirections(streamDocument.address, streamDocument.ref_listings, streamDocument.googlePlaceId);
  const documentIsUndefined = typeof document === "undefined";
  const iframe = documentIsUndefined
      ? undefined
      : (document.getElementById("preview-frame") as HTMLIFrameElement);

  return (
      <div id="contact" className={`ContactModule components text-gray-500 px-8 md:px-40 lg:px-0 lg:max-w-[1140px] lg:w-full lg:m-auto py-[96px]`}>
        <div>${resolveYextEntityField(formVersion, streamDocument)} ${isEditing}</div>
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
            iframeWindow={iframe?.contentWindow ?? undefined}
        >
          <Link target="_blank" href={mapPinUrl ?? ""} eventName="directions">
            <span className="sr-only">get directions</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="50" viewBox="0 0 48 50" fill="none">
              <path d="M24.0815 1C28.3842 1 32.2795 2.74402 35.0992 5.56371C37.9189 8.3834 39.6629 12.2788 39.6629 16.5815C39.6629 22.3904 34.4317 33.1926 24.0807 49C13.7306 33.1913 8.5 22.39 8.5 16.5815C8.5 12.2788 10.244 8.3834 13.0637 5.56371C15.8834 2.74402 19.7788 1 24.0815 1Z" fill="#006AC3" stroke="black" strokeOpacity="0.5"/>
              <path d="M24.0813 23.5064C27.906 23.5064 31.0064 20.406 31.0064 16.5813C31.0064 12.7567 27.906 9.65625 24.0813 9.65625C20.2567 9.65625 17.1562 12.7567 17.1562 16.5813C17.1562 20.406 20.2567 23.5064 24.0813 23.5064Z" fill="white"/>
            </svg>
          </Link>
        </LocationMap>
      </div>
  );
};

export const ContactModule: ComponentConfig<ContactModuleProps> = {
  label: "Contact Module",
  fields: contactModuleFields,
  defaultProps: {
    formVersion: {
      field: "name",
      constantValue: "string",
    },
  },
  resolveFields: async () => {
    return {
      ...contactModuleFields,
    };
  },
  render: (props) => <ContactModuleComponent {...props} />,
};
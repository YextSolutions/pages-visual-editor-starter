import type { Config } from "@measured/puck";
import "@yext/visual-editor/style.css";
import {
  AddressComponent as Address,
  AddressProps,
  BodyTextComponent as BodyText,
  BodyTextProps,
  EmailsComponent as Emails,
  EmailsProps,
  FlexContainerComponent as FlexContainer,
  FlexContainerProps,
  GridSectionComponent as GridSection,
  GridSectionProps,
  HeadingTextComponent as HeadingText,
  HeadingTextProps,
  HoursCardComponent as HoursCard,
  HoursCardProps,
  HoursStatusComponent as HoursStatus,
  HoursStatusProps,
  ImageWrapperComponent as ImageWrapper,
  ImageWrapperProps,
  PhoneComponent as Phone,
  PhoneProps,
  TextListComponent as TextList,
  TextListProps,
  useDocument,
} from "@yext/visual-editor";
import { Header } from "./components/Header.js";
import { Footer } from "./components/Footer.js";
import { AnalyticsProvider } from "@yext/pages-components";
import { YextCTAProps } from "./components/atoms/cta.js";
import { AnalyticsCTA } from "./components/AnalyticsCTA.js";

type LocationProps = {
  GridSection: GridSectionProps;
  // HoursCard: HoursCardProps;
  // BodyText: BodyTextProps;
  // HeadingText: HeadingTextProps;
  // ImageWrapper: ImageWrapperProps;
  // CTA: CTAWrapperProps;
  // HoursStatus: HoursStatusProps;
  FlexContainer: FlexContainerProps;
  // Address: AddressProps;
  // TextList: TextListProps;
  // Emails: EmailsProps;
  // Phone: PhoneProps;
  AnalyticsCTA: YextCTAProps;
};

// All the available components for locations
export const locationConfig: Config<LocationProps> = {
  components: {
    // Address,
    // BodyText,
    // AnalyticsCTA,
    FlexContainer,
    GridSection,
    // HeadingText,
    // HoursCard,
    // HoursStatus,
    // ImageWrapper,
    // TextList,
    // Emails,
    // Phone,
    AnalyticsCTA,
  },
  root: {
    render: ({ children, puck: { isEditing } }) => {
      const fetchedDocument = useDocument<any>();

      const templateData = {
        document: { ...fetchedDocument, __: "location" },
      };

      return (
        <AnalyticsProvider
          apiKey={YEXT_PUBLIC_API_KEY}
          templateData={templateData}
          currency={"USD"}
          enableDebugging={true}
        >
          <Header isEditing={isEditing} />
          {children}
          <Footer isEditing={isEditing} />
        </AnalyticsProvider>
      );
    },
    fields: {},
  },
};

export const componentRegistry = new Map<string, Config<any>>([
  ["location", locationConfig],
]);

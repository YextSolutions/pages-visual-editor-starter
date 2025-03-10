import { Module, ModuleConfig, ModuleProps } from "@yext/pages/*";
import {AnalyticsProvider, useAnalytics} from "@yext/pages-components";

const templateData: ModuleProps = {
  document: {
    businessId: "1000146856",
    __: {
      name: "widgetAnalyticsTest",
      staticPage: true
    }
  },
  __meta: {
    mode: "production"
  }
}

export const config: ModuleConfig = {
  name: "search"
}

const WidgetInterior = () => {
  useAnalytics();
  return <p>potato</p>;
}

export const SearchWidget: Module = () => {
  return(
      <AnalyticsProvider apiKey={YEXT_PUBLIC_SEARCH_EXPERIENCE_API_KEY} currency="USD" templateData={templateData} productionDomains={[""]}>
        <WidgetInterior></WidgetInterior>
      </AnalyticsProvider>
  )
};

export default SearchWidget;
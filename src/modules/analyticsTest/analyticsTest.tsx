import * as React from "react";
import { Module, ModuleConfig, ModuleProps } from "@yext/pages/*";
import { AnalyticsProvider, useAnalytics } from "@yext/pages-components";
import "./index.css";

const templateData: ModuleProps = {
  document: {
    businessId: "1000146856",
    siteId: "63558",
    __: {
      name: "analyticsTest",
      staticPage: true
    }
  }, 
  __meta: {
    mode: "production"
  }
}

export const config: ModuleConfig = {
  name: "analyticsTest"
}

const WidgetInterior = () => {
  useAnalytics();
  return <p>widget potato widget</p>;
}

const AnalyticsTest: Module = () => {
  return(
    <AnalyticsProvider 
      apiKey={YEXT_PUBLIC_SEARCH_EXPERIENCE_API_KEY}
      currency="USD"
      templateData={templateData}
      productionDomains={["jwartofskyturtlehead2.pagesdev.yextengtest.com"]}
    >
      <WidgetInterior>
        tomato
      </WidgetInterior>
    </AnalyticsProvider>
  )
}

export default AnalyticsTest;

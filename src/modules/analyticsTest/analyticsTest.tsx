import * as React from "react";
import { Module, ModuleConfig, ModuleProps } from "@yext/pages/*";
import { AnalyticsProvider, useAnalytics } from "@yext/pages-components";
import "./index.css";

const templateData: ModuleProps = {
  document: {
    businessId: "REPLACE_ME",
    siteId: "REPLACE_ME",
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
      productionDomains={["jwartofskyanalyticstest.com"]}
    >
      <WidgetInterior>
        tomato
      </WidgetInterior>
    </AnalyticsProvider>
  )
}

export default AnalyticsTest;

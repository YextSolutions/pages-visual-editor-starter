import { PagesHttpRequest, PagesHttpResponse } from "@yext/pages/*";
import { locationConfig, officeConfig } from "../../../../puck/puck.config";

export default async function fetchTemplates(
  request: PagesHttpRequest,
): Promise<PagesHttpResponse> {
  const { method } = request;
  if (method !== "GET") {
    return { body: "Method not allowed", headers: {}, statusCode: 405 };
  }

  try {
    // TODO make http request here to get real templates
    const response = {
      templates: [
        { name: "Location", externalId: "location", templateConfig: locationConfig },
        { name: "Office", externalId: "office", templateConfig: officeConfig },
      ],
    };
    return {
      body: JSON.stringify(response),
      headers: {},
      statusCode: 200,
    };
  } catch (error) {
    return {
      body: JSON.stringify(error),
      headers: {},
      statusCode: 500,
    };
  }
}

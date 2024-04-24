import { PagesHttpRequest, PagesHttpResponse } from "@yext/pages/*";
import { Template } from "../../../../components/puck-overrides/TemplatePicker";

export const templates: Template[] = [
  {
    name: "Location",
    externalId: "location",
  },
  {
    name: "Product",
    externalId: "product",
  },
];

export default async function fetchTemplates(
  request: PagesHttpRequest,
): Promise<PagesHttpResponse> {
  const { method } = request;
  if (method !== "GET") {
    return { body: "Method not allowed", headers: {}, statusCode: 405 };
  }

  try {
    // TODO make http request here to get real templates
    return {
      body: JSON.stringify(templates),
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

import { PagesHttpRequest, PagesHttpResponse } from "@yext/pages/*";
import { Template } from "../../../../components/puck-overrides/TemplatePicker";
import { templates } from "./list";

export default async function getTemplate(
  request: PagesHttpRequest,
): Promise<PagesHttpResponse> {
  const { method, pathParams } = request;
  if (method !== "GET") {
    return { body: "Method not allowed", headers: {}, statusCode: 405 };
  }
  const templateId = pathParams.id;
  if (!templateId) {
    return { body: "Missing template id", headers: {}, statusCode: 400 };
  }

  try {
    // TODO make http request here to get real template
    let targetTemplate: Template | undefined;
    templates.forEach((template: Template) => {
      if (template.externalId === templateId) {
        targetTemplate = template;
      }
    });

    if (!targetTemplate) {
      return {
        body: JSON.stringify(
          new Error(`Could not find template for id: ${templateId}`),
        ),
        headers: {},
        statusCode: 404,
      };
    }

    return {
      body: JSON.stringify(targetTemplate),
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

import { PagesHttpRequest, PagesHttpResponse } from "@yext/pages/*";
import { templates } from "./list";
import { TemplateDefinition } from "../../../../types/definitions";

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
    let targetTemplate: TemplateDefinition | undefined;
    templates.forEach((template: TemplateDefinition) => {
      if (template.id === templateId) {
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

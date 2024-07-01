import { PagesHttpRequest, PagesHttpResponse } from "@yext/pages/*";

const vparam = 20240401;

export default async function entityDocument(
  request: PagesHttpRequest,
): Promise<PagesHttpResponse> {
  const { method, pathParams } = request;

  // required params
  const templateId = pathParams.templateId;
  const entityId = pathParams.entityId;

  // optional params
  const suggestionIds = pathParams.suggestionIds;
  const locale = pathParams.locale;

  if (!templateId) {
    return { body: "Missing stream id", headers: {}, statusCode: 400 };
  }
  if (!entityId) {
    return { body: "Missing entity id", headers: {}, statusCode: 400 };
  }

  switch (method) {
    case "GET":
      try {
        let requestPath = `https://dev.yext.com/v2/accounts/me/sites/${YEXT_PUBLIC_SITE_ID}/fetchentitydocument?v=${vparam}&entityId=${entityId}&templateId=${templateId}&locale=en&api_key=${YEXT_PUBLIC_API_KEY}`;
        if (suggestionIds) {
          requestPath += `&editIds=${suggestionIds}`;
        }
        if (locale) {
          requestPath += `&locale=${locale}`;
        }
        const response = await fetch(requestPath);
        const body = await response.json();
        return {
          body: JSON.stringify(body),
          headers: {},
          statusCode: response.status,
        };
      } catch (error) {
        return {
          body: JSON.stringify(error),
          headers: {},
          statusCode: 500,
        };
      }
    default:
      return {
        body: "Method not allowed",
        headers: {},
        statusCode: 405,
      };
  }
}

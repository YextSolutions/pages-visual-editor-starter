import { PagesHttpRequest, PagesHttpResponse } from "@yext/pages/*";

const vparam = 20240401;

export default async function entity(
  request: PagesHttpRequest
): Promise<PagesHttpResponse> {
  const { method, pathParams, body } = request;
  const entityId = pathParams.id;
  if (!entityId) {
    return { body: "Missing entity id", headers: {}, statusCode: 400 };
  }

  switch (method) {
    case "GET":
      return getEntity(pathParams.id);
    case "PUT":
      if (!body) {
        return { body: "Missing entity body", headers: {}, statusCode: 400 };
      }
      return updateEntity(pathParams.id, JSON.parse(body));
    default:
      return { body: "Method not allowed", headers: {}, statusCode: 405 };
  }
}

const getEntity = async (entityId?: string): Promise<PagesHttpResponse> => {
  if (!entityId) {
    return { body: "Missing entity id", headers: {}, statusCode: 400 };
  }

  const mgmtApiResp = await fetch(
    `https://api.yextapis.com/v2/accounts/me/entities/${entityId}?api_key=${YEXT_PUBLIC_API_KEY}&v=${vparam}`
  );

  const resp = await mgmtApiResp.json();
  return {
    body: JSON.stringify(resp),
    headers: {},
    statusCode: mgmtApiResp.status,
  };
};

const updateEntity = async (
  entityId?: string,
  entityBody?: Record<string, any>
): Promise<PagesHttpResponse> => {
  if (!entityId) {
    return { body: "Missing entity id", headers: {}, statusCode: 400 };
  } else if (!entityBody) {
    return { body: "Missing entity body", headers: {}, statusCode: 400 };
  }

  const mgmtApiResp = await fetch(
    `https://api.yextapis.com/v2/accounts/me/entities/${entityId}?api_key=${YEXT_PUBLIC_API_KEY}&v=${vparam}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(entityBody),
    }
  );

  const resp = await mgmtApiResp.json();
  return {
    body: JSON.stringify(resp),
    headers: {},
    statusCode: mgmtApiResp.status,
  };
};

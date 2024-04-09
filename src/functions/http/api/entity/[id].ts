import { PagesHttpRequest, PagesHttpResponse } from "@yext/pages/*";

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
    `https://api.yextapis.com/v2/accounts/me/entities/${entityId}?api_key=${YEXT_PUBLIC_API_KEY}&v=20240401`
  );

  const resp = await mgmtApiResp.json();

  if (mgmtApiResp.status !== 200) {
    console.error("Error fetching entity:", resp);
    return {
      body: JSON.stringify(resp),
      headers: {},
      statusCode: mgmtApiResp.status,
    };
  } else {
    const { response } = resp;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { c_template, slug, meta, ...rest } = response;

    // excluding c_template and slug from the response and pulling id out of meta
    const updatedResp = { id: meta.id, ...rest };
    return {
      body: JSON.stringify(updatedResp),
      headers: {},
      statusCode: 200,
    };
  }
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
    `https://api.yextapis.com/v2/accounts/me/entities/${entityId}?api_key=${YEXT_PUBLIC_API_KEY}&v=20230901`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(entityBody),
    }
  );

  const resp = await mgmtApiResp.json();

  if (mgmtApiResp.status !== 200) {
    console.error("Error updating entity:", resp);
    return {
      body: JSON.stringify(resp),
      headers: {},
      statusCode: mgmtApiResp.status,
    };
  } else {
    return {
      body: JSON.stringify(resp),
      headers: {},
      statusCode: 200,
    };
  }
};

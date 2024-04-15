import { PagesHttpRequest, PagesHttpResponse } from "@yext/pages/*";

export default async function getEntities(
    request: PagesHttpRequest
  ): Promise<PagesHttpResponse> {
    const { method, pathParams, body } = request;
    if (method !== "GET") {
        return { body: "Method not allowed", headers: {}, statusCode: 405 };
    }
  
    const mgmtApiResp = await fetch(
      `https://api.yextapis.com/v2/accounts/me/entities?api_key=${YEXT_PUBLIC_API_KEY}&v=20240401`
    );

    const resp = await mgmtApiResp.json();

    if (mgmtApiResp.status !== 200) {
        console.error("Error fetching entities:", resp);
        return {
            body: JSON.stringify(resp),
            headers: {},
            statusCode: mgmtApiResp.status,
        };
    }

    const { response } = resp;
    return {
        body: JSON.stringify(response),
        headers: {},
        statusCode: 200,
    };
  }
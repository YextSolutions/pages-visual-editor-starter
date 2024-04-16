import { PagesHttpRequest, PagesHttpResponse } from "@yext/pages/*";

export default async function getEntities(
    request: PagesHttpRequest
  ): Promise<PagesHttpResponse> {
    const { method, queryParams, body } = request;
    if (method !== "GET") {
        return { body: "Method not allowed", headers: {}, statusCode: 405 };
    }

    const vparam = 20240401;

    let mgmtApiReq = `https://api.yextapis.com/v2/accounts/me/entities?api_key=${YEXT_PUBLIC_API_KEY}&v=${vparam}`;
    const entityTypes = queryParams.entityTypes; 
    if (entityTypes) {
        mgmtApiReq += `&entityTypes=${entityTypes}`
    }
  
    const mgmtApiResp = await fetch(mgmtApiReq);
    const resp = await mgmtApiResp.json();

    return {
        body: JSON.stringify(resp),
        headers: {},
        statusCode: mgmtApiResp.status,
    };
  }
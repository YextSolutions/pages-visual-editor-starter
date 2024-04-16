import { PagesHttpRequest, PagesHttpResponse } from "@yext/pages/*";

const vparam = 20240401;

export default async function getEntities(
    request: PagesHttpRequest
  ): Promise<PagesHttpResponse> {
    const { method, queryParams, body } = request;
    if (method !== "GET") {
        return { body: "Method not allowed", headers: {}, statusCode: 405 };
    }

    let mgmtApiReq = `https://api.yextapis.com/v2/accounts/me/entities?api_key=${YEXT_PUBLIC_API_KEY}&v=${vparam}`;
    const entityTypes = queryParams.entityTypes; 
    if (entityTypes) {
        mgmtApiReq += `&entityTypes=${entityTypes}`
    }

    const mgmtApiResp = await fetch(mgmtApiReq);
    try {
        const resp = await mgmtApiResp.json();
        return {
            body: JSON.stringify(resp),
            headers: {},
            statusCode: mgmtApiResp.status,
        };
    } catch (error) {
        console.log("Failed to fetch entities: " + error)
        return {
            body: JSON.stringify(mgmtApiResp),
            headers: {},
            statusCode: mgmtApiResp.status,
        };
    }
  }
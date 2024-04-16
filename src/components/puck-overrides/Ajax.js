/**
 * Fetches entities using the getEntities() function and parses the response.
 * @return {Promise<Entity[]>}
 */
export async function fetchEntities() {
  return fetch("api/entity/list").then((res) => {
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    return res.json();
  }).then(data => {
    const entities = data["response"]["entities"];
    return entities.map(entity => {
      return {
        name: entity["name"],
        externalId: entity["meta"]["id"],
        internalId: entity["meta"]["uid"],
      }
    });
  });
}
/**
 * Fetches entities using the getEntities() function and parses the response.
 * @return {Promise<Entity[]>}
 */
export async function fetchEntities() {
  try {
    const res = await fetch("api/entity/list");
    const json = await res.json();
    const entities = json.response.entities;
    return entities.map(entity => {
      return {
        name: entity.name,
        externalId: entity.meta.id,
        internalId: entity.meta.uid,
      }
    });
  } catch (e) {
    throw new Error("Failed to fetch entities: " + e.message)
  }
}
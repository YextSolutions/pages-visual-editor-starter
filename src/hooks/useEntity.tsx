import {useQueries, useQuery} from "@tanstack/react-query";
import { fetchEntity } from "../utils/api";
import { Role } from "../templates/edit";
import React from "react";
import {
  baseEntityPageLayoutsField,
  baseEntityVisualConfigField,
  pageLayoutVisualConfigField,
  siteEntityVisualConfigField
} from "../puck/editor";

export type VisualConfiguration = {
  template: string;
  data: string;
}

// used to track 'priority' of data, where lower is prioritized
enum DataSource {
  Entity = 0,
  EntityLayout = 1,
  SiteLayout = 2,
  None = 3
}

/**
 * Gets the puck data using the configuration directly on the baseEntity, then falling back to
 * the Page Layout referenced by the base entity, and failing that gets the Page Layout referenced
 * by the Site entity.
 *
 * The data directly on the base entity is only used for role 'individual'.
 */
export const GetPuckData = (
  siteEntityId: string,
  role: string,
  templateId?: string,
  entityId?: string,
): string => {
  const [data, setData] = React.useState("");
  const [dataSource, setDataSource] = React.useState(DataSource.None);

  const {entity, status} = useEntity(entityId ?? "", dataSource > DataSource.EntityLayout);
  // page layout ids from the entity
  const entityPageLayoutIds: string[] = [];
  if (status === "success" && entity?.response) {
    // look for c_visualConfigurations directly on the entity
    const configs = entity?.response[baseEntityVisualConfigField] ?? [];
    configs.forEach((config: VisualConfiguration) => {
      // only use the data directly off the entity for role 'INDIVIDUAL'
      if (templateId && dataSource > DataSource.Entity && config.template === templateId && role === Role.INDIVIDUAL) {
        setDataSource(DataSource.Entity);
        setData(config.data);
      }
    });
    // get the page layout entity ids in c_pages_layouts to search
    const pagesLayouts = entity?.response[baseEntityPageLayoutsField] ?? [];
    pagesLayouts.forEach((pagesLayout: string) => {
      entityPageLayoutIds.push(pagesLayout);
    });
  }
  // pull the layouts using the ids from the base entity, then find matching layout
  const entityLayouts = useEntities(entityPageLayoutIds, dataSource > DataSource.EntityLayout);
  entityLayouts.forEach((result: {entity: any, status: string}) => {
    if (result.status === "success" && result.entity?.response) {
      const layout = result.entity.response[pageLayoutVisualConfigField];
      if (templateId && layout["data"] && layout["template"] === templateId) {
        if (dataSource > DataSource.EntityLayout) {
          setDataSource(DataSource.EntityLayout);
          setData(layout["data"]);
        }
      }
    }
  });
  // get page layout ids from the Site entity
  const sitePagesLayoutsIds: string[] = [];
  const {entity: siteEntity, status: siteEntityStatus} = useEntity(siteEntityId, dataSource > DataSource.SiteLayout);
  if (siteEntityStatus === "success" && siteEntity.response?.[siteEntityVisualConfigField]) {
    // read the c_visualLayouts field off the Site entity
    siteEntity.response[siteEntityVisualConfigField].forEach((visualLayout: string) => {
      sitePagesLayoutsIds.push(visualLayout);
    });
  }
  // pull the layouts using the ids from the Site entity, then find matching layout
  const siteLayouts = useEntities(sitePagesLayoutsIds, dataSource > DataSource.SiteLayout);
  siteLayouts.forEach((result: {entity: any, status: string}) => {
    if (result.status === "success" && result.entity?.response[pageLayoutVisualConfigField]) {
      const layout = result.entity.response[pageLayoutVisualConfigField];
      if (templateId && layout["data"] && layout["template"] === templateId) {
        if (dataSource > DataSource.SiteLayout) {
          setDataSource(DataSource.SiteLayout);
          setData(layout["data"]);
        }
      }
    }
  });
  return data;
};

const useEntity = (entityId: string, isEnabled: boolean) => {
  const { data: entity, status: status } = useQuery({
    queryKey: ["entity", entityId],
    queryFn: async () => {
      if (!entityId) return null;
      return await fetchEntity(entityId);
    },
    enabled: !!entityId && isEnabled,
  });
  return { entity, status };
};

const useEntities = (entityIds: string[], isEnabled: boolean) => {
  const queries = entityIds.map((entityId: string) => {
    return {
      queryKey: ["entityId", entityId],
      queryFn: async () => {
        if (!entityId) return null;
        return await fetchEntity(entityId);
      },
      enabled: !!entityId && isEnabled,
    }
  });
  return useQueries({
    queries: queries
  }).map(result => {
    return {
      entity: result?.data,
      status: result?.status ?? "pending"
    }
  });
}

export default useEntity;

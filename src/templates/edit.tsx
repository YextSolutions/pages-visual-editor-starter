import "../index.css";
import { GetPath, TemplateConfig, TemplateProps } from "@yext/pages";
import { DocumentProvider } from "../hooks/useDocument";
import {
  baseEntityPageLayoutsField,
  baseEntityVisualConfigField,
  VisualConfiguration,
  Editor,
  EntityDefinition,
  TemplateDefinition,
} from "../puck/editor";
import useEntityDocumentQuery from "../hooks/queries/useEntityDocumentQuery";
import { useEffect, useState, useCallback } from "react";
import { fetchEntity } from "../utils/api";
import { Config } from "@measured/puck";
import { puckConfigs } from "../puck/puck.config";
import { LoadingScreen } from "../puck/components/LoadingScreen";
import { Toaster } from "../puck/ui/Toaster";
import { getLocalStorageKey } from "../utils/localStorageHelper";

export const Role = {
  GLOBAL: "global",
  INDIVIDUAL: "individual",
};
const siteEntityId = "site";

export const config: TemplateConfig = {
  name: "edit",
};

// Editor is avaliable at /edit
export const getPath: GetPath<TemplateProps> = () => {
  return `edit`;
};

const getPuckRole = (role: string): string => {
  if (typeof document !== "undefined") {
    const roleValue = role;
    if (roleValue === "individual") {
      return Role.INDIVIDUAL;
    }
  }
  return Role.GLOBAL;
};

// used to track 'priority' of data, where lower is prioritized
export const enum DataSource {
  Entity = 0,
  LayoutId = 1,
  EntityLayout = 2,
  SiteLayout = 3,
  AnyLayout = 4,
  None = 5,
}

type TemplateData = {
  data: string;
  source: DataSource;
};

type LayoutDefinitionViewModel = {
  name: string;
  externalId: string;
  id: number; //internal
  visualConfiguration: string;
  templateId: string;
  entityCount: number;
  entityIds: string[];
  isDefault: boolean;
  layoutImageUrl: string;
};

const getPuckData = (
  role: string,
  siteEntityId: string,
  templateId: string,
  layoutId: string,
  baseEntity: any,
  layouts: LayoutDefinitionViewModel[],
  siteEntity: any
): string => {
  let data: TemplateData = { data: "", source: DataSource.None };

  // get puck data off base entity for ICs
  const baseEntityPageLayoutIds: string[] = [];
  if (baseEntity) {
    const configs = baseEntity[baseEntityVisualConfigField] ?? [];
    configs.forEach((config: VisualConfiguration) => {
      // only use the data directly off the entity for role 'INDIVIDUAL'
      if (
        templateId &&
        config.template === templateId &&
        data.source > DataSource.Entity &&
        role === Role.INDIVIDUAL
      ) {
        data = {
          data: config.data,
          source: DataSource.Entity,
        };
      }
    });
    (baseEntity[baseEntityPageLayoutsField] ?? []).forEach((id: string) => {
      baseEntityPageLayoutIds.push(id);
    });
  }

  // get siteEntity layout ids from the site entity
  const siteEntityPageLayoutIds: string[] = [];
  if (siteEntity) {
    (siteEntity?.response[baseEntityPageLayoutsField] ?? []).forEach(
      (id: string) => {
        siteEntityPageLayoutIds.push(id);
      }
    );
  }

  if (layouts) {
    layouts.forEach((layout: LayoutDefinitionViewModel) => {
      // apply the layoutId data, unless we have data from the base entity
      if (layout.externalId === layoutId) {
        if (layout.templateId !== templateId) {
          throw new Error(
            `Mismatch between layout and template: ${layoutId}, ${templateId}`
          );
        }
        if (role === Role.GLOBAL && data.source > DataSource.LayoutId) {
          data = {
            data: layout.visualConfiguration,
            source: DataSource.LayoutId,
          };
        }
      }
      // fallback to layout related to entity, related to the site, or just matching the template
      if (layout.templateId === templateId) {
        if (
          data.source > DataSource.EntityLayout &&
          baseEntityPageLayoutIds.includes(layout.externalId)
        ) {
          data = {
            data: layout.visualConfiguration,
            source: DataSource.EntityLayout,
          };
        }
        if (
          data.source > DataSource.SiteLayout &&
          siteEntityPageLayoutIds.includes(layout.externalId)
        ) {
          data = {
            data: layout.visualConfiguration,
            source: DataSource.SiteLayout,
          };
        }
        if (data.source > DataSource.AnyLayout) {
          data = {
            data: layout.visualConfiguration,
            source: DataSource.AnyLayout,
          };
        }
      }
    });
  }

  return JSON.parse(data.data);
};

const TARGET_ORIGINS = [
  "http://localhost",
  "https://dev.yext.com",
  "https://qa.yext.com",
  "https://sandbox.yext.com",
  "https://www.yext.com",
  "https://app-qa.eu.yext.com",
  "https://app.eu.yext.com",
];

// Render the editor
const Edit: () => JSX.Element = () => {
  const [template, setTemplate] = useState<TemplateDefinition>();
  const [entity, setEntity] = useState<EntityDefinition>();
  const [layoutId, setLayoutId] = useState<string>("");
  const [internalLayoutId, setInternalLayoutId] = useState<number>();
  const [puckConfig, setPuckConfig] = useState<Config>();
  const [mounted, setMounted] = useState<boolean>(false);
  const [role, setRole] = useState<string>("");
  const [puckData, setPuckData] = useState<any>({});
  const [histories, setHistories] = useState<Array<any>>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const populatePuckParams = useCallback(
    async (
      saveStateHistory: any,
      saveStateHash: string,
      baseEntity: any,
      layouts: LayoutDefinitionViewModel[],
      layoutId: string,
      template: TemplateDefinition
    ) => {
      const clearHistory = () => {
        setHistories([]);
        setHistoryIndex(-1);
        window.localStorage.removeItem(
          getLocalStorageKey(
            getPuckRole(role),
            template.id,
            layoutId,
            baseEntity.externalId
          )
        );
      };

      const localHistoryArray = window.localStorage.getItem(
        getLocalStorageKey(
          getPuckRole(role),
          template.id,
          layoutId,
          baseEntity.externalId
        )
      );

      // nothing in save_state table, start fresh from Content
      if (!saveStateHistory) {
        clearHistory();
        const siteEntity = await fetchEntity(siteEntityId);
        setPuckData(
          getPuckData(
            getPuckRole(role),
            siteEntityId,
            template?.id ?? "",
            layoutId,
            baseEntity,
            layouts,
            siteEntity
          )
        );
        return;
      }

      // nothing in localStorage, start fresh from VES data
      if (!localHistoryArray) {
        clearHistory();
        setPuckData(saveStateHistory.data);
        return;
      }

      const localHistoryIndex = JSON.parse(localHistoryArray).findIndex(
        (item: any) => item.id === saveStateHash
      );

      // if we have VES data, use it for current puck data
      setPuckData(saveStateHistory.data);

      // if saved history in local storage, use that for future/past
      if (localHistoryIndex !== -1) {
        setHistoryIndex(localHistoryIndex);
        setHistories(JSON.parse(localHistoryArray));
        return;
      }
      // otherwise start fresh
      clearHistory();
    },
    [
      role,
      entity,
      template,
      setHistories,
      setHistoryIndex,
      setPuckData,
      layoutId,
      getPuckRole,
    ]
  );

  const postParentMessage = (message: any) => {
    for (const targetOrigin of TARGET_ORIGINS) {
      window.parent.postMessage(message, targetOrigin);
    }
  };

  useEffect(() => {
    const handleParentMessage = (message: MessageEvent) => {
      if (!TARGET_ORIGINS.includes(message.origin)) {
        return;
      }
      if (typeof message.data === "object" && message.data.params) {
        setParams({
          ...message.data.params,
          _role: message.data.params.role,
          _entity: message.data.params.entity,
        });
        if (message.data.params.saveState) {
          populatePuckParams(
            JSON.parse(message.data.params.saveState.History), //TODO: ternary or optional chain this
            message.data.params.saveState.Hash,
            message.data.params.entity,
            message.data.params.layouts,
            message.data.params.layoutId,
            message.data.params.template
          );
        } else {
          populatePuckParams(
            null,
            "",
            message.data.params.entity,
            message.data.params.layouts,
            message.data.params.layoutId,
            message.data.params.template
          );
        }
      }
    };

    const listenForParentMessages = () => {
      window.addEventListener("message", handleParentMessage);
    };

    setMounted(true);
    listenForParentMessages();
    postParentMessage({ entityId: entity?.externalId ?? "" });

    return () => {
      window.removeEventListener("message", handleParentMessage);
    };
  }, []);

  async function setParams({ template, layoutId, _entity, _role, layouts }) {
    // get layout
    if (!layoutId) {
      layoutId = layouts[0].externalId;
    }

    const targetLayout = layouts.find(
      (layout: { externalId: any }) => layout.externalId === layoutId
    );
    const internalLayoutId = targetLayout?.id;
    setInternalLayoutId(internalLayoutId);
    setLayoutId(layoutId);
    setTemplate(template);
    // set local state
    setRole(_role);
    // set entity
    setEntity(_entity);
    // get puckConfig from hardcoded map
    const puckConfig = puckConfigs.get(template.id);
    setPuckConfig(puckConfig);
    window.history.replaceState(
      null,
      "",
      `edit?templateId=${template.id}&layoutId=${layoutId}&entityId=${_entity.externalId}&role=${getPuckRole(role)}`
    );
  }

  // get the document
  const { entityDocument } = useEntityDocumentQuery({
    templateId: template?.id,
    entityId: entity?.externalId,
  });
  const document = entityDocument?.response.document;

  const loadingMessage = !template
    ? "Loading template.."
    : !entity
      ? "Loading entity.."
      : !puckConfig
        ? "Loading configuration.."
        : !puckData
          ? "Loading data.."
          : !document
            ? "Loading document.."
            : "";

  const isLoading =
    !document || !puckData || !puckConfig || !template || !entity;

  const progress: number =
    (100 * (!!template + !!entity + !!puckConfig + !!puckData + !!document)) /
    5;

  if (!mounted || typeof navigator === "undefined") {
    return <></>;
  }

  return (
    <>
      <DocumentProvider value={document}>
        {!isLoading && !!puckData ? (
          <>
            <Editor
              selectedTemplate={template}
              layoutId={layoutId ?? ""}
              entityId={entity?.externalId ?? ""}
              puckConfig={puckConfig}
              puckData={puckData}
              role={getPuckRole(role)}
              isLoading={isLoading}
              postParentMessage={postParentMessage}
              internalEntityId={entity?.internalId}
              internalLayoutId={internalLayoutId}
              index={historyIndex}
              histories={histories}
            />
          </>
        ) : (
          <LoadingScreen progress={progress} message={loadingMessage} />
        )}
      </DocumentProvider>
      <Toaster closeButton richColors />
    </>
  );
};
export default Edit;

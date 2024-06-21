import "../index.css";
import {
  Template,
  GetPath,
  TemplateConfig,
  TemplateProps,
  TemplateRenderProps,
} from "@yext/pages";
import { Editor, EntityDefinition, TemplateDefinition } from "../puck/editor";
import { DocumentProvider } from "../hooks/useDocument";
import useEntityDocumentQuery from "../hooks/queries/useEntityDocumentQuery";
import { useEffect, useState, useCallback } from "react";
import { fetchEntities, fetchTemplates } from "../utils/api";
import { Config } from "@measured/puck";
import { puckConfigs } from "../puck/puck.config";
import { LoadingScreen } from "../components/puck-overrides/LoadingScreen";
import { toast } from "sonner";
import { Toaster } from "../components/ui/Toaster";
import { getLocalStorageKey } from "../utils/localStorageHelper";
import { GetPuckData } from "../hooks/GetPuckData";

export const Role = {
  GLOBAL: "global",
  INDIVIDUAL: "individual",
};
const siteEntityId = "site";
const layoutEntityType = "ce_pagesLayout";

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
const Edit: Template<TemplateRenderProps> = () => {
  const [templates, setTemplates] = useState<TemplateDefinition[]>();
  const [template, setTemplate] = useState<TemplateDefinition>();
  const [entities, setEntities] = useState<EntityDefinition[]>();
  const [entity, setEntity] = useState<EntityDefinition>();
  const [layoutId, setLayoutId] = useState<string>("");
  const [internalLayoutId, setInternalLayoutId] = useState<number>();
  const [puckConfig, setPuckConfig] = useState<Config>();
  const [mounted, setMounted] = useState<boolean>(false);
  const [localStorage, setLocaleStorage] = useState<string>("");
  const [role, setRole] = useState<string>("");

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
      if (typeof message.data === "object") {
        setParams({ ...message.data, _role: message.data.role });
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

  async function setParams({ templateId, layoutId, entityId, _role }) {
    // get templates
    const fetchedTemplates = await fetchTemplates();
    let targetTemplate: TemplateDefinition = fetchedTemplates[0];
    if (templateId) {
      let found = false;
      fetchedTemplates.forEach((fetchedTemplate: TemplateDefinition) => {
        if (fetchedTemplate.id === templateId) {
          targetTemplate = fetchedTemplate;
          found = true;
        }
      });
      if (!found) {
        toast.error(`Could not find template with id '${templateId}'`);
      }
    }
    const fetchedLayouts = await fetchEntities([layoutEntityType]);
    if (!layoutId) {
      layoutId = fetchedLayouts[0].externalId;
    }
    const targetLayout = fetchedLayouts.find(
      (layout) => layout.externalId === layoutId,
    );
    const internalLayoutId = targetLayout?.internalId;
    setInternalLayoutId(internalLayoutId);
    setLayoutId(layoutId);
    setTemplates(fetchedTemplates);
    setTemplate(targetTemplate);
    // get entities
    const fetchedEntities = await fetchEntities(targetTemplate.entityTypes);
    let targetEntity: EntityDefinition = fetchedEntities[0];
    if (entityId) {
      let found = false;
      fetchedEntities.forEach((fetchedEntity: EntityDefinition) => {
        if (fetchedEntity.externalId === entityId) {
          targetEntity = fetchedEntity;
          found = true;
        }
      });
      if (!found) {
        toast.error(
          `Could not find entity with id '${entityId}' belonging to template '${targetTemplate.id}'`,
        );
      }
    }
    setEntities(fetchedEntities);
    setEntity(targetEntity);
    // set local state
    setRole(_role);
    // get puckConfig from hardcoded map
    const puckConfig = puckConfigs.get(targetTemplate.id);
    setLocaleStorage(
      typeof window !== "undefined"
        ? window.localStorage.getItem(
            getLocalStorageKey(
              getPuckRole(role),
              targetTemplate.id,
              layoutId,
              targetEntity.externalId,
            ),
          ) ?? ""
        : "",
    );
    setPuckConfig(puckConfig);
    window.history.replaceState(
      null,
      "",
      `edit?templateId=${targetTemplate.id}&layoutId=${layoutId}&entityId=${targetEntity.externalId}&role=${getPuckRole(role)}`,
    );
  }

  let puckData = GetPuckData(
    getPuckRole(role),
    siteEntityId,
    template?.id ?? "",
    layoutId,
    entity?.externalId ?? "",
  );
  // use localStorage if it exists
  if (localStorage) {
    puckData = localStorage;
  }

  // get the document
  const { entityDocument } = useEntityDocumentQuery({
    templateId: template?.id,
    entityId: entity?.externalId,
  });
  const document = entityDocument?.response.document;

  const loadingMessage = !templates
    ? "Loading templates.."
    : !entities
      ? "Loading entities.."
      : !puckConfig
        ? "Loading configuration.."
        : !puckData
          ? "Loading data.."
          : !document
            ? "Loading document.."
            : "";

  const isLoading =
    !document ||
    !puckData ||
    !puckConfig ||
    !template ||
    !templates ||
    !entity ||
    !entities;

  const progress: number =
    (100 *
      (!!templates + !!entities + !!puckConfig + !!puckData + !!document)) /
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

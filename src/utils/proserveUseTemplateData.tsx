import { TemplateRenderProps } from "@yext/pages/*";
import { createCtx } from "./createCtx";

type TemplateDataProviderProps = TemplateRenderProps;

/**
 * A context provider that allows you to access all the TemplateRenderProps on the BaseProfile
 * from a child component without needing passthrough props.
 */
const [useProserveTemplateData, ProserveTemplateDataProvider] =
  createCtx<TemplateDataProviderProps>(
    "Attempted to call useProserveTemplateData outside of ProserveTemplateDataProvider"
  );

export { useProserveTemplateData, ProserveTemplateDataProvider };

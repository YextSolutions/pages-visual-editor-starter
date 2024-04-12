import { createCtx } from "../common/createCtx";
import { TemplateProps } from '@yext/pages';
import { BaseProfile } from "../types/entities";

type TemplateDataProviderProps = TemplateProps<BaseProfile>;

/**
 * A context provider that allows you to access all the TemplateProps on the BaseProfile
 * from a child component without needing passthrough props.
 */
const [useTemplateData, TemplateDataProvider] =
  createCtx<TemplateDataProviderProps>(
    "Attempted to call useTemplateData outside of TemplateDataProvider"
  );

export { useTemplateData, TemplateDataProvider };
// @ts-nocheck
import Handlebars from "handlebars";
import { StreamDocument } from "@yext/visual-editor/section-library-support";
import { normalizeSlug } from "@yext/visual-editor/section-library-support";

let customCodeHandlebarsHelpersRegistered = false;

/**
 * Registers Handlebars helpers that are available in CustomCodeSection HTML.
 *
 * `slugify` joins its arguments in order and normalizes the resulting string.
 */
export const registerCustomCodeHandlebarsHelpers = () => {
  if (customCodeHandlebarsHelpersRegistered) {
    return;
  }

  Handlebars.registerHelper("slugify", (...args: unknown[]) => {
    const values = args.slice(0, -1);
    const content = values
      .map((value) => (value == null ? "" : String(value)))
      .join("");

    return normalizeSlug(content);
  });

  customCodeHandlebarsHelpersRegistered = true;
};

/**
 * Compiles and renders a Handlebars template string with the provided data if Handlebars syntax is detected.
 *
 * If the HTML string contains Handlebars expressions (e.g., {{name}}), this function will compile and render
 * the template using the given data (typically the stream document). If compilation or rendering fails, or if
 * no Handlebars expressions are present, the original HTML string is returned.
 *
 * The template can use the helpers registered by `registerCustomCodeHandlebarsHelpers`.
 *
 * @param html - The HTML string, possibly containing Handlebars template syntax.
 * @param data - The data object to use for template rendering (e.g., streamDocument).
 * @returns The processed HTML string with Handlebars expressions replaced, or the original HTML if not applicable.
 */
export const processHandlebarsTemplate = (
  html: string,
  data: StreamDocument
): string => {
  if (!html) {
    return html;
  }

  if (/{{[^}]+}}/.test(html)) {
    try {
      registerCustomCodeHandlebarsHelpers();
      const template = Handlebars.compile(html);
      return template(data);
    } catch (err) {
      const templateIdentifier =
        data.__?.name || data.slug || data.id || "unknown-template";
      console.warn(
        "Handlebars template render failed, falling back to raw HTML",
        {
          error: err,
          templateIdentifier,
        }
      );
      return html;
    }
  }

  return html;
};

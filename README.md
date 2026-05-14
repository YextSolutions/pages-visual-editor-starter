# PAGES-VISUAL-EDITOR-STARTER (registry templates branch)

## Setup

Run `npm i` to install dependencies.

## Create Components

- Create a directory `src/registry/<Name of Template>`
- Write components under the subdirectory `src/registry/<Name of Template>/components`. Each component should be self-contained in one TSX file.
  - Components should be written with [`@puckeditor/core`](https://puckeditor.com/) and [`@yext/visual-editor`](https://github.com/yext/visual-editor)
  - Each file should export a single YextComponentConfig object with the same name as the file.
- Add the default layout data at `src/registry/<Name of Template>/defaultLayout.json`

#### Example Component

```tsx
import * from React from "react"
import { useTranslation } from "react-i18next";
import { PuckComponent } from "@puckeditor/core";
import { YextEntityField, TranslatableString, useDocument, YextFields, resolveComponentData, YextComponentConfig} from "@yext/visual-editor"


// Defines what the possible user-settable values are
type ExampleComponentProps = {
   text: YextEntityField<TranslatableString>;
   textAlignment: "left" | "right" | "center";
}

// Defines how the user-settable values should appear in the editor
const exampleSectionFields: YextFields<ExampleComponentProps> = {
   text: {
      type: "entityField", // the entity field type allows values from Knowledge Graph
      label: "Text",
      filter: {
         types: ["type.string"], // the Knowledge Graph data type allowed
      },
   },
   textAlignment: {
      type: "radio" // a built-in Puck type
      label: "Text Alignment",
      options: [
         {label: "Left", value: "left"},
         {label: "Center", value: "center"},
         {label: "Right", value: "right"},
      ]
   }
};

// Defines how the component should render
const ExampleSectionComponent: PuckComponent<ExampleComponentProps> = (props) => {
   const {text, textAlignment} = props;

   // Accesses the locale for the current page
   const { i18n } = useTranslation();
   const locale = i18n.language;

   // Accesses the entity stream document for the current page
   const streamDocument = useDocument();

   // Resolves the text field - handling entity vs. static value and localization
   const resolvedText = resolveComponentData(data.text, locale, streamDocument);

   return (
      <p style={{textAlign: textAlignment}}>{resolvedText}</p>
   )
}

// The exported YextComponentConfig
export const ExampleSection: YextComponentConfig<ExampleComponentProps> == {
   label: "Example Section",
   fields: exampleSectionFields,
   // The default values for the props of component
   defaultProps: {
      text: {
         field: "name", // the entity field API name
         constantValue: {
            defaultValue: "Demo Text" // a static value used on all pages
         },
         constantValueEnabled: false // whether to default to using the field or constant value
      },
      textAlignment: "left"
   },
   render: props => <ExampleSectionComponent {...props}>
}
```

#### Example Default Layout Data

This can be seeded from clicking "Copy Layout" in the local editor.

```json
{
  "root": {
    "props": {
      "title": {
        // the meta title of the page
        "field": "name",
        "constantValue": "",
        "constantValueEnabled": false
      },
      "description": {
        // the meta description of the page
        "field": "description",
        "constantValue": "",
        "constantValueEnabled": false
      }
    }
  },
  // unused
  "zones": {},
  // the ordered list of default components and their default props
  "content": [
    {
      // matches ExampleComponent.defaultProps
      "type": "ExampleComponent",
      "props": {
        "text": {
          "field": "name",
          "constantValue": {
            "defaultValue": "Demo Text"
          },
          "constantValueEnabled": false
        },
        "textAlignment": "left"
      }
    }
  ]
}
```

#### Current Limitations

- Components may only use the dependencies pre-installed in this branch of the repo
- Components may not use local/relative imports (each component must be self-contained in this)
- Local assets are not supported
  - Images must be URL references or inline SVGs
  - Font Family names must be Google Font family names or the exact font family name uploaded to the Yext system

## Test Components Locally

1. Run `npm run dev`
2. If needed, authenticate with your Yext account
3. When the index page opens, click the `local-editor` link at the bottom of the page
4. To modify the entity data available in the local editor, modify the auto-generated `stream.config.ts`

## Uploading Templates to the Platform

### Add Template Metadata

1. Add `src/registry/<Name of Template>/template.json`

Fill in the fields using the following shape

```json
{
   // Name of the template to be used in the platform
   "displayName": string,
   // Description of the template to be used in the template gallery
   "description": string,
}
```

### Upload Templates

API information coming soon.

# PAGES-VISUAL-EDITOR-STARTER (bespoke templates branch)

For use with the [pages-template-generation](https://github.com/yext/pages-template-generation-skill) Codex skill

## Setup

1. Follow the skill's README installation instructions

2. In this repo, run `npm i` to install dependencies.

## Generate Components

Open this project in Codex and run the skill with the following prompts:

To copy an existing site:

> Use $vle-generate-template for `<Name of Template>` using `<url>`. You may use subagents if directed.

To use local html/css files:

> Use $vle-generate-template for `<Name of Template>` using `<path to local html/css files>`. You may use subagents if directed.

To make updates to previously-generated components:

> Use $vle-revise-template for `<Name of Template>`. Make these changes: …

To generated additional components that match the template's look and feel:

> Use $vle-extend-template for `<Name of Template>`

### Expected Output

- A directory will be created in `src/registry/<Name of Template>`. This directory will contain
  - a subdirectory `components` containing a single TSX file for each component
  - `defaultLayout.json` - the layout data that will be preloaded into the platform editor
  - a subdirectory `.captured-artifact` - the data captured from the source material. Only used for debugging; unused in the final template
  - a subdirectory `.workflow-artifact` - the metadata of a skill run results. Only used for debugging; unused in the final template

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

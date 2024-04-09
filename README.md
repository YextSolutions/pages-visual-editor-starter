# PAGES-VISUAL-EDITOR-STARTER

### Prerequisites

1. Have the Yext CLI installed: https://hitchhikers.yext.com/guides/cli-getting-started-resources/01-install-cli/
1. Have Deno installed, version 1.21.0 or later: https://deno.land/manual/getting_started/installation
1. Have node installed, version 18.4.0 or later: https://nodejs.org/en/download/

   - It's recommend to use nvm: https://github.com/nvm-sh/nvm#installing-and-updating or via brew `brew install nvm`

1. Have a Yext account. This is necessary for production builds, deploying on Yext Pages, and pulling local stream document data via `yext pages generate-test-data`.

### Clone this repo and install dependencies

```shell
git clone https://github.com/YextSolutions/pages-visual-editor-starter
cd pages-visual-editor-starter
npm install
```

Add a YEXT_PUBLIC_API_KEY into the .env.local file. This can be generated via the Developer Console.

### Recommended Development Flow

While _developing locally_, run the following command:

```
npm run dev
```

This command will start a Vite-powered dev server that will enable hot-reloading. Additionally, the command will generate a `localData` directory that contains a subset of your Knowledge Graph data. This command is automatically in "dynamic" mode, which means it will pull data updates automatically from your Knowledge graph, so real-time data changes in your Yext account will be reflected in your local dev site.

NOTE: Whenever you make changes to your stream definitions, you must re-run `npm run dev` for the system to update the `features.json` and the required entities to power your site.

_Before committing_ your code, we recommend running the following command:

```
npm run prod
```

This command will generate a production build of your site, so you can ensure there are no build errors or unexpected behavior. This build step replicates the production build environment used in the Yext system, and serves your data at `localhost:8000`.

In practice, development builds (via `npm run dev`) and production builds compile and bundle assets differently. For local development, ES Modules are loaded directly by the browser, allowing fast iteration during local development and also allows for hot module replacement (HMR). Other things like CSS are also loaded directly by the browser, including linking to sourcemaps. During a production build all of the different files are compiled (via ESBuild for jsx/tsx) and minified, creating assets as small as possible so that the final html files load quickly when served to a user. Tree-shaking also occurs during the build step, in which any unused dependencies are removed from your final build.

### Other Useful commands

`yext init` - Authenticates the Yext CLI with your Yext account

`yext pages generate-test-data` - pull an example set of `localData` from your account. This command is packaged within `npm run dev'.

### Setting up Authentication Policies 

We recommend adding a Page-Level Authentication for the /edit page. Detailed instructions here: https://hitchhikers.yext.com/guides/set-up-yext-auth-protected-site/

# Gitup

Gitup shows some recent stats about your `git`-activity such as _commits_, `diffs` and various stats that helps to remind you of what you have acomplished during the day or week. The name is a combination of _git_ and _standup_.

![Show branch additions and deletions](https://i.imgur.com/PWQTWfp.png)

## Features

## Requirements

## Extension Settings

## Known Issues

## Release Notes

### 1.0.0

-----------------------------------------------------------------------------------------------------------

## Development

This project is based on [**vscode-webview-react** by _rebornix_](https://github.com/rebornix/vscode-webview-react)

### Run

Run following commands in the terminal

```shell
yarn
yarn build
```
And then press `F5`, in Extension Development Host session, run `Gitup` command from command palette.

### Under the hood

Things we did on top of Create React App TypeScript template

* We inline `index.html` content in `ext-src/extension.ts` when creating the webview
* We set strict security policy for accessing resources in the webview.
  * Only resources in `/build` can be accessed
  * Only resources whose scheme is `vscode-resource` can be accessed.
* For all resources we are going to use in the webview, we change their schemes to `vscode-resource`
* Since we only allow local resources, absolute path for styles/images (e.g., `/static/media/logo.svg`) will not work. We add a `.env` file which sets `PUBLIC_URL` to `./` and after bundling, resource urls will be relative.
* We add baseUrl `<base href="${vscode.Uri.file(path.join(this._extensionPath, 'build')).with({ scheme: 'vscode-resource' })}/">` and then all relative paths work.

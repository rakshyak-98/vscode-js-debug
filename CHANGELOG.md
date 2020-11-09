# Changelog

This changelog records changes to stable releases since 1.50.2. "TBA" changes here may be available in the [nightly release](https://github.com/microsoft/vscode-js-debug/#nightly-extension) before they're in stable. Note that the minor version (`v1.X.0`) corresponds to the VS Code version js-debug is shipped in, but the patch version (`v1.50.X`) is not meaningful.

## TBA

- feat: allow debugging node internals ([#823](https://github.com/microsoft/vscode-js-debug/issues/823))
- feat: show diagnostic tool in a webview and integrate with vscode theme ([ref](https://github.com/microsoft/vscode/issues/109526), [ref](https://github.com/microsoft/vscode/issues/109529), [ref](https://github.com/microsoft/vscode/issues/109531))
- feat: allow specifying defaults runtimeExecutables ([#836](https://github.com/microsoft/vscode-js-debug/issues/836))
- feat: support vscode webview resource uri sourcemaps ([#820](https://github.com/microsoft/vscode-js-debug/pull/820))
- fix: support chrome dev and beta builds ([ref](https://github.com/OmniSharp/omnisharp-vscode/issues/4108))
- fix: race causing potentially corrupted log files ([#825](https://github.com/microsoft/vscode-js-debug/issues/825))
- fix: extension host debugging pausing in internals ([ref](https://github.com/microsoft/vscode/issues/105047))
- fix: make urls ending in `/*` also match the base path ([#834](https://github.com/microsoft/vscode-js-debug/issues/834))
- fix: ignore hash portion of url when determining matches ([#840](https://github.com/microsoft/vscode-js-debug/issues/840))
- fix: automatically add a \* suffix to sourceMapPathOverrides that lack one ([#841](https://github.com/microsoft/vscode-js-debug/issues/841))
- fix: don't show `Debug: Open Link` command in web where it doesn't work

## v1.51.0 - 2020-10-26

- feat: add a diagnostic tool under the `Create Diagnostic Information` command ([#260](https://github.com/microsoft/vscode-js-debug/issues/260))
- feat: add an advanced `perScriptSourcemaps` option, when loading individual unbundled scripts
- feat: suffix rather than prefix setter/getters ([ref](https://github.com/microsoft/vscode/issues/108036))
- fix: include the response body in sourcemap http error info
- fix: extensions being able to activate before the debugger attaches ([ref](https://github.com/microsoft/vscode/pull/108141))
- fix: debugger failing to connect on Node 14 on Windows 7 ([#791](https://github.com/microsoft/vscode-js-debug/issues/791))
- fix: inherit the system's NODE_OPTIONS if set ([#790](https://github.com/microsoft/vscode-js-debug/issues/790))
- fix: use `*` as a urlFilter by default only for launching (not attaching) ([ref](https://github.com/microsoft/vscode-chrome-debug/issues/719))
- fix: exclude `nvm`-installed binaries from auto attach ([#794](https://github.com/microsoft/vscode-js-debug/issues/794))
- fix: smart auto attaching briefly debugging a process when using `code` from the CLI ([#783](https://github.com/microsoft/vscode-js-debug/issues/783))
- fix: realtime performance not being shown when a webworker is selected ([ref](https://github.com/microsoft/vscode-js-profile-visualizer/issues/23))
- fix: breakpoints sometimes not being rebound after navigating away from and back to a page ([#807](https://github.com/microsoft/vscode-js-debug/issues/807))
- fix: breakpoints not being bound correctly on Blazor apps ([#796](https://github.com/microsoft/vscode-js-debug/issues/796))
- fix: remote source maps don't resolve correctly with an absolute sourceroot shorter than the local path ([ref](https://github.com/microsoft/vscode/issues/108418))
- fix: terminal links not setting the first workspace folder ([#701](https://github.com/microsoft/vscode-js-debug/issues/701))
- fix: send ctrl+c to kill nodemon running in debug terminal ([ref](https://github.com/microsoft/vscode/issues/108289))
- fix: increase auto attach timeout ([#806](https://github.com/microsoft/vscode-js-debug/issues/806))
- fix: stepping into function on the first line of a file with a breakpoint ([ref](https://github.com/microsoft/vscode/issues/107859))
- fix: webpage opening twice when using `serverReadyAction` with `console: integratedTerminal` ([#814](https://github.com/microsoft/vscode-js-debug/issues/814))
- refactor: improve performance when loading very many sourcemaps for pages that don't need authentication
- refactor: remove runtime dependency on TypeScript ([ref](https://github.com/microsoft/vscode/issues/107680))

## 1.50.2 - 2020-10-02

Start of changelog records
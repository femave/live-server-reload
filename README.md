# LiveR [WIP]

Inspired on [denon](https://github.com/eliassjogreen/denon)

## About

LiveR, add script that automaticaly copy the folder where you're working to xampp
server folder where the server is deployed for development pruposes. And automatically
restart the server when it detect some changes.
At the moment only works for php files.

## Install

install command 
`deno install liver --allow-write --allow-read --allow-run https://raw.githubusercontent.com/femave/live-server-reload/master/mod.ts`

## Usage

```
Usage:
    liver [PATH]* [XAMPPATHH]*

    * optional

OPTIONS:
    PATH     ==> "path of your repository folder", if no path provided we take the current path you're executing liver. ex: "C:\\User\\ProjectFolder"
    XAMPPATH ==> "xampp path" (normaly in "C:\\xampp\\htdocs")
```

## Todo

- [x] Add download url IMPORTANT. (github raw url, why not if its posible with Deno!)
- [x] Optional xamp path.
- [x] Escape \ character from path to add with simple one \.
- [ ] Detect current repository on url to run only with liver command.
- [ ] Allow more files type.
- [x] \(DEPRECATED) Only move changed files. Not needed if we move bundles.
- [x] Refactor code.
- [ ] Generate bundle for copy

# CDENON [WIP]

Inspired on [denon](https://github.com/eliassjogreen/denon)

## About

CDENON, add script that automaticaly copy the folder where you're working to xampp
server folder where the server is deployed for development pruposes. And automatically
restart the server when it detect some changes.
At the moment only works for php files.

## Install

install command 
`deno install cdenon --allow-write --allow-read --allow-run https://raw.githubusercontent.com/femave/live-server-reload/master/mod.ts`

## Usage

```
Usage:
    cdenon [PATH] [XAMPPATHH]*

    * optional

OPTIONS:
    PATH     ==> "path of your repository folder", ex: "C:\\User\\ProjectFolder"
    XAMPPATH ==> "xampp path" (normaly in "C:\\xampp\\htdocs")
```

## Todo

-   [x] Add download url IMPORTANT. (github raw url, why not if its posible with Deno!)
-   [x] Optional xamp path.
-   [ ] Escape \ character from path to add with simple one \.
-   [ ] Detect current repository on url to run only with cdenon command.
-   [ ] Allow more files type.
-   [ ] Clean code.
-   [ ] Only move changed files.

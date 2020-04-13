import copyDir from "./copy-directory.ts";

const options = {
    xamppDirServer: 'C:\\xampp\\htdocs',
    xamppStart: 'C:\\xampp\\xampp_start.exe',
    xamppStop: 'C:\\xampp\\xampp_stop.exe',
}

const args = Deno.args;
const path = args[0] || Deno.cwd();

!!args[1] ? options.xamppDirServer = args[1] : null;

// START SERVER
console.log('===== STARTING SERVER =====')
Deno.run({args: [options.xamppStart]});

copyDir(options, path);
import minimist from "minimist";


export class AppArgs {
    rawArgs: minimist.ParsedArgs

    constructor() {
        this.rawArgs = minimist(process.argv.slice(2));
        console.log(this);
    }

    public hasFlag(flag: string): boolean {
        return Boolean(this.rawArgs._[flag] || this.rawArgs["--"][flag] || this.rawArgs[flag]);
    }
}

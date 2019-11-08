import * as yargs from "yargs";

export class AppArgs {
    rawArgs: yargs.Arguments

    constructor() {
        this.rawArgs = yargs
            .command("data", "打开应用程序数据文件夹")
            .argv;
    }

    public hasFlag(flag: string): boolean {
        return Boolean(this.rawArgs._[flag] || this.rawArgs[flag]);
    }

    public consumeComand(): string {
        if (this.rawArgs._.length === 0) {
            return null;
        }
        return this.rawArgs._.shift();
    }
}

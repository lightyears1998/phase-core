import "reflect-metadata";
import commander from "commander";
import open from "open";
import { App } from "./App";

const app = new App();

const argParser = new commander.Command();
argParser
    .command("backup")
    .action(() => {
        open(app.programDir);
    });


argParser.parse(process.argv);

app.start();

export {
    app
};

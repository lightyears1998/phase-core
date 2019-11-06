import "reflect-metadata";
import fs from "fs";
import path from "path";
import * as inquirer from "inquirer";
import { App } from "./App";

function getPackageVersion(): string {
    let packageJSON = fs.readFileSync(path.join(__dirname, "/../package.json"), {encoding: "utf8"});
    let packageInfo = JSON.parse(packageJSON);
    return packageInfo.version;
}

console.log(getPackageVersion())

inquirer.prompt([
    {
        name:    "selection",
        message: "选择你喜欢的目标吧。",
        type:    "list",
        choices: ["目标", "退出"]
    }
]).then(answer => {
    console.log(answer);
});

const app = new App();
app.start();

export {
    app
};

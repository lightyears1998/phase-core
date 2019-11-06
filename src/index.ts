import "reflect-metadata";
import * as inquirer from "inquirer";
import { App } from "./App";
import { version } from "./../package.json";

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

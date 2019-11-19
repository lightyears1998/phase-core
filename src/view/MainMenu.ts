import * as inquirer from "inquirer";

export const mainMenu = inquirer.prompt([
    {
        name:    "mainMenu",
        message: "主菜单",
        type:    "list",
        choices: ["设置", "退出"]
    }
]).then(answer => {
    console.log(answer);
});

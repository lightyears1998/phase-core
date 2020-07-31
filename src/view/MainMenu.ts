import { DistinctQuestion } from "inquirer";


const mainMenuOptions: DistinctQuestion = {
    name:    "mainMenuOptions",
    message: "主菜单",
    type:    "list",
    choices: ["设置", "退出"]
};

export { mainMenuOptions };

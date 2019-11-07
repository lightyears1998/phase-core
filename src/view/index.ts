import * as inquirer from "inquirer";

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

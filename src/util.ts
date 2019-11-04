import os from "os";
import chalk from "chalk"
import figlet from "figlet";

export function printTitle(): void {
  let text = (txt) => figlet.textSync(txt, "Star Wars");
  console.log(text("Phase"));
  console.log(chalk.cyan("Ever believe all good things are about to happend."));
}

export function checkOS(): void {
  switch (os.platform()) {
  case "win32":
    console.log("Happy win32");
    break;
  case "linux":
    console.log("Happy linux.");
    break;
  default:
    throw "Platform not supported.";
  }
}

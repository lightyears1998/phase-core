import os from "os";
import fs from "fs";
import figlet from "figlet";


export class Application {  
  constructor() {
    this.setPath();
    this.printTitle();
  }

  private printTitle(): void {
    let textArt = (text) => figlet.textSync(text, "Star Wars");
    console.log(textArt("Phase"));
  }

  private setPath(): void {
    let platform = os.platform();
    switch (platform) {
      case "win32": {

      }
      case "linux": {

      }
      default: {
        throw "不支持的平台：" + platform;
      }
    }
  }
};

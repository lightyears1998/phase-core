import os from "os";
import fs from "file-system";
import path from "path";
import figlet from "figlet";


export class App {
  configPath: string
  dataPath: string

  constructor() {
    this.setPath();
    this.ensurePath();
  }

  private setPath(): void {
    const platform = os.platform();
    const userHome = os.homedir();

    switch (platform) {
        case "win32": {
          const projectHome = path.resolve(userHome + "/AppData/Local/Phase");
          this.configPath = path.resolve(projectHome + "/config.json");
          this.dataPath = path.resolve(projectHome + "/data.sqlite3")
          break;
        }

        // case "linux": {
        //   this.configPath = path.resolve();
        //   this.dataPath = path.resolve()
        //   break;
        // }

        default: {
          throw "不支持的平台：" + platform;
        }
    }
  }

  private ensurePath() : void {
    fs.mkdirSync(path.dirname(this.configPath));
    fs.mkdirSync(path.dirname(this.dataPath));
  }

  public start(): void {
    this.printTitle();
  }

  private printTitle(): void {
    const textArt = (text): string => figlet.textSync(text, "Star Wars");
    console.log(textArt("Phase"));
  }
}


class AppConfig {
  userName: string;

  static fromFile(filepath: string): AppConfig {
    const config = new AppConfig();
    return null;
  }
}

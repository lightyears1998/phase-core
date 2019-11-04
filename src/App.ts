import os from "os";
import path from "path";
import fs from "file-system";
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
    const homeDir = os.homedir();

    switch (platform) {
        case "win32": {
          const projectRoot = path.resolve(homeDir + "/AppData/Local/Phase");
          this.configPath = path.resolve(projectRoot + "/config.json");
          this.dataPath = path.resolve(projectRoot + "/data.sqlite3");
          break;
        }

        case "linux": {
          const projectRoot = path.resolve(homeDir + "/.phase");
          this.configPath = path.resolve(projectRoot + "/config.json");
          this.dataPath = path.resolve(projectRoot + "/data.sqlite3");
          break;
        }

        default: {
          throw "不支持的平台：" + platform;
        }
    }
  }

  private ensurePath(): void {
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
